import { Colors, Spacing } from "@/utils";
import styled from "styled-components";
import { NavigationWrapper } from "./Navigation.style";
import { CartWrapper, ControlsWrapper, SelectStyled } from "./Controls.style";
import { device } from "@/utils/Breakpoints";

export const MobileMenuWrapper = styled.div<{ $open: boolean }>`
    position: fixed;
    top: 0;
    left: ${({ $open }) => ($open ? "0" : "-90vw")};
    width: 90vw;
    height: 100vh;
    transition: left 0.3s ease;
    background-color: ${Colors.white};
    padding-block: ${Spacing.xxl};
    overflow: hidden;
    z-index: 6;
    display: none;

    @media ${device.lg} {
        border-right: 1px solid ${Colors.black};
    }

    @media ${device.md} {
        display: block;
    }

    & > * {
        padding-inline: ${Spacing.lg};
    }

    & > svg {
        position: absolute;
        right: 0;
        top: ${Spacing.xxl};
        cursor: pointer;
    }

    & > svg:hover {
        color: ${Colors.secondary};
    }

    ${NavigationWrapper} {
        padding-inline: 0;
        padding-block: ${Spacing.xl};
        display: flex;
        flex-direction: column;

        a {
            padding: ${Spacing.lg} ${Spacing.lg};
        }

        a:hover {
            background-color: ${Colors.grey};
        }
    }

    ${ControlsWrapper} {
        flex-direction: column;
        row-gap: ${Spacing.md};

        a, button {
            height: 48px;
            width: 100%;
        }

        ${CartWrapper} {
            order: 1;
            height: 48px;
            justify-content: center;
            column-gap: ${Spacing.sm};

            span {
                display: block;
            }
        }

        a:first-of-type {
            order: 2;
        }

        a:last-of-type {
            order: 3;
        }

        ${SelectStyled} {
            order: 4;
            align-items: center;

            label {
                display: flex;
                margin-right: auto;
            }
        }
    }

    ${SelectStyled} {
        display: flex;
    }
`