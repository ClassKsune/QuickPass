import { BorderRadius, Colors, Spacing } from "@/utils";
import { device } from "@/utils/Breakpoints";
import styled from "styled-components";
import { EditorVariantControlsStyled } from "../Editor/Editor.style";

export const LandingIdentityTitleWrapperStyled = styled.div`
    display: flex;
    flex-direction: column;
    row-gap: ${Spacing.xl};
    background-color: ${Colors.black};
    color: ${Colors.white};
    padding-block: calc(${Spacing.xl} + 72px + 5vh) calc(${Spacing.xxl} + 10vh);
    padding-inline: 10vw ${Spacing.xxl};
    max-width: 100vw;

    h1 {
        font-size: clamp(2rem, 5vw, 3rem);
        line-height: clamp(2.4rem, 6vw, 3.6rem);
    }

    p {
        font-size: clamp(0.6rem, 5vw, 1rem);
        font-weight: 300;
    }

    h1 > span, p > span {
        color: ${Colors.primary};
    }

    div {
        display: flex;
        column-gap: ${Spacing.sm};
    }
`

export const LandingIdentityWrapperStyled = styled.div`
    position: relative;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr;
    width: 100vw;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    @media ${device.md} {
        grid-template-columns: 1fr;

        img {
            position: absolute;
            filter: brightness(0.3);
            z-index: -1;
        }

        ${LandingIdentityTitleWrapperStyled} {
            background-color: transparent;
        }
    }
`

export const LandingWrapperStyled = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: -72px;

    & > *:not(${LandingIdentityWrapperStyled}) {
        padding-inline: 10vw;
    }
`

export const LandingVideoWrapperStyled = styled.div`
    display: flex;
    flex-direction: column;
    row-gap: ${Spacing.xxl};
    padding-block: calc(${Spacing.xxl} + 5vh);

    & > div:first-child {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
        column-gap: ${Spacing.xxl};
        row-gap: ${Spacing.xxl};

        & > div:first-child {
            max-width: min(100%, 80vw);
            border-radius: ${BorderRadius.xl};
            overflow: hidden;
        }
    }
`

export const LandingVideoTitleWrapperStyled = styled.div`
    max-width: 80vw;

    h2 {
        font-size: clamp(2rem, 5vw, 3rem);
        line-height: clamp(2.3rem, 5vw, 3.3rem);
        padding-bottom: ${Spacing.md};
    }

    div {
        display: flex;
        column-gap: ${Spacing.sm};
        row-gap: ${Spacing.xs};
        flex-wrap: wrap;
        padding-block: ${Spacing.lg} ${Spacing.xl};

        span {
            padding: ${Spacing.xs} ${Spacing.md};
            background-color: ${Colors.black};
            color: ${Colors.white};
            border-radius: ${BorderRadius.xl};
        }
    }

    @media (max-width: 1078px) {
        button {
            width: 100%;
        }
    }
`

export const LandingBenefitsWrapperStyled = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    column-gap: ${Spacing.xxl};
    row-gap: ${Spacing.xl};
`

export const LandingBenefitWrapperStyled = styled.div`
    display: flex;
    flex-direction: column;
    row-gap: ${Spacing.lg};
    column-gap: ${Spacing.lg};

    h3 {
        font-size: clamp(1.4rem, 3.6vw, 1.6rem);
        line-height: clamp(1.4rem, 3.6vw, 1.6rem);
    }

    p {
        font-size: 18px;
    }
`

export const LandingSolutionsWrapperStyled = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    column-gap: ${Spacing.xl};
    row-gap: ${Spacing.lg};
    background: url(/images/landing_phone.jpg) no-repeat center center;
    background-size: cover;
    min-height: 30vh;
    color: ${Colors.white};
    justify-content: space-between;

    @media ${device.md} {
        flex-wrap: wrap;
    }
`

export const LandingSolutionWrapperStyled = styled.div`
    display: flex;
    column-gap: ${Spacing.xl};
    row-gap: ${Spacing.lg};
    height: max-content;
    z-index: 1;

    @media ${device.lg} {
        flex-wrap: wrap;
    }
`

export const LandingSolutionStyled = styled.span`
    border-left: 2px solid ${Colors.white};
    padding-left: ${Spacing.xl};
    font-size: clamp(1.4rem,2.6vw,2.6rem);
    text-shadow: 0 0 5px ${Colors.black};
`

export const LandingSolutionMaskStyled = styled.div`
    position: absolute;
    background-color: black;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    mask-image: radial-gradient(ellipse at center, rgba(0,0,0,0) 25%, rgba(0,0,0,.8) 75%, rgba(0,0,0,1) 100%);
    mask-size: cover;
    object-fit: cover;
`

export const LandingSolutionTitleWrapperStyled = styled.div`
    display: flex;
    flex-direction: column;
    z-index: 1;

    h4 {
        color: ${Colors.primary};
        font-size: clamp(0.5rem, 3vw, 1rem);
    }

    h3 {
        font-size: clamp(1.6rem, 5vw, 2.4rem);
    }

    span {
        color: ${Colors.lightWhite};
        font-size: clamp(0.5rem, 3vw, 1rem);
    }
`

export const LandingAdaptWrapperStyled = styled.div`
    display: flex;
    justify-content: space-between;
    column-gap: ${Spacing.xl};
    padding-block: calc(${Spacing.xxl} + 5vh);
    row-gap: ${Spacing.xl};

    @media ${device.lg} {
        flex-wrap: wrap;
    }
