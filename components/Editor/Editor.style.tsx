import { Colors, Spacing } from '@/utils';
import { device } from '@/utils/Breakpoints';
import { FabricJSCanvas } from 'fabricjs-react';
import styled from 'styled-components';

export const ControlsWrapperStyled = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const ExportButtonWrapperStyled = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding-block: ${Spacing.lg};
`;

export const FabricJSCanvasStyled = styled(FabricJSCanvas)`
  width: min(80vw, 800px);
  margin-inline: auto;

  div[data-fabric="wrapper"] {
    width: max-content!important;
    height: max-content!important;
    margin-inline: auto;
  }

  canvas {
    border-radius: 18px;
    max-width: min(80vw, 800px);
    height: auto!important;
    aspect-ratio: 800 / 600;
  }

  @media ${device.lg} {
      width: 80vw;
      max-width: unset;
      margin-inline: unset;
  }
`;

export const HiddenFileInputStyled = styled.input`
  display: none;
`;

export const FileInputLabelStyled = styled.label`
  display: inline-block;
  padding: 6px 12px;
  cursor: pointer;
  border: 1px solid #007bff;
  color: #007bff;
  text-align: center;
  border-radius: 4px;
  margin-bottom: 10px;
`;


export const EditorGridStyled = styled.div`
  display: flex;
  width: 80vw;
  flex-wrap: wrap;
  margin-inline: auto;
  gap: ${Spacing.lg};
  padding-block: 20px;
`;

export const EditorToolsWrapperStyled = styled.div`
  display: flex;
  flex-direction: column;
  box-shadow: 0px 4px 16px 0px #00000040;
  border-radius: 12px;
  row-gap: ${Spacing.sm};
  width: max-content;
  height: max-content;
  padding: ${Spacing.sm};
`

export const EditorToolsContentStyled = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: ${Spacing.sm};

  @media ${device.lg} {
    flex-direction: row;
    column-gap: ${Spacing.sm};
  }
`

export const EditorToolStyled = styled.button<{ $url: string }>`
  display: flex;
  width: 48px;
  border-radius: 6px;
  border: unset;
  aspect-ratio: 1/1;
  background-image: url(${({ $url }) => $url});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  cursor: pointer;

  &:hover {
    filter: brightness(0.9);
  }
`

export const EditorUploadToolStyled = styled.label`
  display: flex;
  width: 48px;
  border-radius: 6px;
  border: unset;
  aspect-ratio: 1/1;
  background-image: url("/images/editor_button_svg_upload.svg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  outline: none;
  cursor: pointer;

  &:hover {
    filter: brightness(0.9);
  }
`

export const EditorRemoveToolStyled = styled.button`
  display: flex;
  width: 48px;
  border-radius: 6px;
  border: unset;
  aspect-ratio: 1/1;
  background-color: ${Colors.error};
  color: ${Colors.white};
  font-size: 9px;
  line-height: 10px;
  align-items: center;
  text-align: left;
  padding-inline: 4px;
  cursor: pointer;

  &:hover {
    filter: brightness(0.9);
  }
`

export const EditorTextWrapperStyled = styled.div`
  display: flex;
  flex-direction: column;
  box-shadow: 0px 4px 16px 0px #00000040;
  border-radius: 12px;
  row-gap: ${Spacing.sm};
  width: max-content;
  height: max-content;
  padding: ${Spacing.sm};

  @media ${device.lg} {
    width: 80vw;
  }
`

export const EditorTextContentStyled = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: ${Spacing.md};
  padding-inline: ${Spacing.sm};

  @media ${device.lg} {
    flex-direction: row;
    column-gap: ${Spacing.md};
    max-width: 80vw;
    flex-wrap: wrap;
    max-width: 100%;
  }
`

export const EditorTextModifyStyled = styled.div`
  display: flex;
  padding-top: ${Spacing.sm};
  column-gap: ${Spacing.xl};
`

const FlexRowStyled = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    white-space: nowrap;

    p {
      place-self: flex-start;
      font-weight: 500;
      font-size: 14px;
    }
`;

export const FlexLetterSpacingStyled = styled(FlexRowStyled)`
    & > div {
      width: 80px;
    }

    .mantine-Slider-bar, .mantine-Slider-thumb {
      background-color: ${Colors.black};
    }

    .mantine-Slider-thumb {
      color: ${Colors.black};
      border-color: ${Colors.black};
    }
`;

export const FlexAngleStyled = styled(FlexRowStyled)`
    & > div {
      width: 42px;
      height: 42px;
      border: 1px solid #ced4da;
      margin-inline: auto;
    }
`;

export const EditorWrapperStyled = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: calc(${Spacing.sm} + 60px);
  padding-left: ${Spacing.sm};
  row-gap: ${Spacing.sm};
  margin-left: auto;
  max-width: 80vw;

  @media (max-width: 1850px) {
    width: 100%;
  }
`

export const EditorVariantWrapperStyled = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: ${Spacing.sm};

  @media ${device.lg} {
    justify-content: flex-start;
  }
`

export const EditorVariantStyled = styled.button<{ $url: string }>`
  background-image: url(${({ $url }) => $url});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  aspect-ratio: 600 / 400;
  width: 100px;
  border: unset;
  border-radius: 6px;
  cursor: pointer;
`

export const EditorVariantControlsStyled = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  svg {
    padding: 1px;
    cursor: pointer;
    border-radius: 50%;
  }

  svg:first-child {
    background-color: ${Colors.black};
    color: ${Colors.white};
  }
`

export const EditorVariantIndicatorWrapperStyled = styled.div`
  display: flex;
  column-gap: ${Spacing.sm};
`

export const EditorVariantIndicatorStyled = styled.div<{ $selected: boolean }>`
  display: flex;
  border-radius: 50%;
  background-color: ${({ $selected }) => ($selected ? Colors.black : Colors.grey)};
  height: 12px;
  width: 12px;
`

export const EditorBackCardInfoStyled = styled.div`
  display: flex;
  align-items: center;
  max-width: calc(40vw - 40px);
  background-color: ${Colors.black};
  color: ${Colors.grey};
  font-size: 12px;
  border-radius: 6px;
  padding: ${Spacing.xs} ${Spacing.sm};
  font-style: italic;
  width: fit-content;

  svg {
    padding-left: ${Spacing.md};
    margin-left: 0px;
  }

  b {
    color: ${Colors.white};
    font-weight: 500;
  }

  @media ${device.lg} {
    max-width: 80vw;
  }
`

export const EditorControlsWrapperStyled = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: ${Spacing.xl};

  @media (max-width: 1580px) {
    max-width: 40%;
  }
`

export const EditorRowWrapperStyled = styled.div`
  display: flex;
  column-gap: ${Spacing.lg};

  @media ${device.lg} {
    flex-direction: column;
    row-gap: ${Spacing.lg};
  }
`

export const EditorProfilesWrapperStyled = styled.div`
  display: flex;
  row-gap: ${Spacing.xs};
  column-gap: ${Spacing.sm};
`

export const EditorProfileWrapperStyled = styled.div`
  position: relative;

  div {
    position: absolute;
    display: flex;
    top: -4px;
    right: -4px;
    background-color: ${Colors.white};
    border-radius: 50%;

    &:hover {
      filter: brightness(.8);
    }
  }
`