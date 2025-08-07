import Image from "next/image";
import styled from "styled-components";

export const VirtualCardWrapperStyled = styled.div`
    position: relative;
    aspect-ratio: 800 / 600;
`

export const VirtualCardSvgStyled = styled(Image)`

`

export const VirtualCardBgStyled = styled(Image)`
    border-radius: 20px;
    position: absolute;
    left: 0;
    z-index: -1;
`
