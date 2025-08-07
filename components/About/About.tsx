import Image from "next/image"
import { AboutStoryTitleWrapperStyled, AboutStoryWrapperStyled, AboutTitleWrapperStyled, AboutWrapperStyled } from "./About.style"
import { useTranslations } from "next-intl"

export const About = () => {
    const t = useTranslations("About")

    return (
        <AboutWrapperStyled>
            <AboutTitleWrapperStyled>
                <h1>{t("title")}</h1>
                <p>{t("subtitle")}</p>
            </AboutTitleWrapperStyled>
            <AboutStoryWrapperStyled>
                <AboutStoryTitleWrapperStyled>
                    <h4>{t("story.subtitle")}</h4>
                    <h3>{t("story.title")}</h3>
                </AboutStoryTitleWrapperStyled>
                <p>{t("story.desc")}</p>
            </AboutStoryWrapperStyled>
            <Image src="/images/image_placeholder.svg" alt="Image placeholder" width={400} height={300} />
        </AboutWrapperStyled>
    )
}