import { Spacing } from "@/utils";
import styled from "styled-components";

export const OrdersSuccessWrapperStyled = styled.div`
    display: flex;
    flex-direction: column;
    padding: calc(${Spacing.lg} + 5vh) 10vw;
    align-items: center;

    h1 {
        font-size: clamp(2.8, 6vw, 3.5rem);
    }
`
