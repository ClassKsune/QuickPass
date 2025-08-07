import React from 'react';
import * as socialUrl from 'social-url';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import * as Brands from '@fortawesome/free-brands-svg-icons';

interface SocialMediaIconProps {
  url: string;
}

const getCustomAddedSocials = (url: string) => {
    if (url.includes('x.com')) return { network: 'x-twitter' };
}

const replaceNetworkNames = (social: any) => {
    if (social.network === "YouTube") return ({ ...social, network: "Youtube" });
    return social
}

export const getIcon = (url: string) => {
    const social = socialUrl.parse(url);
    if (!social || !social.network) {
        const customSocial = getCustomAddedSocials(url);
        if (customSocial) return customSocial;
        return null
    }
    if (social.network) return replaceNetworkNames(social)
    return null
};

export const getIconName = (url: string) => {
    const iconName = getIcon(url);
    if (!iconName) return null;

    const iconNameCapitalized = iconName.network
        .split('-')
        .map((part: string) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
        .join('');

    return `fa${iconNameCapitalized}`;
};

export const SocialMediaIcon: React.FC<SocialMediaIconProps> = ({ url }) => {
    const iconName = getIconName(url);
    if (!iconName) return null;

    const icon = Brands[iconName as keyof typeof Brands];
    if (!icon) return null;
    library.add(icon as any);

    return <FontAwesomeIcon icon={icon as any} size="lg" />;
};