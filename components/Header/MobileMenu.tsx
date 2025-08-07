import Link from "next/link"
import { MobileMenuWrapper } from "./MobileMenu.style"
import Image from "next/image"
import { Navigation } from "./Navigation"
import { Controls } from "./Controls"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faXmark } from "@fortawesome/free-solid-svg-icons"

type MobileMenuProps = {
    opened: boolean
    toggle: () => void
}

export const MobileMenu = ({ opened, toggle }: MobileMenuProps) => {
    return (
        <MobileMenuWrapper $open={opened}>
            <FontAwesomeIcon onClick={toggle} icon={faXmark} size="lg" />
            <Link onClick={toggle} href="/">
                <Image priority src="/images/big_logo.png" alt="big logo" height={28} width={162} />
            </Link>
            <Navigation onClick={toggle} />
            <Controls mobile onClick={toggle} />
        </MobileMenuWrapper>
)
}