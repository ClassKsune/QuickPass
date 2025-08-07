"use client"

import Link from "next/link";
import { FooterAboutUs, FooterAddress, FooterContact, FooterContent, FooterSocials, FooterTermsWrapper, FooterWrapper } from "./Footer.style";
import { useTranslations } from "next-intl";
import { Navigation } from "../Header/Navigation";
import Image from "next/image";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebook, faInstagram, faXTwitter, faLinkedin, faYoutube } from '@fortawesome/free-brands-svg-icons'
import { library } from "@fortawesome/fontawesome-svg-core";
import { usePathname } from "next/navigation";

library.add(faFacebook, faInstagram, faXTwitter, faLinkedin, faYoutube);

export const Footer = () => {
    const t = useTranslations("Footer")
    const pathname = usePathname();
    const hideHeaderFooterRegex = /^\/([a-z]{2}\/)?profile\/[^/]+$/;
    const shouldHideFooterFooter = hideHeaderFooterRegex.test(pathname);

    if (shouldHideFooterFooter) return null;

    return (
        <FooterWrapper>
             <FooterContent>
                <FooterAboutUs>
                    <Image priority src="/images/big_logo.png" alt="big logo" height={28} width={162} />
                    <FooterAddress>
                        <b>{t("aboutUs.address")}:</b>
                        <span>Náměstí T. G. Masaryka 1281, Zlín 760 01</span>
                    </FooterAddress>
                    <FooterContact>
                        <b>{t("aboutUs.contact")}:</b>
                        <span>+420 775 679 661</span>
                        <span>info@quickpass.cz</span>
                    </FooterContact>
                    <FooterSocials>
                        <Link href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                            <FontAwesomeIcon icon={faFacebook} size="xl" />
                        </Link>
                        <Link href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                            <FontAwesomeIcon icon={faInstagram} size="xl" />
                        </Link>
                        <Link href="https://www.x.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                            <FontAwesomeIcon icon={faXTwitter} size="xl" />
                        </Link>
                        <Link href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                            <FontAwesomeIcon icon={faLinkedin} size="xl" />
                        </Link>
                        <Link href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                            <FontAwesomeIcon icon={faYoutube} size="xl" />
                        </Link>
                    </FooterSocials>
                </FooterAboutUs>
                <Navigation />
             </FooterContent>
            <FooterTermsWrapper>
                <p>{`© ${new Date().getFullYear()} QuickPass. ${t("rights")}.`}</p>
                <div>
                    <Link href="policy">{t("links.policy")}</Link>
                    <Link href="terms">{t("links.terms")}</Link>
                </div>
            </FooterTermsWrapper>
        </FooterWrapper>
    );
}