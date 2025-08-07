import { BorderRadius, Colors, Spacing } from "@/utils";
import styled from "styled-components";
import { VirtualCardWrapperStyled } from "../VirtualCard/VirtualCard.style";
import { device } from "@/utils/Breakpoints";

export const OrderLoginWrapperStyled = styled.div`
    display: flex;
    flex-direction: column;
    row-gap: ${Spacing.md};

    div {
        display: flex;
        justify-content: space-between;
        column-gap: ${Spacing.sm};
    }
`

export const OrderInfoWrapperStyled = styled.div`
    display: flex;
    flex-direction: column;
    box-shadow: 0px 4px 16px 0px #00000040;
    border-radius: ${BorderRadius.md};
    padding: ${Spacing.lg} ${Spacing.md};
    height: max-content;
    min-width: 35vw;

    & > div {
        display: flex;
        flex-direction: column;
        padding-inline: ${Spacing.md};
        row-gap: ${Spacing.sm};
    }

    h2 {
        padding-top: ${Spacing.md};
    }
`

export const OrderRowWrapperStyled = styled.div`
    display: flex;
    justify-content: space-between;
    column-gap: ${Spacing.sm};

    & > div {
        width: 50%;
    }
`

export const OrderCartWrapperStyled = styled.div<{ $count: number }>`
    display: grid;
    gap: 24px;
    width: 100%;
    margin: 0 auto;
    ${({ $count }) => {
        if ($count === 1) return `grid-template-columns: 1fr;`;
        if ($count === 2) return `grid-template-columns: 1fr 1fr;`;
        if ($count === 3) return `grid-template-columns: 1fr 1fr 1fr;`;
        if ($count >= 4) return `
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1fr 1fr;
        `;
    }}
    align-items: center;
    justify-items: center;
    min-height: 200px;
    max-height: 420px;
    overflow-y: auto;
`

export const OrderCartWholeWrapperStyled = styled.div<{ $count: number }>`
    display: flex;
    flex-direction: column;
    row-gap: ${Spacing.xs};
    width: ${({ $count }) => ($count === 1 ? "100%" : $count === 2 ? "90%" : $count === 3 ? "80%" : "70%")};
    aspect-ratio: 4/3; // nebo 3/2 podle poměru tvé karty
    position: relative;
    transition: width 0.2s;
    justify-content: center;
    align-items: center;
    margin-bottom: 32px;

    & > div:last-child {
        position: absolute;
        display: flex;
        align-items: center;
        column-gap: ${Spacing.md};
        font-size: 19px;
        margin-inline: auto;
        bottom: -32px;
        z-index: 3;

        svg {
            cursor: pointer;
            color: ${Colors.secondary};
        }
    }
`

export const OrderVirtualCartWrapperStyled = styled(VirtualCardWrapperStyled)`
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: stretch;
    justify-content: stretch;

    & > div, svg {
        position: absolute;
        inset: 0;
        width: 100% !important;
        height: 100% !important;
        object-fit: contain;
        display: block;
        z-index: 2;
    }

    img:first-child {
        z-index: 2;
        width: 100%;
        height: 100%;
    }

    img:last-child {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        z-index: 1;
    }
`

export const OrdeNoItemsCartWrapperStyled = styled.div`
    font-size: 24px;
    margin-block: auto;
    margin-right: 15vw;
`

export const OrderContainerStyled = styled.div`
    display: flex;
    flex-direction: column;
    row-gap: ${Spacing.lg};
    width: 100%;
    max-width: 500px;
    box-shadow: 0px 4px 16px 0px ${Colors.gray};
    padding: ${Spacing.lg} ${Spacing.md};
    border-radius: ${BorderRadius.md};
    height: max-content;
    margin-left: auto;
`

export const OrderTotalWrapperStyled = styled.div`
    display: flex;
    flex-direction: column;
    border-top: 1px solid ${Colors.gray};
    padding-top: ${Spacing.md};

    & > div:last-child {
        display: flex;
        justify-content: space-between;
    }

    & > div:first-child {

    }
`

export const OrderTotalProductWrapperStyled = styled.div`
    display: flex;
    justify-content: space-between;
`

export const OrderDeliveryWrapperStyled = styled.div`
    display: flex;
    justify-content: space-between;
`

export const OrderWrapperStyled = styled.form`
    display: grid;
    grid-template-columns: 1fr 1fr;
    padding: calc(5vh + ${Spacing.xl}) 10vw;
    column-gap: ${Spacing.lg};
    row-gap: ${Spacing.xl};
    justify-content: space-between;

    button {
        margin-left: auto;
        grid-column: 1 / span 2;
        min-width: 320px;
        max-width: 80vw;
    }

    @media ${device.lg} {
        grid-template-columns: 1fr;
        & > div {
            width: 100%;
            max-width: unset;
        }

        ${OrderCartWrapperStyled} {
            max-width: 500px;
        }

        button {
            grid-column: unset;
        }
    }
`

export const OrderProductsWrapperStyled = styled.div`
    display: flex;
    flex-direction: column;
`
