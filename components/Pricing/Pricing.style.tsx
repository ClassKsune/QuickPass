import { BorderRadius, Colors, Spacing } from "@/utils";
import styled from "styled-components";

export const PricingWrapperStyled = styled.div`
    display: flex;
    row-gap: ${Spacing.xl};
    padding: ${Spacing.xxl} 10vw;
    column-gap: ${Spacing.xl};
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
`

export const PricingCardStyled = styled.div`
    display: flex;
    flex-direction: column;
    box-shadow: 0px 4px 16px 0px ${Colors.gray};
    border-radius: ${BorderRadius.md};
    padding: ${Spacing.md} ${Spacing.xl};
    width: 280px;
    height: 360px;
    margin-inline: auto;
    transition: all 0.3s ease-in-out;

    ul {
        margin-block: ${Spacing.lg};
        list-style: disc;
        font-size: 14px;
    }

    &:hover {
        box-shadow: 0px 8px 24px 0px ${Colors.primary};
        transform: translateY(-4px);
    }

    h2 {
        font-weight: 400;
        text-align: center;
    }

    h3 {
        text-align: center;
        font-size: 24px;
        font-weight: 800;
        color: #73bb08;
    }

    button {
        margin-top: auto;
    }
`
