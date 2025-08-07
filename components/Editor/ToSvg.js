import { util } from 'fabric';

export const exportCurvedTextToSvg = (curvedText) => {
  let fontFamily = curvedText.fontFamily.replace(/"/g, "'");
  let fontSize = curvedText.fontSize;
  let fontStyle = curvedText.fontStyle;
  let fontWeight = curvedText.fontWeight;
  let fontOpacity = curvedText.opacity;
  let fill = curvedText.fill;
  let letterSpacing = curvedText.charSpacing / 1000 * fontSize;

  if (curvedText.path) {
    let path = curvedText.path;
    let fillPath = path.fill ? path.fill : 'none';
    let strokePath = path.stroke ? path.stroke : 'none';
    let strokeWidth = path.strokeWidth ? path.strokeWidth : 0;

    // get path length
    let pathData = curvedText.path.path;
    let pathInfo = util.getPathSegmentsInfo(pathData);
    let pathLength = pathInfo[pathInfo.length - 1].length;

    // clone pathdata for reversing
    pathData = JSON.parse(JSON.stringify(pathData));

    // crop/align path to origin
    let pathDataCropped = cropPathData(pathData);

    pathData = pathDataCropped;

    // reverse pathdata to emulate side="right"
    if (curvedText.pathSide === 'right') {
      pathData = reversePathData(pathData);
    }

    // get pathdata d string
    let d = pathData.flat().join(' ');
    let id = Math.random().toString(36).substr(2, 9);
    let dominantbaseline = 'auto';
    let pathStartOffset = curvedText.pathStartOffset;
    let dy = 0;

    // translate fabric.js baseline offsets to svg dominant baseline values
    if (curvedText.pathAlign === 'center') {
      dominantbaseline = 'middle';
    } else if (curvedText.pathAlign === 'baseline') {
      dominantbaseline = 'auto';
    } else if (curvedText.pathAlign === 'ascender') {
      dominantbaseline = 'hanging';
    } else if (curvedText.pathAlign === 'descender') {
      dominantbaseline = 'auto';
      dy = (fontSize / 100) * -22;
    }

    let textAnchor = 'start';
    if (curvedText.textAlign == 'center') {
      textAnchor = 'middle';
      pathStartOffset += pathLength / 2;
    }

    if (curvedText.textAlign == 'right') {
      textAnchor = 'end';
      pathStartOffset += pathLength;
      pathData = reversePathData(pathData);
    }

    // append texpath to defs or as rendered element
    let textPathEl;
    if (
      (fillPath && fillPath !== 'none') ||
      (!strokePath && strokePath !== 'none')
    ) {
      textPathEl = `<path id="textOnPath${id}" fill="${fillPath}" stroke="${strokePath}" stroke-width="${strokeWidth}" d="${d}" />`;
    } else {
      textPathEl = `<defs>
          <path id="textOnPath${id}" d="${d}" />
        </defs>`;
    }

    return curvedText._createBaseSVGMarkup(
        curvedText.path
        ? [
            textPathEl,
            `<text
                font-family="${fontFamily.replace(/"/g, "'")}"
                fill="${fill}"
                font-size="${fontSize}"
                font-style="${fontStyle}"
                font-weight="${fontWeight}"
                opacity="${fontOpacity}"
                letter-spacing="${letterSpacing}"
                >
                  <textPath text-anchor="${textAnchor}"
                  dominant-baseline="${dominantbaseline}"
                  startOffset="${pathStartOffset}"
                  href="#textOnPath${id}"
                  xlink:href="#textOnPath${id}">
                  <tspan dy="${dy}">${curvedText.text}</tspan>
                  </textPath>
                </text>`,
          ]
        : [
            `<text
              xml:space="preserve"
              font-family="${fontFamily}"
              font-size="${fontSize}"
              font-style="${fontStyle}"
              font-weight="${fontWeight}"
              >
              ${curvedText.addPaintOrder()}
              ${curvedText.text}
              </text>`,
          ],
      { noStyle: true, withShadow: true },
    );
  } else {
    return curvedText._createBaseSVGMarkup(curvedText._toSVG(), {
      noStyle: true,
      withShadow: true,
    });
  }
};

function cropPathData(pathData) {
  // temporary path to get bbox
  let ns = 'http://www.w3.org/2000/svg';
  let svgTmp = document.createElementNS(ns, 'svg');
  let pathTmp = document.createElementNS(ns, 'path');
  let d = pathData
    .map((com) => {
      return com.join(' ');
    })
    .join(' ');
  pathTmp.setAttribute('d', d);
  svgTmp.append(pathTmp);
  document.body.append(svgTmp);
  let bb = svgTmp.getBBox();
  svgTmp.remove();

  let offsetX = bb.x + bb.width / 2;
  let offsetY = bb.y + bb.height / 2;
  let pathDataCropped = [];

  pathData.forEach((com, i) => {
    let type = com.shift();
    let values = com;
    let valuesNew = [];

    if (values.length) {
      for (let v = 0; v < values.length - 1; v += 2) {
        let pt = { x: values[v] - offsetX, y: values[v + 1] - offsetY };
        valuesNew.push(pt.x, pt.y);
      }
    }
    pathDataCropped.push([type, valuesNew].flat());
  });

  return pathDataCropped;
}

/**
 * Reverse pathdata
 */
function reversePathData(pathData) {
  // start compiling new path data
  let pathDataNew = [];

  /**
   * Add closing lineto:
   * needed for path reversing or adding points
   */
  const addClosePathLineto = (pathData) => {
    let pathDataL = pathData.length;
    let closed = pathData[pathDataL - 1][0].toLowerCase() === 'z';
    let M = pathData[0];
    let [x0, y0] = [M[1], M[2]];
    let lastCom = closed ? pathData[pathDataL - 2] : pathData[pathDataL - 1];
    let lastComL = lastCom.length;
    let [xE, yE] = [lastCom[lastComL - 2], lastCom[lastComL - 1]];
    if (closed && (x0 !== xE || y0 !== yE)) {
      pathData.pop();
      pathData.push(['L', x0, y0], ['Z']);
    }
    return pathData;
  };

  // helper to rearrange control points for all command types
  const reverseControlPoints = (values) => {
    let controlPoints = [];
    let endPoint = [];
    for (let p = 0; p < values.length; p += 2) {
      controlPoints.push([values[p], values[p + 1]]);
    }
    endPoint = controlPoints.pop();
    controlPoints.reverse();
    return [controlPoints, endPoint];
  };

  let closed =
    pathData[pathData.length - 1][0].toLowerCase() === 'z' ? true : false;
  if (closed) {
    // add lineto closing space between Z and M
    pathData = addClosePathLineto(pathData);
    // remove Z closepath
    pathData.pop();
  }

  // define last point as new M if path isn't closed
  let valuesLast = pathData[pathData.length - 1];
  let valuesLastL = valuesLast.length;
  let M = closed
    ? pathData[0]
    : ['M', valuesLast[valuesLastL - 2], valuesLast[valuesLastL - 1]];
  // starting M stays the same – unless the path is not closed
  pathDataNew.push(M);

  // reverse path data command order for processing
  pathData.reverse();

  for (let i = 1; i < pathData.length; i++) {
    let com = pathData[i];
    let values = com.slice(1);
    let comPrev = pathData[i - 1];
    let typePrev = comPrev[0];
    let valuesPrev = comPrev.slice(1);
    // get reversed control points and new end coordinates
    let [controlPointsPrev, endPointsPrev] = reverseControlPoints(valuesPrev);
    let [controlPoints, endPoints] = reverseControlPoints(values);

    // create new path data
    let newValues = [];
    newValues = controlPointsPrev.flat().concat(endPoints);
    pathDataNew.push([typePrev, ...newValues]);
  }

  // add previously removed Z close path
  if (closed) {
    pathDataNew.push(['z']);
  }
  return pathDataNew;
}
