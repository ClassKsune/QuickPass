import { Spacing } from "@/utils";
import styled from "styled-components";

export const ShippingWrapperStyled = styled.div`
    span {
        display: flex;
        column-gap: ${Spacing.xs};
    }

    svg {
        padding-top: ${Spacing.xs};
    }

    button {
        margin-left: unset;
    }
`