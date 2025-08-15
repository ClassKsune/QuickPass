import { BorderRadius, Colors, Spacing } from "@/utils";
import Image from "next/image";
import styled from "styled-components";

export const DigitalProfileWrapperStyled = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 400px;
    margin-inline: auto;
    
    @media (max-width: 768px) {
        max-width: 100%;
    }
`

export const DigitalProfileImageWrapper = styled.div`
    position: relative;
    display: flex;
    background-color: black;
    border-top-left-radius: ${BorderRadius.md};
    border-top-right-radius: ${BorderRadius.md};
    overflow: hidden;

    .menu-container {
        position: absolute;
        top: 16px;
        right: 16px;
        z-index: 20;
    }

    .menu-button-overlay {
        background: rgba(0, 0, 0, 0.5);
        border: none;
        border-radius: 50%;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: white;
        transition: all 0.2s ease;

        .dots-icon {
            font-size: 18px;
            font-weight: bold;
            line-height: 1;
            letter-spacing: 1px;
        }

        &:hover {
            background: rgba(0, 0, 0, 0.8);
            transform: scale(1.05);
        }

        &:active {
            transform: scale(0.95);
        }
    }

    .dropdown-menu {
        position: absolute;
        top: 40px;
        right: 0;
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        min-width: 140px;
        overflow: hidden;
        animation: slideDown 0.2s ease-out;
        border: 1px solid rgba(0, 0, 0, 0.1);

        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateY(-8px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    }

    .menu-item {
        width: 100%;
        padding: 12px 16px;
        border: none;
        background: white;
        color: #333;
        font-size: 14px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 10px;
        transition: background-color 0.2s ease;

        &:hover {
            background: #f5f5f5;
        }

        &:active {
            background: #e0e0e0;
        }

        svg {
            width: 14px;
            height: 14px;
            color: #666;
        }

        span {
            font-weight: 500;
        }

        &:not(:last-child) {
            border-bottom: 1px solid #f0f0f0;
        }
    }
`;

export const DigitalProfileImage = styled(Image)<{ $set: boolean }>`
    mask-image: ${({ $set }) => ($set && 'radial-gradient(circle, rgba(0, 0, 0, 1) 70%, rgba(0, 0, 0, 0) 100%)')};
    mask-size: cover;
    object-fit: cover;
    width: 100%;
    height: 100%;
    aspect-ratio: 1/1;
`

export const DigitalProfileContentStyled = styled.div`
    display: flex;
    flex-direction: column;
    box-shadow: 0px 4px 16px 0px #00000040;
    padding: ${Spacing.xl} ${Spacing.md};
    border-bottom-left-radius: ${BorderRadius.md};
    border-bottom-right-radius: ${BorderRadius.md};
    row-gap: ${Spacing.md};

    .download-vcard-button {
        background: ${Colors.green};
        color: white;
        border: none;
        border-radius: 20px;
        padding: ${Spacing.sm} ${Spacing.md};
        cursor: pointer;
        transition: background 0.2s ease;

        &:hover {
            background: ${Colors.darkBlue};
        }
    }
`

export const DigitalLinksWrapperStyled = styled.div`
    display: flex;
    flex-direction: column;
    row-gap: ${Spacing.sm};
`

export const DigitalLinkWrapperStyled = styled.a`
    display: flex;
    align-items: center;
    column-gap: ${Spacing.xs};
    box-shadow: 0px 2px 8px 0px #00000040;
    border-radius: ${BorderRadius.xl};
    padding: ${Spacing.sm} ${Spacing.md};
    cursor: pointer;

    img {
        margin-right: ${Spacing.xs};
    }

    h4 > span {
        font-weight: normal;
    }
`

export const DigitalVideosWrapperStyled = styled.div`
    display: flex;
    flex-direction: column;
    row-gap: ${Spacing.sm};

    & > div {
        max-width: 100%;
    }

    iframe {
        border-radius: ${BorderRadius.lg};
        max-width: 100%;
    }
`

export const DigitalProfileBioStyled = styled.div`
    padding-left: ${Spacing.lg};
    padding-block: ${Spacing.xs};
    border-left: 4px solid ${Colors.gray};
`

export const DigitalProfileJobInfoStyled = styled.div`
    margin-bottom: ${Spacing.sm};

    h4 {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
        color: ${Colors.black};
        line-height: 1.4;
    }
`

export const DigitalProfileTitleWrapperStyled = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    column-gap: ${Spacing.sm};
    row-gap: ${Spacing.xs};

    h2 {
        font-size: 24px;
        line-height: 24px;
    }

    h3 {
        font-size: 20px;
        line-height: 20px;
        text-align: right;
    }

    .location-wrapper {
        display: flex;
        height: max-content;
        column-gap: ${Spacing.sm};
        align-items: center;
        color: ${Colors.gray};
        letter-spacing: 1px;
        min-width: max-content;

        svg {
            place-self: flex-start;
        }
    }
`

export const DigitalProfileSocialsStyled = styled.div`
    display: flex;
    column-gap: ${Spacing.md};
    row-gap: ${Spacing.sm};
`

export const DigitalProfileSocialStyled = styled.a`
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${Colors.black};
    border-radius: 50%;
    width: 32px;
    height: 32px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    svg {
        color: ${Colors.white};
        width: 18px;
        height: 18px;
    }

    &:hover {
        background-color: ${Colors.primary};
    }
`
