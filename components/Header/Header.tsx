"use client"

import Image from "next/image";
import { HeaderWrapper } from "./Header.style";
import { Navigation } from "./Navigation";
import { Controls } from "./Controls";
import Link from "next/link";
import { useDisclosure } from "@mantine/hooks";
import { Burger } from "@mantine/core";
import { MobileMenu } from "./MobileMenu";
import { usePathname } from "next/navigation";

export const Header = () => {
    const [opened, { toggle }] = useDisclosure();
    const pathname = usePathname();

    const hideHeaderHeaderRegex = /^\/([a-z]{2}\/)?profile\/[^/]+$/;
    const shouldHideHeaderFooter = hideHeaderHeaderRegex.test(pathname);

    if (shouldHideHeaderFooter) return null;

    return (
        <HeaderWrapper className="header">
            <MobileMenu opened={opened} toggle={toggle} />
            <Burger opened={opened} onClick={toggle} aria-label="Toggle mobile menu" />
            <Link href="/">
                <Image priority src="/images/big_logo.png" alt="big logo" height={28} width={162} />
            </Link>
            <Navigation />
            <Controls />
        </HeaderWrapper>
    );
}