import { Fonts, Spacing } from "@/utils";
import styled from "styled-components";

export const Description = styled.p`

`

export const RegisterForm = styled.form`
    width: 60vw;
    min-width: min(400px, 100vw);
    padding: ${Spacing.xl} 10vw;
    font-family: ${Fonts.Roboto};

    h1 {
        margin-bottom: ${Spacing.xs}!important;
    }

    ${Description} {
        padding-bottom: ${Spacing.xl};
    }

    a {
        text-decoration: underline;
        font-weight: 600;
    }

    button {
        width: 100%;
        margin-block: ${Spacing.md};
    }
`

export const NameWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    column-gap: ${Spacing.sm};
    margin-bottom: ${Spacing.sm};

    & * {
        width: 100%;
    }
`

export const RegisterControls = styled.div`
    display: flex;
    flex-direction: column;
    row-gap: ${Spacing.xs};
    justify-content: space-between;
`

export const NotOwnedAccount = styled.p`

`