`

export const LandingAdaptEditorWrapperStyled = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    padding-inline: ${Spacing.xxl};

    @media (max-width: 1553px) {
        margin-inline: auto;

        button {
            width: 100% !important;
        }
    }

    ${EditorVariantControlsStyled} {
        & > div {
            margin-inline: auto;
            margin-top: ${Spacing.md};
        }

        svg {
            position: absolute;
            top: 140px;
            transform: translateY(-50%);
        }

        svg:first-child {
            left: 0;
        }

        svg:last-child {
            right: 0;
        }
    }

    img {
        border-radius: ${BorderRadius.md};
        max-width: calc(80vw - ${Spacing.xxl} * 2);
        height: auto;
    }

    button {
        margin-top: ${Spacing.xl};
        margin-left: auto;
        width: max-content;
    }
`

export const LandingTitleWrapperStyled = styled.div`
    display: flex;
    flex-direction: column;
    row-gap: ${Spacing.md};
    max-width: 700px;
    justify-content: space-between;

    @media (max-width: 1553px) {
        align-items: center;
        margin-inline: auto;

        & > div:last-child {
            width: 100%;

            button {
                width: 50%;
            }
        }
    }

    h4 {
        font-size: clamp(0.5rem, 2vw, 1rem);
    }

    h3 {
        font-size: clamp(1.6rem, 2vw, 2.4rem);
        line-height: clamp(2rem, 2.4vw, 2.8rem);
    }

    p {
        font-size: clamp(0.5rem, 1.5vw, 1rem);
    }
`

export const LandingTitleWrapWrapperStyled = styled.div`
    display: flex;
    flex-wrap: wrap;
    column-gap: ${Spacing.xxl};
    row-gap: ${Spacing.md};

    & > div {
        max-width: calc(350px - ${Spacing.xxl} * 0.5);
    }
`

export const LandingTitleButtonWrapperStyled = styled.div`

`

export const LandingNFCWrapperStyled = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    row-gap: ${Spacing.lg};
    background: url(/images/landing_guy.png) no-repeat center center;
    background-size: cover;
    min-height: 40vh;
    color: ${Colors.white};
    overflow: hidden;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.75);
        z-index: 1;
    }

    & > * {
        position: relative;
        z-index: 2;
    }

    div {
        display: flex;
        column-gap: ${Spacing.md};
    }

    h3 {
        font-size: clamp(1.6rem, 5vw, 2.4rem);
    }

    p {
        font-size: clamp(0.5rem, 3vw, 1rem);
    }
`

export const LandingReviewWrapperStyled = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-block: calc(${Spacing.xxl} + 5vh);

    ${EditorVariantControlsStyled} {
        position: relative;
        width: 100%;
        max-width: 900px;

        & > div {
            margin-inline: auto;
            margin-top: ${Spacing.md};
        }

        svg {
            position: absolute;
            top: -128px;
            transform: translateY(-50%);
        }

        svg:first-child {
            left: 0;
        }

        svg:last-child {
            right: 0;
        }
    }
`

export const LandingProfileWrapperStyled = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    row-gap: ${Spacing.xs};
    max-width: 600px;

    h3 {
        margin-block: ${Spacing.md};
        text-align: center;
    }

    p {
        margin-top: -${Spacing.sm};
        margin-bottom: ${Spacing.lg};
    }

    img:nth-child(3) {
        border-radius: 50%;
        object-fit: cover;
    }
`

export const LandingFAQWrapperStyled = styled.div`
    display: flex;
    flex-direction: column;
    padding-block: calc(${Spacing.xxl} + 5vh);
    background-color: ${Colors.black};
    color: ${Colors.white};
    row-gap: ${Spacing.xxl};
`

export const LandingFAQTitleWrapperStyled = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    row-gap: ${Spacing.xl};

    h2 {
        font-size: clamp(2rem, 5vw, 3rem);
    }

    h3 {
        font-size: clamp(1.6rem, 5vw, 2.4rem);
    }

    h4 {
        font-size: clamp(1.2rem, 4vw, 2rem);
    }

    span, p {
        font-size: clamp(0.5rem, 3vw, 1rem);
        font-weight: 300;
        color: ${Colors.lightWhite};
    }
`

export const LandingFAQQuestionsWrapperStyled = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 800px;
    margin-inline: auto;
    width: 100%;

    & > div {
        flex-direction: column;
        border-bottom: 1px solid ${Colors.lightWhite};
        padding-block: ${Spacing.md};
        width: 100%;
        padding-right: ${Spacing.sm};

        & > div:first-child {
            display: flex;
            justify-content: space-between;

            div {
                display: flex;
                align-items: center;
                cursor: pointer;
            }
        }
    }

    & > div:first-child {
        border-top: 1px solid ${Colors.lightWhite};
    }
`

export const LandingFAQFooterWrapperStyled = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    row-gap: ${Spacing.lg};

    div {
        display: flex;
        column-gap: ${Spacing.md};
    }
`

export const LandingContactFormStyled = styled.form`
    display: flex;
    flex-direction: column;
    margin-inline: auto;
    padding-block: calc(${Spacing.xxl} + 5vh);
    row-gap: ${Spacing.sm};
`

export const LandingContactRowWrapperStyled = styled.div`
    display: flex;
    justify-content: space-between;
    column-gap: ${Spacing.md};

    & > div {
        width: 50%;
    }
`

export const LandingContactTitleWrapperStyled = styled.div`
    display: flex;
    flex-direction: column;
    row-gap: ${Spacing.xs};
    padding-bottom: ${Spacing.md};
    text-align: center;

    h2 {
        font-size: clamp(1.8rem, 4vw, 2.8rem);
    }
`
