import { BorderRadius, Colors, Spacing } from "@/utils";
import styled from "styled-components";
import { DigitalProfileWrapperStyled } from "../DigitalProfile/DigitalProfile.style";

export const ProfileWrapperStyled = styled.div`
    display: flex;
    flex-direction: column;
    row-gap: ${Spacing.sm};
    box-shadow: 0px 4px 16px 0px #00000040;
    border-radius: 40px;
    padding: 24px;
    overflow: hidden;
    width: 100%;
    max-width: 800px;
    height: max-content;

    h2 {
        padding-top: ${Spacing.md};
        font-size: 14px;

        span {
            font-weight: normal;
        }
    }
`

export const SocialsAndLinksWrapperStyled = styled.div`
    background-color: ${Colors.lightWhite};
    padding: ${Spacing.md} ${Spacing.lg};
    border-radius: ${BorderRadius.md};

    h3 {
        padding-top: ${Spacing.md};
        padding-left: ${Spacing.md};
        font-size: 14px;
    }
`

export const ProfileAndDigitalWrapperStyled = styled.div`
    display: flex;
    justify-content: space-between;
    margin-block: ${Spacing.xl};
    column-gap: ${Spacing.xl};
    row-gap: ${Spacing.md};
    flex-wrap: wrap;

    ${DigitalProfileWrapperStyled} {
        max-width: 500px;
    }

    @media (max-width: 1665px) {
        justify-content: center;
    }
`

export const ProfileWrapper = styled.div`
    display: flex;
    flex-direction: column;
    margin: 0 10vw 7.5vh 10vw;

    & > button {
        margin-left: auto;
        padding-inline: 3vw;
    }
`
