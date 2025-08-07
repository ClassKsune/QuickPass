import { useRouter } from "next/navigation"
import { Button, ButtonSize, ButtonVariant } from "../Button"
import { PricingCardStyled, PricingWrapperStyled } from "./Pricing.style"
import { useSession } from "next-auth/react";
import { useMemo } from "react";
import { useTranslations } from "next-intl";

export const Pricing = () => {
    const t = useTranslations("Pricing")
    const { data: session } = useSession();
    const user = useMemo(() => session?.user, [session]);
    const router = useRouter()

    return (
        <PricingWrapperStyled>
            <PricingCardStyled>
                <h2>{t("free.title")}</h2>
                <h3>0 CZK</h3>
                <ul>
                    <li>{t("free.pros.url")}</li>
                    <li>{t("free.pros.edit")}</li>
                    <li>{t("free.pros.unlimitedUrls")}</li>
                    <li>{t("free.pros.moreVideos")}</li>
                    <li>{t("free.pros.rearrange")}</li>
                    <li>{t("free.pros.qr")}</li>
                </ul>
                {user ? (
                    <Button label={t("free.owned")} variant={ButtonVariant.SECONDARY} disabled size={ButtonSize.sm} />
                ) : (
                    <Button onClick={() => router.push("/register")} label={t("free.button")} variant={ButtonVariant.SUCCESS} size={ButtonSize.sm} />
                )}
            </PricingCardStyled>
            <PricingCardStyled>
                <h2>{t("pro.title")}</h2>
                <h3>45 CZK / měsíc</h3>
                <ul>
                    <li>{t("pro.pros.allFree")}</li>
                    <br />
                    <b>{t("pro.pros.upcoming")}</b>
                    <li>{t("pro.pros.profiles")}</li>
                    <li>{t("pro.pros.specific")}</li>
                </ul>
                {user ? (
                    <Button label={t("pro.buy")} variant={ButtonVariant.SUCCESS} size={ButtonSize.sm} />
                ) : (
                    <Button onClick={() => router.push("/login")} label={t("pro.button")} variant={ButtonVariant.SUCCESS} size={ButtonSize.sm} />
                )}
            </PricingCardStyled>
            <PricingCardStyled>
                <h2>{t("enterprise.title")}</h2>
                <h3>?</h3>
                <ul>
                    <li>{t("enterprise.pros.contact")}</li>
                </ul>
                <Button onClick={() => router.push("/#contact")} label={t("enterprise.button")} variant={ButtonVariant.SUCCESS} size={ButtonSize.sm} />
            </PricingCardStyled>
        </PricingWrapperStyled>
    )
}