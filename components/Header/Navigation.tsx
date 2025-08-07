import { NavLink } from "@mantine/core";
import { NavigationWrapper } from "./Navigation.style";
import { useTranslations } from "next-intl";

export const Navigation = ({ onClick = () => {} }: { onClick?: () => void }) => {
    const t = useTranslations("Header.navigation")

    return (
        <NavigationWrapper>
            <NavLink onClick={onClick} href="/editor" label={t("editor")} />
            <NavLink onClick={onClick} href="/pricing" label={t("pricing")} />
            <NavLink onClick={onClick} href="/about" label={t("about")} />
            <NavLink onClick={onClick} href="/faq" label={t("faq")} />
        </NavigationWrapper>
    );
}