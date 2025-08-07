import { Fonts, Spacing } from "@/utils";
import styled from "styled-components";

export const Desc = styled.p`

`

export const LoginForm = styled.form`
    width: 60vw;
    min-width: min(400px, 100vw);
    padding: ${Spacing.xl} 10vw;
    font-family: ${Fonts.Roboto};

    h1 {
        margin-bottom: ${Spacing.xs}!important;
    }

    ${Desc} {
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

export const LoginControls = styled.div`
    display: flex;
    justify-content: space-between;
`

export const NotOwnedAccount = styled.p`

`
