import { useRef, useEffect, useState, useMemo } from 'react';
import { FabricImage, FabricObject, FabricObjectProps, FabricText, IText, ITextEvents, ITextProps, ObjectEvents, Path, Rect, SerializedITextProps, SerializedObjectProps, filters, loadSVGFromString, util } from 'fabric';
import { EditorBackCardInfoStyled, EditorControlsWrapperStyled, EditorGridStyled, EditorProfilesWrapperStyled, EditorProfileWrapperStyled, EditorRemoveToolStyled, EditorRowWrapperStyled, EditorTextContentStyled, EditorTextModifyStyled, EditorTextWrapperStyled, EditorToolsContentStyled, EditorToolStyled, EditorToolsWrapperStyled, EditorUploadToolStyled, EditorVariantControlsStyled, EditorVariantIndicatorStyled, EditorVariantIndicatorWrapperStyled, EditorVariantStyled, EditorVariantWrapperStyled, EditorWrapperStyled, ExportButtonWrapperStyled, FabricJSCanvasStyled, FileInputLabelStyled, FlexAngleStyled, FlexLetterSpacingStyled, HiddenFileInputStyled } from './Editor.style';
import { exportCurvedTextToSvg } from "./ToSvg";
import { AngleSlider, Select, Slider, Text, TextInput } from '@mantine/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronCircleLeft, faChevronCircleRight, faInfoCircle, faMinusCircle, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { Button, ButtonSize, ButtonVariant } from '../Button';
import { useTranslations } from 'next-intl';
import { useEditorContext } from '@/app/[locale]/EditorContext';
import { Colors } from '@/utils';
import { genUploader } from "uploadthing/client";
export const { uploadFiles } = genUploader();

const FontFamilyEnum = {
  Arial: 'Arial',
  CourierNew: 'Courier New',
  Georgia: 'Georgia',
  TimesNewRoman: 'Times New Roman',
  Verdana: 'Verdana',
}

const FontWeightEnum = {
  Normal: 400,
  Bold: 700,
}

export enum CardVariantEnum {
  Cherry = 'cherry',
  Sapeli = 'sapeli',
  Rosewood = 'rosewood',
  Maple = 'maple',
  BlackWalnut = 'black_walnut',
  Bamboo = 'bamboo',
}

