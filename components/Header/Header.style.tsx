import { Colors, Fonts, Spacing } from '@/utils';
import { device } from '@/utils/Breakpoints';
import styled from 'styled-components';
import { ControlsWrapper, SelectStyled } from './Controls.style';

export const HeaderWrapper = styled.header`
    position: fixed;
    left: 50%;
    top: 1rem;
    transform: translateX(-50%);
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 80vw;
    margin: 0 auto;
    padding: ${Spacing.sm} ${Spacing.xxl};
    border-radius: ${Spacing.xl};
    background-color: ${Colors.white};
    color: ${Colors.black};
    font-family: ${Fonts.Roboto};
    backdrop-filter: blur(20px);
    box-shadow: 0px 4px 16px 0px #00000040;
    transition: all 0.3s ease;
    z-index: 5;

    image {
        aspect-ratio: 162 / 28;
    }

    & > a {
        display: flex;
    }

    & > button {
        display: none;
    }

    @media ${device.lg} {
        top: 0;
        width: 100vw;
        border-radius: 0;
    }

    @media ${device.md} {
        padding: ${Spacing.sm} ${Spacing.md};

        & > a, nav, ${SelectStyled} {
            display: none;
        }

        ${ControlsWrapper} {
            margin-left: auto;
        }

        & > button {
            display: block;
        }
    }
`
