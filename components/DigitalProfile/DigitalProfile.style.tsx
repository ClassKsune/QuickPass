import { BorderRadius, Colors, Spacing } from "@/utils";
import Image from "next/image";
import styled from "styled-components";

export const DigitalProfileWrapperStyled = styled.div`
    display: flex;
    flex-direction: column;
    width: max-content;
    max-width: 100%;
    margin-inline: auto;
`

export const DigitalProfileImageWrapper = styled.div`
    position: relative;
    display: flex;
    background-color: black;
    border-top-left-radius: ${BorderRadius.md};
    border-top-right-radius: ${BorderRadius.md};
    overflow: hidden;
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

export const DigitalProfileTitleWrapperStyled = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    column-gap: ${Spacing.sm};
    row-gap: ${Spacing.xs};

    .name-share-wrapper {
        display: flex;
        align-items: center;
        column-gap: ${Spacing.sm};
        flex: 1;

        h2 {
            font-size: 24px;
            line-height: 24px;
            margin: 0;
        }

        .share-button {
            background: none;
            border: 1px solid ${Colors.gray};
            border-radius: 50%;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            color: ${Colors.gray};
            transition: all 0.2s ease;

            &:hover {
                background-color: ${Colors.gray};
                color: white;
                border-color: ${Colors.gray};
            }

            &:active {
                transform: scale(0.95);
            }
        }
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