export const Editor = ({ handleOrder }: { handleOrder: Function }) => {
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const t = useTranslations("Editor");
  const { editor, onReady, saveCanvasState, removeCanvasState, loadCanvasState, isCanvasInitialized, localStorageSave, resetEditor } = useEditorContext();
  const [wasInitialized, setWasInitialized] = useState(false);
  const [forceRefresh, setForceRefresh] = useState(false);
  const cards = useMemo(() => loadCanvasState(), [activeCardIndex, wasInitialized, forceRefresh])
  const [cardVariant, setCardVariant] = useState(CardVariantEnum.Cherry);
  const [fontFamily, setFontFamily] = useState(FontFamilyEnum.Arial);
  const [fontWeight, setFontWeight] = useState(FontWeightEnum.Normal);
  const [fontSize, setFontSize] = useState(16);
  const textRef = useRef<HTMLInputElement | null>(null);
  const letterSpacingRef = useRef<HTMLInputElement | null>(null);
  const curveRef = useRef<HTMLInputElement | null>(null);

  const handleAddCard = async () => {
    saveCanvasState(activeCardIndex, cardVariant);
    saveCanvasState(cards.length, CardVariantEnum.Cherry);
    setActiveCardIndex(cards.length);
    setCardVariant(CardVariantEnum.Cherry);
    initialize(false);
  };

  const handleRemoveCard = (index: number) => {
    removeCanvasState(index);
    if (activeCardIndex === index) {
      initialFromCanvasState(activeCardIndex > cards.length ? 0 : activeCardIndex + 1);
      setActiveCardIndex(activeCardIndex > cards.length ? 0 : activeCardIndex);
    } else {
      initialFromCanvasState(activeCardIndex);
      setActiveCardIndex(activeCardIndex > cards.length ? activeCardIndex - 1 : activeCardIndex);
    }
    setForceRefresh(prev => !prev);
  }

  const handleSwitchCard = (index: number) => {
      saveCanvasState(activeCardIndex, cardVariant);
      setActiveCardIndex(index);
      initialFromCanvasState(index)
  };

  const handleSelection = () => {
    const setObjectsValuesAsDefault = (object: IText) => {
      letterSpacingRef.current!.value = (object.charSpacing / 100).toString() || '0';
      textRef.current!.value = object.text || 'Placeholder Text';

      setFontFamily(object.fontFamily || FontFamilyEnum.Arial);
      setFontWeight(Number(object.fontWeight) || FontWeightEnum.Normal);
      setFontSize(object.fontSize || 16);

      if (object.path) {
        const path = object.path as Path;
        const curveSegment = path.path.find(segment => segment[0] === 'Q');
        if (curveSegment) {
          curveRef.current!.value = curveSegment[2].toString();
        } else {
          curveRef.current!.value = '0';
        }
      } else {
        curveRef.current!.value = '0';
      }
    }

    const activeObject = editor?.canvas.getActiveObject();
    if (activeObject) {
      setObjectsValuesAsDefault(activeObject as IText);
    }
    bringToFront();
  };

  const handleDeselection = () => {
    letterSpacingRef.current!.value = '0';
    textRef.current!.value = 'Placeholder Text';
    curveRef.current!.value = '0';

    setFontFamily(FontFamilyEnum.Arial);
    setFontWeight(FontWeightEnum.Normal);
    setFontSize(16);
  };

  const handleResize = () => {
    const canvas = editor?.canvas;
    const outerCanvasContainer = document.querySelector('#editor') as HTMLElement;
    if (!canvas || !outerCanvasContainer) return;

    const canvasWidth = canvas.getWidth();
    const canvasHeight = canvas.getHeight();

    if (window?.innerWidth <= 2000) {
      // canvas 100vw width
      const ratio = canvasWidth / Math.max(canvasHeight, 600)
      const scale = ratio / (800 / 600)
      canvas.setViewportTransform([scale, 0, 0, scale, 0, 0])
      canvas.setDimensions({
        width: canvasWidth,
        height: (canvasWidth / ratio) * scale
      })
    } else {
      // canvas + controls width
      const availableWidth = Math.min(window?.innerWidth * 0.4, 800);
      const availableHeight = Math.min(window?.innerHeight, 600);

      const widthRatio = availableWidth / canvasWidth;
      const heightRatio = availableHeight / canvasHeight;
      const scale = Math.min(widthRatio, heightRatio);

      canvas.setViewportTransform([scale, 0, 0, scale, 0, 0]);
      canvas.setDimensions({
        width: Math.min(canvasWidth * scale, 800),
        height: Math.min(canvasHeight * scale, Math.min(canvasWidth * scale, 800) / 1.333333),
      });
    }
  };

  const initialize = async(init = true) => {
    if (!editor?.canvas) return;
    editor?.canvas.clear();
    const { width, height } = editor.canvas;
    const roundedCornersClipRect = new Rect({
      left: 0,
      top: 0,
      width,
      height,
      absolutePositioned: true,
      selectable: false,
      evented: false,
      rx: 20,
    });
    const clipRectImage = await FabricImage.fromURL(`/images/${wasInitialized ? CardVariantEnum.Cherry : cardVariant}.svg`);
    const imgWidth = clipRectImage.width || 1;
    const imgHeight = clipRectImage.height || 1;
    const scaleX = width / imgWidth;
    const scaleY = height / imgHeight;
    clipRectImage.set({
      id: 'cardVariantImage',
      scaleX,
      scaleY,
      left: 0,
      top: 0,
      absolutePositioned: true,
      selectable: false,
      evented: false,
    });
    clipRectImage.clipPath = roundedCornersClipRect;
    editor.canvas.add(clipRectImage);
    editor.canvas.renderAll();

    // Set clipPath for other objects
    const insideClipRect = new Rect({
      left: 20,
      top: 20,
      width: width - 40,
      height: height - 40,
      absolutePositioned: true,
      selectable: false,
      evented: false,
      rx: 20,
    });

    editor.canvas.on('object:added', (e) => {
      const obj = e.target;
      if (obj !== clipRectImage && obj !== roundedCornersClipRect && (obj as any).id !== "cardVariantImage") {
        obj.clipPath = insideClipRect;
      }
    });

    // Add event listeners for object selection
    editor.canvas.on('selection:created', handleSelection);
    editor.canvas.on('selection:updated', handleSelection);
    editor.canvas.on('selection:cleared', handleDeselection);
    window.addEventListener('resize', handleResize);
    setWasInitialized(true);
    if (init) saveCanvasState(0, cardVariant);
  }

  const getJSONFromCards = (index: number) => {
    const card = cards[index];
    return ({
      svg: card.svg,
      json: card.json,
      objects: card.objects,
      variant: card.variant,
    })
  }

  const initialFromCanvasState = async (index = activeCardIndex) => {
    const card = getJSONFromCards(index)
    const json = card.json;
    let clipRectImage: FabricObject<Partial<FabricObjectProps>, SerializedObjectProps, ObjectEvents> | null = null

    if (json && editor?.canvas) {
      setCardVariant(card.variant);
      const { width, height } = editor.canvas;
      await editor.canvas.loadFromJSON(json);

      const roundedCornersClipRect = new Rect({
        left: 0,
        top: 0,
        width,
        height,
        absolutePositioned: true,
        selectable: false,
        evented: false,
        rx: 20,
      });

      editor.canvas.getObjects().forEach((obj) => {
        if ((obj as any).path && obj.type === "text") {
          (obj as any).id = "curvedText";
        }
        if ((obj as any).src?.includes(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/images/`)) {
          (obj as any).id = "cardVariantImage";
          obj.selectable = false;
          obj.evented = false;
          const imgWidth = obj.width || 1;
          const imgHeight = obj.height || 1;
          const scaleX = width / imgWidth;
          const scaleY = height / imgHeight;
          obj.scaleX = scaleX;
          obj.scaleY = scaleY;
          obj.clipPath = undefined;
          obj.left = 0;
          obj.top = 0;

          obj.clipPath = roundedCornersClipRect;
          clipRectImage = obj
        } else {
          obj.clipPath?.scaleToWidth(width - 40);
          obj.clipPath?.scaleToHeight(height - 40);
        }
      });

      const insideClipRect = new Rect({
        left: 20,
        top: 20,
        width: width - 40,
        height: height - 40,
        absolutePositioned: true,
        selectable: false,
        evented: false,
        rx: 20,
      });

      editor.canvas.on('object:added', (e) => {
        const obj = e.target;
        if (obj !== clipRectImage && obj !== roundedCornersClipRect) {
          obj.clipPath = insideClipRect;
        }
      });

      // Add event listeners for object selection
      editor.canvas.on('selection:created', handleSelection);
      editor.canvas.on('selection:updated', handleSelection);
      editor.canvas.on('selection:cleared', handleDeselection);
      window.addEventListener('resize', handleResize);

      editor.canvas.renderAll();
    }
  }

  useEffect(() => {
    if (isCanvasInitialized()) {
      initialFromCanvasState();
    } else {
      initialize();
    }
    // Cleanup function to remove event listeners
    return () => {
      editor?.canvas.off('selection:created', handleSelection);
      editor?.canvas.off('selection:updated', handleSelection);
      editor?.canvas.off('selection:cleared', handleDeselection);
      window.removeEventListener('resize', handleResize);
    };
  }, [editor]);

  const onAddImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const svgString = e.target?.result as string;
        const image = await FabricImage.fromURL(`data:image/svg+xml;base64,${btoa(svgString)}`);

        // Apply filters to the image
        image.filters.push(new filters.Saturation({ saturation: 4 }))
        image.filters.push(new filters.Grayscale())
        image.filters.push(new filters.RemoveColor({ color: '#ffffff', threshold: 40 }))
        image.applyFilters();

        editor?.canvas.add(image);
      };
      reader.readAsText(file);
      event.target.value = '';
    }
  };

  const getCenter = () => {
    const canvas = editor?.canvas;
    return {
      left: canvas ? canvas.getWidth() / 2 : 100,
      top: canvas ? canvas.getHeight() / 2 : 100,
    }
  }

  const onAddText = () => {
    const letterSpacing = parseFloat(letterSpacingRef.current?.value ?? '0');
    const text = textRef.current?.value || '';
    const { left, top } = getCenter();
    const textObject = new IText(text, {
      left,
      top,
      originX: 'center',
      originY: 'center',
      fontSize,
      fontFamily,
      fontWeight,
      charSpacing: letterSpacing * 100,
    });
    editor?.canvas.add(textObject);
  };

  const placeTextOnCurve = (path: Path, lastText: FabricText | null = null) => {
    const newFontFamily = lastText?.fontFamily || fontFamily;
    const newFontWeight = lastText?.fontWeight || fontWeight;
    const newFontSize = lastText?.fontSize || fontSize;
    const letterSpacing = (lastText?.charSpacing ?? 0) / 100 || parseFloat(letterSpacingRef.current?.value ?? '0');
    const text = lastText?.text || textRef.current?.value || 'Placeholder Text';
    const { left, top } = getCenter();

    const textObject = new FabricText(text, {
      id: "curvedText",
      left,
      top,
      originX: 'center',
      originY: 'center',
      fontSize: newFontSize,
      fontFamily: newFontFamily,
      fontWeight: newFontWeight,
      charSpacing: letterSpacing * 100,
      path: path,
      pathAlign: 'center',
    })

    editor?.canvas.add(textObject);
    editor?.canvas.renderAll();

    return textObject
  }

  const onAddTextOnCurve = () => {
    const { left, top } = getCenter();
    const curveAngle = curveRef.current?.value || 0;

    const path = new Path(`M 0 100 Q 150 ${curveAngle} 300 100`, {
      id: "singleCurve",
      fill: '',
      stroke: 'black',
      left,
      top,
      originX: 'center',
      originY: 'center',
      strokeWidth: 0,
      selectable: false,
      evented: false,
    });

    placeTextOnCurve(path);
  };

  const onAddTextOnDoubleCurve = () => {
    const { left, top } = getCenter();
    const curveAngle = curveRef.current?.value || 0;

    const path = new Path(`M 0 100 Q 150 ${curveAngle} 300 100 T 560 100`, {
      id: "doubleCurve",
      fill: '',
      stroke: 'black',
      left,
      top,
      originX: 'center',
      originY: 'center',
      strokeWidth: 0,
      selectable: false,
      evented: false,
    });

    placeTextOnCurve(path);
  };

  const onAddTextOnCircle = () => {
    const { left, top } = getCenter();

    const path = new Path('M 100 0 A 100 100 0 1 1 100 200 A 100 100 0 1 1 100 0', {
      id: "circleCurve",
      fill: '',
      stroke: 'black',
      left,
      top,
      originX: 'center',
      originY: 'center',
      strokeWidth: 0,
      selectable: false,
      evented: false,
    });

    placeTextOnCurve(path);
  };

  const updateTextProperties = (property: string, value: any) => {
    const activeObject = editor?.canvas.getActiveObject();
    if (activeObject) {
      activeObject.set(property, value);
      editor?.canvas.renderAll();
    }
  };

  const onChangeFont = (fontFamily: string) => {
    updateTextProperties('fontFamily', fontFamily);
    setFontFamily(fontFamily);
  };

  const onChangeFontSize = (fontSize: number) => {
    updateTextProperties('fontSize', fontSize);
    setFontSize(fontSize);
  };

  const onChangeFontWeight = (fontWeight: number) => {
    updateTextProperties('fontWeight', fontWeight);
    setFontWeight(fontWeight);
  };

  const onChangeLetterSpacing = (letterSpacing: number) => {
    updateTextProperties('charSpacing', letterSpacing * 100);
  };

  const onChangeText = (text: string) => {
    updateTextProperties('text', text);
  };

  const onChangeCurveAngle = (curveAngle: number) => {
    const activeObject = editor?.canvas.getActiveObject();
    if (activeObject && (activeObject as any).id === 'curvedText') {
      const path = (activeObject as FabricText).path as Path;
      var newPathData = ''
      if ((path as any).id === 'singleCurve') {
        newPathData = `M 0 100 Q 150 ${curveAngle} 300 100`;
      } else if ((path as any).id === 'doubleCurve') {
        newPathData = `M 0 100 Q 150 ${curveAngle} 300 100 T 560 100`;
      } else {
        return
      }

      const newPath = new Path(newPathData, {
        id: (path as any).id,
        fill: '',
        stroke: 'black',
        left: path.left,
        top: path.top,
        originX: 'center',
        originY: 'center',
        strokeWidth: path.strokeWidth,
        selectable: false,
        evented: false,
      });
      const newCurvedText = placeTextOnCurve(newPath, activeObject as FabricText);
      editor?.canvas.remove(activeObject);
      editor?.canvas.setActiveObject(newCurvedText);
      curveRef.current!.value = curveAngle.toString();
    }
  };

  const onChangeCardVariant = async (variant: CardVariantEnum) => {
    const { width, height } = editor?.canvas
    const url = `/images/${variant}.svg`
    const clipRectImage = editor?.canvas.getObjects().find(obj => (obj as any).id === 'cardVariantImage');
    const canvas = editor?.canvas;
    if (clipRectImage) {
      await (clipRectImage as FabricImage).setSrc(url)
      const imgWidth = clipRectImage.width || 1;
      const imgHeight = clipRectImage.height || 1;
      const scaleX = width / imgWidth;
      const scaleY = height / imgHeight;
      clipRectImage.scaleX = scaleX;
      clipRectImage.scaleY = scaleY;
      editor?.canvas.renderAll();
    }
    setCardVariant(variant)
  };

  const changeCardVariant = (direction: 'prev' | 'next') => {
    const variants = Object.values(CardVariantEnum);
    const currentIndex = variants.indexOf(cardVariant);

    let newIndex;
    if (direction === 'prev') {
      newIndex = (currentIndex - 1 + variants.length) % variants.length;
    } else {
      newIndex = (currentIndex + 1) % variants.length;
    }

    const newVariant = variants[newIndex];
    onChangeCardVariant(newVariant);
  };

  const onDeleteObject = () => {
    const activeObject = editor?.canvas.getActiveObject();
    if (activeObject) {
      editor?.canvas.remove(activeObject);
      editor?.canvas.renderAll();
    }
  };

  const bringToFront = () => {
    const activeObject = editor?.canvas.getActiveObject();
    if (activeObject) {
      editor?.canvas.bringObjectToFront(activeObject);
      editor?.canvas.renderAll();
    }
  };

  const getSvg = (canvasSvg: string, canvasObject: any) => {
    if (!canvasSvg) return;

    const curvedTextObjects = canvasObject.filter((obj: any) => (obj as any).id === 'curvedText');
    let curvedTextSvg = '';
    curvedTextObjects?.forEach((obj: IText<Partial<ITextProps>, SerializedITextProps, ITextEvents>) => {
      curvedTextSvg += exportCurvedTextToSvg(obj as IText);
    })

    // Remove old curvedText objects and background from the SVG string
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(canvasSvg, 'image/svg+xml');
    const curvedTextElements = svgDoc.querySelectorAll('g[id="curvedText"]');
    const backgroundImage = svgDoc.querySelectorAll('g[id="cardVariantImage"]');
    curvedTextElements.forEach(element => element.remove());
    backgroundImage.forEach(element => element.remove());

    // Serialize the updated SVG document back to a string
    const serializer = new XMLSerializer();
    canvasSvg = serializer.serializeToString(svgDoc);

    // Insert the new curvedText SVG before the closing </svg> tag
    return canvasSvg?.replace('</svg>', `${curvedTextSvg}</svg>`);
  }

  const exportCanvas = async () => {
    saveCanvasState(activeCardIndex, cardVariant);

    const json = editor?.canvas?.toJSON();
    const svg = editor?.canvas?.toSVG();
    const objects = editor?.canvas?.getObjects();

    const currentCard = {
      json,
      svg,
      objects,
      variant: cardVariant,
    };

    const newState = loadCanvasState().map((card: any, idx: number) =>
      idx === activeCardIndex ? currentCard : card
    );

    localStorageSave(newState);

    const cardsToExport = await Promise.all(
      newState.map(async (card: { svg: string; objects: any; variant: CardVariantEnum }) => {
        const canvasSvg = getSvg(card.svg, card.objects);
        let url = '';

        const file = new File([canvasSvg as string], 'card.svg', { type: 'image/svg+xml' });
        const uploaded = await uploadFiles("imageUploader", { files: [file] })
        console.log("TEST 1", uploaded?.[0]?.serverData?.fileUrl || uploaded?.[0]?.url)
        console.log("TEST", uploaded)
        url = uploaded?.[0]?.serverData?.fileUrl || uploaded?.[0]?.url;

        return ({ ...card, url })
      })
    );
    const allUploaded = cardsToExport.every(card => !!card.url);
    if (allUploaded) {
      handleOrder(cardsToExport);
    } else {
      console.error("Některý obrázek se nepodařilo nahrát. Zkuste to prosím znovu.");
    }
  };

  const handleReset = () => {
    editor?.canvas.clear();

    setCardVariant(CardVariantEnum.Cherry);
    setFontFamily(FontFamilyEnum.Arial);
    setFontWeight(FontWeightEnum.Normal);
    setFontSize(16);
    setActiveCardIndex(0);
    resetEditor();
    localStorage.removeItem("canvasState");

    initialize();
  }

  return (
    <EditorGridStyled id="editor">
      <EditorControlsWrapperStyled>
        <EditorProfilesWrapperStyled>
          {cards.map((_: unknown, idx: number) => (
            <EditorProfileWrapperStyled key={idx}>
              <Button
                onClick={() => handleSwitchCard(idx)}
                size={ButtonSize.sm}
                variant={activeCardIndex === idx ? ButtonVariant.SUCCESS : ButtonVariant.SECONDARY}
                label={`Karta ${idx + 1}`}
              />
              {cards.length > 1 && (
                <div onClick={() => handleRemoveCard(idx)} style={{ cursor: 'pointer', placeSelf: 'center' }}>
                  <FontAwesomeIcon icon={faMinusCircle} size="sm" color={Colors.error} />
                </div>
            )}
            </EditorProfileWrapperStyled>
          ))}
          <div onClick={handleAddCard} style={{ cursor: 'pointer', placeSelf: 'center' }}>
            <FontAwesomeIcon icon={faPlusCircle} size="lg" color={Colors.success} />
          </div>
        </EditorProfilesWrapperStyled>
        <EditorBackCardInfoStyled>
          <p>{t("info.part_1")}<b>{t("info.part_bold")}</b>{t("info.part_2")}</p>
          <FontAwesomeIcon icon={faInfoCircle} size="lg" />
        </EditorBackCardInfoStyled>
        <EditorRowWrapperStyled>
          <EditorToolsWrapperStyled>
            <h3>{t("tools.title")}</h3>
            <EditorToolsContentStyled>
              <HiddenFileInputStyled id="fileInput" type="file" accept=".svg" onChange={onAddImage} />
              <EditorToolStyled $url="/images/editor_button_text.svg" onClick={onAddText} />
              <EditorToolStyled $url="/images/editor_button_curve_text.svg" onClick={onAddTextOnCurve} />
              <EditorToolStyled $url="/images/editor_button_double_curve_text.svg" onClick={onAddTextOnDoubleCurve} />
              <EditorToolStyled $url="/images/editor_button_circle_text.svg" onClick={onAddTextOnCircle} />
              <EditorUploadToolStyled htmlFor="fileInput" />
              <EditorRemoveToolStyled onClick={onDeleteObject}>{t("delete_object")}</EditorRemoveToolStyled>
            </EditorToolsContentStyled>
          </EditorToolsWrapperStyled>
          <EditorTextWrapperStyled>
            <h2>{t("text.title")}</h2>
            <EditorTextContentStyled>
              <TextInput label="Text" ref={textRef} onChange={({ target }) => onChangeText(target.value)} defaultValue="Placeholder Text" />
              <Select
                value={fontFamily}
                onChange={(value) => value && onChangeFont(value)}
                label={t("text.fontStyle")}
                data={Object.entries(FontFamilyEnum).map(([key, value]) => ({
                  value,
                  label: value,
                }))}
              />
              <Select
                value={fontSize.toString()}
                label={t("text.fontSize")}
                onChange={(value) => value && onChangeFontSize(parseInt(value, 10))}
                data={[
                  { value: '12', label: '12' },
                  { value: '16', label: '16' },
                  { value: '24', label: '24' },
                  { value: '32', label: '32' },
                  { value: '48', label: '48' },
                  { value: '64', label: '64' },
                ]}
              />
              <Select
                value={fontWeight.toString()}
                label={t("text.fontWeight")}
                onChange={(value) => value && onChangeFontWeight(parseInt(value, 10))}
                data={Object.entries(FontWeightEnum).map(([key, value]) => ({
                  value: value.toString(),
                  label: key,
                }))}
              />

              <EditorTextModifyStyled>
                <FlexAngleStyled>
                  <Text>{t("text.curveAngle")}</Text>
                  <AngleSlider ref={curveRef} step={1} onChange={onChangeCurveAngle} />
                </FlexAngleStyled>
                <FlexLetterSpacingStyled>
                  <Text>{t("text.letterSpacing")}</Text>
                  <Slider ref={letterSpacingRef} onChange={onChangeLetterSpacing} min={0} max={10} step={0.1} defaultValue={0} />
                </FlexLetterSpacingStyled>
              </EditorTextModifyStyled>
            </EditorTextContentStyled>
          </EditorTextWrapperStyled>
          </EditorRowWrapperStyled>
        </EditorControlsWrapperStyled>
      <EditorWrapperStyled>
        <EditorVariantWrapperStyled>
          {Object.entries(CardVariantEnum).map(([key, value]) => (
            <EditorVariantStyled key={key} $url={`/images/${value}.svg`} onClick={() => onChangeCardVariant(value)} />
          ))}
        </EditorVariantWrapperStyled>
        <h3>{t(`cards.${cardVariant}`)}</h3>
        <FabricJSCanvasStyled onReady={onReady} />
        <EditorVariantControlsStyled>
          <FontAwesomeIcon onClick={() => changeCardVariant("prev")} icon={faChevronCircleLeft} size="2xl" />
          <EditorVariantIndicatorWrapperStyled>
            {Object.entries(CardVariantEnum).map(([key, value]) => (
              <EditorVariantIndicatorStyled key={`${key}-indicator`} $selected={value === cardVariant} />
            ))}
          </EditorVariantIndicatorWrapperStyled>
          <FontAwesomeIcon onClick={() => changeCardVariant("next")} icon={faChevronCircleRight} size="2xl" />
        </EditorVariantControlsStyled>
      </EditorWrapperStyled>
      <ExportButtonWrapperStyled>
        <Button onClick={handleReset} size={ButtonSize.lg} variant={ButtonVariant.ERROR} label={t("reset_button")} />
        <Button onClick={exportCanvas} size={ButtonSize.lg} variant={ButtonVariant.PRIMARY} label={t("button")} />
      </ExportButtonWrapperStyled>
    </EditorGridStyled>
  );
};