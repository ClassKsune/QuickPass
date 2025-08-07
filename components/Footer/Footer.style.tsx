import { Colors, Spacing } from "@/utils";
import { device } from "@/utils/Breakpoints";
import styled from "styled-components";

export const FooterWrapper = styled.footer`
    display: flex;
    flex-direction: column;
    padding: 7.5vh 10vw;
    background-color: ${Colors.black};
    color: ${Colors.white};
    margin-top: auto;
    font-family: 'Roboto', sans-serif;
    font-size: 14px;
`

export const FooterTermsWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    border-top: 1px solid ${Colors.white};
    padding-top: 2.5vh;
    width: 100%;

    div {
        display: flex;
        column-gap: ${Spacing.md};

        a {
            text-decoration: underline;
        }
    }

    @media ${device.sm} {
        flex-direction: column-reverse;
        row-gap: ${Spacing.lg};

        & > div {
            flex-direction: column;
            row-gap: ${Spacing.sm};
        }
    }
`

export const FooterContent = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    row-gap: ${Spacing.xl};
    padding-bottom: 5vh;

    nav {
        flex-direction: column;
        padding-right: 15vw;

        a:hover {
            background-color: unset;
            color: ${Colors.grey};
        }
    }
`

export const FooterSocials = styled.div`
    display: flex;
    column-gap: ${Spacing.md};
    padding-top: ${Spacing.sm};
`

export const FooterAboutUs = styled.div`
    display: flex;
    flex-direction: column;
    row-gap: ${Spacing.md};

    img {
        filter: invert(1) brightness(2);
    }

    b {
        font-weight: 600;
        padding-bottom: ${Spacing.xs};
    }

    & > div:not(${FooterSocials}) {
        display: flex;
        flex-direction: column;
    }
`

export const FooterAddress = styled.div`

`

export const FooterContact = styled.div`

`

