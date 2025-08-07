import { Spacing } from "@/utils";
import styled from "styled-components";

export const FAQWrapperStyled = styled.div`
    display: flex;
    flex-direction: column;
    row-gap: ${Spacing.xl};
    padding: ${Spacing.xxl} 10vw;
`

export const FAQQuestionsWrapperStyled = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    row-gap: ${Spacing.xl};
    column-gap: ${Spacing.xxl};
    margin-block: ${Spacing.lg};

    h3 {
        font-weight: 500;
        font-size: 21px;
    }

    p {
        font-size: 14px;
    }
`

export const FAQContactWrapperStyled = styled.div`
    display: flex;
    flex-direction: column;
    row-gap: ${Spacing.sm};

    h2 {
        font-weight: 700;
        font-size: 24px;
    }

    button {
        width: fit-content;
    }
`
