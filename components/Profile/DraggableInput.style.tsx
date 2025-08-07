import { Colors, Spacing } from "@/utils";
import { Button } from "@mantine/core";
import styled from "styled-components";

export const DraggableItemStyled = styled.div<{ $isDragging: boolean }>`
    display: flex;
    align-items: center;
    margin-bottom: ${Spacing.xs};
    box-shadow: ${({ $isDragging }) => $isDragging && 'var(--mantine-shadow-sm)'};
`

export const DraggableHandleStyled = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: light-dark(var(--mantine-color-gray-6), var(--mantine-color-dark-1));
    padding-left: var(--mantine-spacing-md);
    padding-right: var(--mantine-spacing-md);
`

export const ButtonStyled = styled(Button<"button">)`
    width: 100%;
    background-color: transparent;
    border: 1px solid ${Colors.black};

    &:hover {
        background-color: ${Colors.white};

       svg {
            fill: ${Colors.secondary};
        }
    }
`
