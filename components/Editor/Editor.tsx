import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  FabricImage,
  FabricObject,
  FabricObjectProps,
  FabricText,
  IText,
  ITextEvents,
  ITextProps,
  ObjectEvents,
  Path,
  Rect,
  SerializedITextProps,
  SerializedObjectProps,
  filters,
} from 'fabric';
import {
  EditorBackCardInfoStyled,
  EditorControlsWrapperStyled,
  EditorGridStyled,
  EditorProfilesWrapperStyled,
  EditorProfileWrapperStyled,
  EditorRemoveToolStyled,
  EditorRowWrapperStyled,
  EditorTextContentStyled,
  EditorTextModifyStyled,
  EditorTextWrapperStyled,
  EditorToolsContentStyled,
  EditorToolStyled,
  EditorToolsWrapperStyled,
  EditorUploadToolStyled,
  EditorVariantControlsStyled,
  EditorVariantIndicatorStyled,
  EditorVariantIndicatorWrapperStyled,
  EditorVariantStyled,
  EditorVariantWrapperStyled,
  EditorWrapperStyled,
  ExportButtonWrapperStyled,
  FabricJSCanvasStyled,
  HiddenFileInputStyled,
  FlexAngleStyled,
  FlexLetterSpacingStyled,
} from './Editor.style';
import { exportCurvedTextToSvg } from './ToSvg';
import { AngleSlider, Select, Slider, Text, TextInput } from '@mantine/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronCircleLeft,
  faChevronCircleRight,
  faInfoCircle,
  faMinusCircle,
  faPlusCircle,
} from '@fortawesome/free-solid-svg-icons';
import { Button, ButtonSize, ButtonVariant } from '../Button';
import { useTranslations } from 'next-intl';
import { useEditorContext } from '@/app/[locale]/EditorContext';
import { Colors } from '@/utils';
import { genUploader } from 'uploadthing/client';
export const { uploadFiles } = genUploader();

const FontFamilyEnum = {
  Arial: 'Arial',
  CourierNew: 'Courier New',
  Georgia: 'Georgia',
  TimesNewRoman: 'Times New Roman',
  Verdana: 'Verdana',
} as const;

type FontFamily = (typeof FontFamilyEnum)[keyof typeof FontFamilyEnum];

const FontWeightEnum = {
  Normal: 400,
  Bold: 700,
} as const;

type FontWeight = (typeof FontWeightEnum)[keyof typeof FontWeightEnum];

export enum CardVariantEnum {
  Cherry = 'cherry',
  Sapeli = 'sapeli',
  Rosewood = 'rosewood',
  Maple = 'maple',
  BlackWalnut = 'black_walnut',
  Bamboo = 'bamboo',
}

// Helpers
const isIText = (o: any): o is IText => !!o && typeof (o as IText).setSelectionStart === 'function';
const isFabricText = (o: any): o is FabricText => !!o && (o as any).type === 'text';

