import { useLocale, useTranslations } from "next-intl";
import { AccountContent, AccountWrapper, CartWrapper, ControlsWrapper, SelectStyled } from "./Controls.style";
import { Button, ButtonSize, ButtonVariant } from "../Button";
import {usePathname, useRouter} from '@/i18n/navigation';
import {useParams} from 'next/navigation';
import { useMemo, useState, useTransition } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronUp, faChevronDown, faCartShopping } from '@fortawesome/free-solid-svg-icons'
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useAppSelector } from "@/lib/hooks/hooks";

export const Controls = ({ mobile = false, onClick = () => {} }: { mobile?: boolean, onClick?: () => void }) => {
    const cart = useAppSelector((state) => state.cart);
    const [isPending, startTransition] = useTransition();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const { data: session } = useSession();
    const user = useMemo(() => session?.user, [session]);
    const t = useTranslations("Header.controls")
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const params = useParams();

    const languages = [
        { value: "en", label: "EN" },
        { value: "cs", label: "CZ" },
    ];

    const handleLanguageChange = (value: string | null) => {
        if (value) {
            startTransition(() => {
                router.replace(
                  // @ts-expect-error -- TypeScript will validate that only known `params`
                  // are used in combination with a given `pathname`. Since the two will
                  // always match for the current route, we can skip runtime checks.
                  {pathname, params},
                  {locale: value}
                );
              });
        }
    };

    return (
        <ControlsWrapper>
            {user ? (
                <AccountWrapper>
                    <Button onClick={() => setIsProfileDropdownOpen(prev => !prev)} variant={ButtonVariant.OUTLINE} size={ButtonSize.sm} label={user.email || ""} rightSection={<FontAwesomeIcon icon={isProfileDropdownOpen ? faChevronUp : faChevronDown} />} />
                    <AccountContent $isOpen={isProfileDropdownOpen}>
                        <Link onClick={() => setIsProfileDropdownOpen(false)} href="/profile">{t("profile")}</Link>
                        {user.rights.includes("admin") && <Link onClick={() => setIsProfileDropdownOpen(false)} href="/orders">{t("orders")}</Link>}
                        {user.rights.includes("developer") && user.rights.includes("admin") && <Link onClick={() => setIsProfileDropdownOpen(false)} href="/developer">{t("database")}</Link>}
                        <Button onClick={signOut} variant={ButtonVariant.LIGHT} size={ButtonSize.sm} label={t("logout")} />
                    </AccountContent>
                </AccountWrapper>
            ) : (
                <>
                    <Link onClick={onClick} href="/login">
                        <Button variant={ButtonVariant.PRIMARY} size={ButtonSize.sm} label={t("account.login")} />
                    </Link>
                    <Link onClick={onClick} href="/register">
                        <Button variant={ButtonVariant.OUTLINE} size={ButtonSize.sm} label={t("account.register")} />
                    </Link>
                </>
            )}
            <SelectStyled
                id={mobile ? "mobile-language-select" : "language-select"}
                label={t("language")}
                allowDeselect={false}
                rightSection={<FontAwesomeIcon icon={isDropdownOpen ? faChevronUp : faChevronDown} />}
                onDropdownOpen={() => setIsDropdownOpen(true)}
                onDropdownClose={() => setIsDropdownOpen(false)}
                disabled={isPending}
                data={languages}
                defaultValue={locale}
                onChange={handleLanguageChange}
                size="sm"
            />
            <CartWrapper $empty={cart.products.length === 0} onClick={() => {
                router.push("/order")
                onClick()
            }}>
                <span>{t("basket")}</span>
                <FontAwesomeIcon icon={faCartShopping} size="sm" />
            </CartWrapper>
        </ControlsWrapper>
    );
}