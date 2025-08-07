import { BorderRadius, Colors, Spacing } from "@/utils";
import styled from "styled-components";

export const OrderWrapperStyled = styled.div`
    display: flex;
    flex-direction: column;
    border-radius: ${BorderRadius.md};
    box-shadow: 2px 2px 8px 0px ${Colors.secondary};
    color: ${Colors.secondary};

    & > div:last-child > div {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        box-shadow: 0px -1px 0px 0px ${Colors.gray};
        padding: ${Spacing.md} ${Spacing.lg};
    }
`

export const OrderClickWrapperStyled = styled.div`
    display: flex;
    justify-content: space-between;
    padding: ${Spacing.md} ${Spacing.lg};
    cursor: pointer;

    div {
        display: flex;
        column-gap: ${Spacing.xl};
    }
`

export const OrderQRWrapperStyled = styled.div`
    display: flex;
    flex-direction: column;
    cursor: pointer;
`

export const OrderProductsWrapperStyled = styled.div`
    display: flex;
    align-items: center;
    column-gap: ${Spacing.md};
    row-gap: ${Spacing.sm};
    flex-wrap: wrap;
`

export const OrderProductWrapperStyled = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;
`

export const OrderChipStyled = styled.div<{ $status: string }>`
    text-transform: uppercase;
    background-color: ${({ $status }) => $status === 'completed' ? Colors.success : Colors.error};
    color: ${Colors.white};
    padding: ${Spacing.xs} ${Spacing.md};
    border-radius: ${BorderRadius.sm};
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 1px;
    height: max-content;
    margin-bottom: 2px;
`

export const OrderInfoWrapperStyled = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
`
