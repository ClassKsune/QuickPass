import { useTranslations } from "next-intl"
import { Button, ButtonSize, ButtonVariant } from "../Button"
import { FAQContactWrapperStyled, FAQQuestionsWrapperStyled, FAQWrapperStyled } from "./FAQ.style"
import { useRouter } from "next/navigation"

export const FAQ = () => {
    const t = useTranslations("FAQ")
    const router = useRouter()

    const handleContact = () => {
        router.push("/#contact")
    }

    const questions = ["whatIsNfc", "whatDevicesItSupports", "isAppNeeded", "isItFree", "delivery"]

    return (
        <FAQWrapperStyled>
            <h1>{t("title")}</h1>
            <p>{t("desc")}</p>
            <FAQQuestionsWrapperStyled>
                {questions.map((item, index) => (
                    <div key={index}>
                        <h3>{t(`questions.${item}.question`)}</h3>
                        <p>{t(`questions.${item}.answer`)}</p>
                    </div>
                ))}
            </FAQQuestionsWrapperStyled>
            <FAQContactWrapperStyled>
                <h2>{t("moreQuestions")}</h2>
                <p>{t("info")}</p>
                <Button onClick={handleContact} size={ButtonSize.md} variant={ButtonVariant.SECONDARY} label={t("button")} />
            </FAQContactWrapperStyled>
        </FAQWrapperStyled>
    )
}