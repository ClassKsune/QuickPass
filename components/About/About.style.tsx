import { Colors, Spacing } from "@/utils";
import styled from "styled-components";

export const AboutTitleWrapperStyled = styled.div`
    display: flex;
    flex-direction: column;
    row-gap: ${Spacing.xl};
    text-align: center;
    background-color: ${Colors.black};
    color: ${Colors.white};

    h1 {
        font-size: clamp(1.8rem, 5vw, 2.6rem);
    }

    p {
        font-size: 14px;
        color: ${Colors.lightWhite};
    }
`

export const AboutWrapperStyled = styled.div`
    display: flex;
    flex-direction: column;
    row-gap: ${Spacing.xl};
    margin-top: -72px;

    & > * {
        padding: ${Spacing.xxl} 10vw;
    }

    ${AboutTitleWrapperStyled} {
        padding-top: calc(${Spacing.xxl} + 72px);
    }

    img {
        width: 100%;
        height: auto;
    }
`

export const AboutStoryWrapperStyled = styled.div`
    display: grid;
    justify-content: space-between;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    column-gap: ${Spacing.xxl};
    row-gap: ${Spacing.xl};
`

export const AboutStoryTitleWrapperStyled = styled.div`
    display: flex;
    flex-direction: column;
    column-gap: ${Spacing.lg};
    row-gap: ${Spacing.md};

    h4 {
        font-size: clamp(0.8rem, 3vw, 1.4rem);
    }

    h3 {
        font-size: clamp(1.6rem, 5vw, 2.8rem);
        line-height: clamp(1.6rem, 5vw, 2.8rem);
    }
`