export const Editor: React.FC<{ handleOrder: (cards: any[]) => void }> = ({ handleOrder }) => {
  const t = useTranslations('Editor');
  const { editor, onReady, saveCanvasState, removeCanvasState, loadCanvasState, isCanvasInitialized, localStorageSave, resetEditor } = useEditorContext();

  // UI state
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [cardVariant, setCardVariant] = useState<CardVariantEnum>(CardVariantEnum.Cherry);
  const [fontFamily, setFontFamily] = useState<FontFamily>(FontFamilyEnum.Arial);
  const [fontWeight, setFontWeight] = useState<FontWeight>(FontWeightEnum.Normal);
  const [fontSize, setFontSize] = useState<number>(16);
  const [textValue, setTextValue] = useState<string>('Placeholder Text');
  const [letterSpacing, setLetterSpacing] = useState<number>(0); // in px units UI
  const [curveAngle, setCurveAngle] = useState<number>(0);
  const [wasInitialized, setWasInitialized] = useState(false);
  const [forceRefresh, setForceRefresh] = useState(false);

  // Refs
  const hasBoundListenersRef = useRef(false);

  // Cards state loader — recompute when switching cards or after add/remove
  const cards = useMemo(() => loadCanvasState(), [activeCardIndex, wasInitialized, forceRefresh, loadCanvasState]);

  // --- Canvas helpers
  const getCanvas = () => editor?.canvas ?? null;

  const getCenter = useCallback(() => {
    const canvas = getCanvas();
    return {
      left: canvas ? canvas.getWidth() / 2 : 100,
      top: canvas ? canvas.getHeight() / 2 : 100,
    };
  }, [editor]);

  const bringToFront = useCallback(() => {
    const canvas = getCanvas();
    const activeObject = canvas?.getActiveObject();
    if (canvas && activeObject) {
      canvas.bringObjectToFront(activeObject);
      canvas.renderAll();
    }
  }, [editor]);

  const handleSelection = useCallback(() => {
    const canvas = getCanvas();
    const activeObject = canvas?.getActiveObject();
    if (!activeObject) return;

    if (isIText(activeObject) || isFabricText(activeObject)) {
      const obj = activeObject as IText | FabricText;
      setTextValue((obj as any).text || 'Placeholder Text');
      setFontFamily(((obj as any).fontFamily as FontFamily) || FontFamilyEnum.Arial);
      setFontWeight((Number((obj as any).fontWeight) as FontWeight) || FontWeightEnum.Normal);
      setFontSize((obj as any).fontSize || 16);
      setLetterSpacing(((obj as any).charSpacing ?? 0) / 100);

      if ((obj as any).path) {
        const path = (obj as FabricText).path as Path;
        const curveSegment = path.path.find((segment) => segment[0] === 'Q');
        setCurveAngle(curveSegment ? Number(curveSegment[2]) : 0);
      } else {
        setCurveAngle(0);
      }
    }
    bringToFront();
  }, [bringToFront, editor]);

  const handleDeselection = useCallback(() => {
    setTextValue('Placeholder Text');
    setLetterSpacing(0);
    setCurveAngle(0);
    setFontFamily(FontFamilyEnum.Arial);
    setFontWeight(FontWeightEnum.Normal);
    setFontSize(16);
  }, []);

  const handleResize = useCallback(() => {
    const canvas = getCanvas();
    const outerCanvasContainer = document.querySelector('#editor') as HTMLElement | null;
    if (!canvas || !outerCanvasContainer) return;

    const canvasWidth = canvas.getWidth();
    const canvasHeight = canvas.getHeight();

    if (window.innerWidth <= 2000) {
      const ratio = canvasWidth / Math.max(canvasHeight, 600);
      const scale = ratio / (800 / 600);
      canvas.setViewportTransform([scale, 0, 0, scale, 0, 0]);
      canvas.setDimensions({ width: canvasWidth, height: (canvasWidth / ratio) * scale });
    } else {
      const availableWidth = Math.min(window.innerWidth * 0.4, 800);
      const availableHeight = Math.min(window.innerHeight, 600);
      const widthRatio = availableWidth / canvasWidth;
      const heightRatio = availableHeight / canvasHeight;
      const scale = Math.min(widthRatio, heightRatio);
      canvas.setViewportTransform([scale, 0, 0, scale, 0, 0]);
      canvas.setDimensions({
        width: Math.min(canvasWidth * scale, 800),
        height: Math.min(canvasHeight * scale, Math.min(canvasWidth * scale, 800) / 1.333333),
      });
    }
  }, [editor]);

  // --- Initialization / rehydration
  const initialize = useCallback(async (init = true) => {
    const canvas = getCanvas();
    if (!canvas) return;

    canvas.clear();
    const width = canvas.width || 800;
    const height = canvas.height || 600;

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

    const variantForImage = wasInitialized ? CardVariantEnum.Cherry : cardVariant;
    const clipRectImage = await FabricImage.fromURL(`/images/${variantForImage}.svg`);
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
      clipPath: roundedCornersClipRect,
    });
    canvas.add(clipRectImage);
    canvas.renderAll();

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

    // Bind listeners once per canvas instance
    if (!hasBoundListenersRef.current) {
      canvas.on('object:added', (e) => {
        const obj = e.target as any;
        if (!obj) return;
        if (obj.id !== 'cardVariantImage') {
          obj.clipPath = insideClipRect;
        }
      });
      canvas.on('selection:created', handleSelection);
      canvas.on('selection:updated', handleSelection);
      canvas.on('selection:cleared', handleDeselection);
      window.addEventListener('resize', handleResize);
      hasBoundListenersRef.current = true;
    }

    setWasInitialized(true);
    if (init) saveCanvasState(0, cardVariant);
  }, [cardVariant, editor, handleDeselection, handleResize, handleSelection, saveCanvasState, wasInitialized]);

  const getJSONFromCards = useCallback(
    (index: number) => {
      const card = cards[index];
      return card
        ? {
            svg: card.svg,
            json: card.json,
            objects: card.objects,
            variant: card.variant as CardVariantEnum,
          }
        : null;
    },
    [cards]
  );

  const initialFromCanvasState = useCallback(
    async (index = activeCardIndex) => {
      const canvas = getCanvas();
      const card = getJSONFromCards(index);
      if (!card || !canvas) return;

      const width = canvas.width || 800;
      const height = canvas.height || 600;

      await canvas.loadFromJSON(card.json);
      setCardVariant(card.variant);

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

      let clipRectImage: FabricObject<Partial<FabricObjectProps>, SerializedObjectProps, ObjectEvents> | null = null;

      canvas.getObjects().forEach((obj: any) => {
        if (obj.path && obj.type === 'text') obj.id = 'curvedText';
        if (obj.src?.includes(`/images/`)) {
          obj.id = 'cardVariantImage';
          obj.selectable = false;
          obj.evented = false;
          const imgWidth = obj.width || 1;
          const imgHeight = obj.height || 1;
          const scaleX = width / imgWidth;
          const scaleY = height / imgHeight;
          obj.scaleX = scaleX;
          obj.scaleY = scaleY;
          obj.left = 0;
          obj.top = 0;
          obj.clipPath = roundedCornersClipRect;
          clipRectImage = obj;
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

      if (!hasBoundListenersRef.current) {
        canvas.on('object:added', (e) => {
          const obj = e.target as any;
          if (obj && obj !== clipRectImage) obj.clipPath = insideClipRect;
        });
        canvas.on('selection:created', handleSelection);
        canvas.on('selection:updated', handleSelection);
        canvas.on('selection:cleared', handleDeselection);
        window.addEventListener('resize', handleResize);
        hasBoundListenersRef.current = true;
      }

      canvas.renderAll();
    },
    [activeCardIndex, editor, getJSONFromCards, handleDeselection, handleResize, handleSelection]
  );

  // mount
  useEffect(() => {
    if (!editor) return;

    if (isCanvasInitialized()) {
      initialFromCanvasState();
    } else {
      void initialize();
    }

    return () => {
      const canvas = getCanvas();
      if (canvas) {
        canvas.off('selection:created', handleSelection);
        canvas.off('selection:updated', handleSelection);
        canvas.off('selection:cleared', handleDeselection);
      }
      window.removeEventListener('resize', handleResize);
      hasBoundListenersRef.current = false;
    };
  }, [editor]);

  // --- Actions
  const handleAddCard = useCallback(async () => {
    saveCanvasState(activeCardIndex, cardVariant);
    saveCanvasState(cards.length, CardVariantEnum.Cherry);
    setActiveCardIndex(cards.length);
    setCardVariant(CardVariantEnum.Cherry);
    await initialize(false);
  }, [activeCardIndex, cardVariant, cards.length, initialize, saveCanvasState]);

  const handleRemoveCard = useCallback(
    (index: number) => {
      removeCanvasState(index);
      const nextLength = loadCanvasState().length;

      if (activeCardIndex === index) {
        const nextIndex = Math.min(index, Math.max(0, nextLength - 1));
        setActiveCardIndex(nextIndex);
        initialFromCanvasState(nextIndex);
      } else {
        const nextActive = activeCardIndex > index ? activeCardIndex - 1 : activeCardIndex;
        setActiveCardIndex(nextActive);
        initialFromCanvasState(nextActive);
      }
      setForceRefresh((prev) => !prev);
    },
    [activeCardIndex, initialFromCanvasState, loadCanvasState, removeCanvasState]
  );

  const handleSwitchCard = useCallback(
    (index: number) => {
      saveCanvasState(activeCardIndex, cardVariant);
      setActiveCardIndex(index);
      initialFromCanvasState(index);
    },
    [activeCardIndex, cardVariant, initialFromCanvasState, saveCanvasState]
  );

  
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

  const onAddText = useCallback(() => {
    const { left, top } = getCenter();
    const textObject = new IText(textValue, {
      left,
      top,
      originX: 'center',
      originY: 'center',
      fontSize,
      fontFamily,
      fontWeight,
      charSpacing: letterSpacing * 100,
    });
    getCanvas()?.add(textObject);
  }, [fontFamily, fontSize, fontWeight, getCenter, letterSpacing, textValue]);

  const placeTextOnCurve = useCallback(
    (path: Path, lastText: FabricText | null = null) => {
      const { left, top } = getCenter();
      const textObject = new FabricText(lastText?.text || textValue || 'Placeholder Text', {
        id: 'curvedText',
        left,
        top,
        originX: 'center',
        originY: 'center',
        fontSize: lastText?.fontSize || fontSize,
        fontFamily: (lastText?.fontFamily as FontFamily) || fontFamily,
        fontWeight: (lastText?.fontWeight as FontWeight) || fontWeight,
        charSpacing: (lastText?.charSpacing ?? letterSpacing * 100),
        path,
        pathAlign: 'center',
      });
      const canvas = getCanvas();
      canvas?.add(textObject);
      canvas?.renderAll();
      return textObject;
    },
    [fontFamily, fontSize, fontWeight, getCenter, letterSpacing, textValue]
  );

  const onAddTextOnCurve = useCallback(() => {
    const { left, top } = getCenter();
    const path = new Path(`M 0 100 Q 150 ${curveAngle} 300 100`, {
      id: 'singleCurve',
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
  }, [curveAngle, getCenter, placeTextOnCurve]);

  const onAddTextOnDoubleCurve = useCallback(() => {
    const { left, top } = getCenter();
    const path = new Path(`M 0 100 Q 150 ${curveAngle} 300 100 T 560 100`, {
      id: 'doubleCurve',
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
  }, [curveAngle, getCenter, placeTextOnCurve]);

  const onAddTextOnCircle = useCallback(() => {
    const { left, top } = getCenter();
    const path = new Path('M 100 0 A 100 100 0 1 1 100 200 A 100 100 0 1 1 100 0', {
      id: 'circleCurve',
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
  }, [getCenter, placeTextOnCurve]);

  const updateActive = useCallback((property: string, value: any) => {
    const canvas = getCanvas();
    const activeObject = canvas?.getActiveObject();
    if (!canvas || !activeObject) return;
    (activeObject as any).set(property, value);
    canvas.renderAll();
  }, []);

  // Controlled handlers
  const onChangeFont = useCallback(
    (val: string | null) => {
      if (!val) return;
      setFontFamily(val as FontFamily);
      updateActive('fontFamily', val);
    },
    [updateActive]
  );

  const onChangeFontSize = useCallback(
    (val: string | null) => {
      if (!val) return;
      const n = parseInt(val, 10);
      setFontSize(n);
      updateActive('fontSize', n);
    },
    [updateActive]
  );

  const onChangeFontWeight = useCallback(
    (val: string | null) => {
      if (!val) return;
      const n = parseInt(val, 10) as FontWeight;
      setFontWeight(n);
      updateActive('fontWeight', n);
    },
    [updateActive]
  );

  const onChangeLetterSpacing = useCallback(
    (val: number) => {
      setLetterSpacing(val);
      updateActive('charSpacing', val * 100);
    },
    [updateActive]
  );

  const onChangeText = useCallback(
    (val: string) => {
      setTextValue(val);
      updateActive('text', val);
    },
    [updateActive]
  );

  const onChangeCurveAngle = useCallback(
    (val: number) => {
      setCurveAngle(val);
      const canvas = getCanvas();
      const activeObject = canvas?.getActiveObject();
      if (!canvas || !activeObject || (activeObject as any).id !== 'curvedText') return;

      const path = (activeObject as FabricText).path as Path;
      let newPathData = '';
      if ((path as any).id === 'singleCurve') newPathData = `M 0 100 Q 150 ${val} 300 100`;
      else if ((path as any).id === 'doubleCurve') newPathData = `M 0 100 Q 150 ${val} 300 100 T 560 100`;
      else return;

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
      canvas.remove(activeObject);
      canvas.setActiveObject(newCurvedText);
    },
    [placeTextOnCurve]
  );

  const onChangeCardVariant = useCallback(
    async (variant: CardVariantEnum) => {
      const canvas = getCanvas();
      if (!canvas) return;
      const bg = canvas.getObjects().find((o: any) => o.id === 'cardVariantImage') as FabricImage | undefined;
      if (!bg) return;
      await (bg as any).setSrc(`/images/${variant}.svg`);
      const width = canvas.width || 800;
      const height = canvas.height || 600;
      const imgWidth = (bg.width as number) || 1;
      const imgHeight = (bg.height as number) || 1;
      bg.scaleX = width / imgWidth;
      bg.scaleY = height / imgHeight;
      canvas.renderAll();
      setCardVariant(variant);
    },
    [editor]
  );

  const changeCardVariant = useCallback(
    (direction: 'prev' | 'next') => {
      const variants = Object.values(CardVariantEnum);
      const currentIndex = variants.indexOf(cardVariant);
      const newIndex = direction === 'prev' ? (currentIndex - 1 + variants.length) % variants.length : (currentIndex + 1) % variants.length;
      onChangeCardVariant(variants[newIndex]);
    },
    [cardVariant, onChangeCardVariant]
  );

  const onDeleteObject = () => {
    const activeObject = editor?.canvas.getActiveObject();
    if (activeObject) {
      editor?.canvas.remove(activeObject);
      editor?.canvas.renderAll();
    }
  };


  const getSvg = useCallback((canvasSvg: string, canvasObject: any) => {
    if (!canvasSvg) return '';

    const curvedTextObjects = canvasObject.filter((obj: any) => obj.id === 'curvedText');
    let curvedTextSvg = '';
    curvedTextObjects?.forEach((obj: IText<Partial<ITextProps>, SerializedITextProps, ITextEvents>) => {
      curvedTextSvg += exportCurvedTextToSvg(obj as IText);
    });

    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(canvasSvg, 'image/svg+xml');
    svgDoc.querySelectorAll('g[id="curvedText"]').forEach((el) => el.remove());
    svgDoc.querySelectorAll('g[id="cardVariantImage"]').forEach((el) => el.remove());

    const serializer = new XMLSerializer();
    const stripped = serializer.serializeToString(svgDoc);
    return stripped.replace('</svg>', `${curvedTextSvg}</svg>`);
  }, []);

  const exportCanvas = useCallback(async () => {
    const canvas = getCanvas();
    if (!canvas) return;

    saveCanvasState(activeCardIndex, cardVariant);

    const json = canvas.toJSON();
    const svg = canvas.toSVG();
    const objects = canvas.getObjects();

    const currentCard = { json, svg, objects, variant: cardVariant };
    const newState = loadCanvasState().map((card: any, idx: number) => (idx === activeCardIndex ? currentCard : card));
    localStorageSave(newState);

    const cardsToExport = await Promise.all(
      newState.map(async (card: { svg: string; objects: any; variant: CardVariantEnum }) => {
        const canvasSvg = getSvg(card.svg, card.objects);
        const file = new File([canvasSvg], 'card.svg', { type: 'image/svg+xml' });
        const uploaded = await uploadFiles('imageUploader', { files: [file] });
        const url = uploaded?.[0]?.serverData?.fileUrl || uploaded?.[0]?.url || '';
        return { ...card, url };
      })
    );

    const allUploaded = cardsToExport.every((card) => !!card.url);
    if (allUploaded) handleOrder(cardsToExport);
    else console.error('Některý obrázek se nepodařilo nahrát. Zkuste to prosím znovu.');
  }, [activeCardIndex, cardVariant, getSvg, handleOrder, loadCanvasState, localStorageSave, saveCanvasState]);

  const handleReset = useCallback(() => {
    const canvas = getCanvas();
    canvas?.clear();
    setCardVariant(CardVariantEnum.Cherry);
    setFontFamily(FontFamilyEnum.Arial);
    setFontWeight(FontWeightEnum.Normal);
    setFontSize(16);
    setTextValue('Placeholder Text');
    setLetterSpacing(0);
    setCurveAngle(0);
    setActiveCardIndex(0);
    resetEditor();
    localStorage.removeItem('canvasState');
    void initialize();
  }, [initialize, resetEditor]);

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
          <p>
            {t('info.part_1')}
            <b>{t('info.part_bold')}</b>
            {t('info.part_2')}
          </p>
          <FontAwesomeIcon icon={faInfoCircle} size="lg" />
        </EditorBackCardInfoStyled>

        <EditorRowWrapperStyled>
          <EditorToolsWrapperStyled>
            <h3>{t('tools.title')}</h3>
            <EditorToolsContentStyled>
              <HiddenFileInputStyled id="fileInput" type="file" accept=".svg" onChange={onAddImage} />
              <EditorToolStyled $url="/images/editor_button_text.svg" onClick={onAddText} />
              <EditorToolStyled $url="/images/editor_button_curve_text.svg" onClick={onAddTextOnCurve} />
              <EditorToolStyled $url="/images/editor_button_double_curve_text.svg" onClick={onAddTextOnDoubleCurve} />
              <EditorToolStyled $url="/images/editor_button_circle_text.svg" onClick={onAddTextOnCircle} />
              <EditorUploadToolStyled htmlFor="fileInput" />
              <EditorRemoveToolStyled onClick={onDeleteObject}>{t('delete_object')}</EditorRemoveToolStyled>
            </EditorToolsContentStyled>
          </EditorToolsWrapperStyled>

          <EditorTextWrapperStyled>
            <h2>{t('text.title')}</h2>
            <EditorTextContentStyled>
              <TextInput label="Text" value={textValue} onChange={(e) => onChangeText(e.currentTarget.value)} />

              <Select
                value={fontFamily}
                onChange={onChangeFont}
                label={t('text.fontStyle')}
                data={Object.values(FontFamilyEnum).map((value) => ({ value, label: value }))}
              />

              <Select
                value={String(fontSize)}
                label={t('text.fontSize')}
                onChange={onChangeFontSize}
                data={['12', '16', '24', '32', '48', '64'].map((v) => ({ value: v, label: v }))}
              />

              <Select
                value={String(fontWeight)}
                label={t('text.fontWeight')}
                onChange={onChangeFontWeight}
                data={Object.entries(FontWeightEnum).map(([key, value]) => ({ value: String(value), label: key }))}
              />

              <EditorTextModifyStyled>
                <FlexAngleStyled>
                  <Text>{t('text.curveAngle')}</Text>
                  <AngleSlider value={curveAngle} step={1} onChange={onChangeCurveAngle} />
                </FlexAngleStyled>
                <FlexLetterSpacingStyled>
                  <Text>{t('text.letterSpacing')}</Text>
                  <Slider value={letterSpacing} onChange={onChangeLetterSpacing} min={0} max={10} step={0.1} />
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
          <FontAwesomeIcon onClick={() => changeCardVariant('prev')} icon={faChevronCircleLeft} size="2xl" />
          <EditorVariantIndicatorWrapperStyled>
            {Object.entries(CardVariantEnum).map(([key, value]) => (
              <EditorVariantIndicatorStyled key={`${key}-indicator`} $selected={value === cardVariant} />
            ))}
          </EditorVariantIndicatorWrapperStyled>
          <FontAwesomeIcon onClick={() => changeCardVariant('next')} icon={faChevronCircleRight} size="2xl" />
        </EditorVariantControlsStyled>
      </EditorWrapperStyled>

      <ExportButtonWrapperStyled>
        <Button onClick={handleReset} size={ButtonSize.lg} variant={ButtonVariant.ERROR} label={t('reset_button')} />
        <Button onClick={exportCanvas} size={ButtonSize.lg} variant={ButtonVariant.PRIMARY} label={t('button')} />
      </ExportButtonWrapperStyled>
    </EditorGridStyled>
  );
};
