import Image from "next/image";
import { LandingAdaptEditorWrapperStyled, LandingAdaptWrapperStyled, LandingBenefitsWrapperStyled, LandingBenefitWrapperStyled, LandingContactFormStyled, LandingContactRowWrapperStyled, LandingContactTitleWrapperStyled, LandingFAQFooterWrapperStyled, LandingFAQQuestionsWrapperStyled, LandingFAQTitleWrapperStyled, LandingFAQWrapperStyled, LandingIdentityTitleWrapperStyled, LandingIdentityWrapperStyled, LandingNFCWrapperStyled, LandingProfileWrapperStyled, LandingReviewWrapperStyled, LandingSolutionMaskStyled, LandingSolutionStyled, LandingSolutionsWrapperStyled, LandingSolutionTitleWrapperStyled, LandingSolutionWrapperStyled, LandingTitleButtonWrapperStyled, LandingTitleWrapperStyled, LandingTitleWrapWrapperStyled, LandingVideoTitleWrapperStyled, LandingVideoWrapperStyled, LandingWrapperStyled } from "./Landing.style";
import ReactPlayer from "react-player";
import { Button, ButtonSize, ButtonVariant } from "../Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronCircleLeft, faChevronCircleRight, faChevronDown, faChevronRight, faChevronUp, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { CardVariantEnum } from "../Editor/Editor";
import { EditorVariantControlsStyled, EditorVariantIndicatorStyled, EditorVariantIndicatorWrapperStyled } from "../Editor/Editor.style";
import { useEffect, useMemo, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { Checkbox, Collapse, Select, Textarea, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useTranslations } from "next-intl";

export const Landing = () => {
  const t = useTranslations("Landing")

  const profiles = [
    {
      name: "Emily Johnson",
      image: "/images/landing_profile_1.jpg",
      desc: t("profiles.emily.desc"),
      title: t("profiles.emily.title"),
    },
    {
      name: "Clark Smith",
      image: "/images/landing_profile_2.jpg",
      desc: t("profiles.clark.desc"),
      title: t("profiles.clark.title"),
    },
  ]

  const imgRotation = [
    "test",
    "test",
    "test"
  ]
  
  const [selectedVariant, setSelectedVariant] = useState<CardVariantEnum>(CardVariantEnum.Cherry);
  const [selectedProfile, setSelectedProfile] = useState(profiles[0].image);
  const profile = useMemo(() => profiles.find((p) => p.image === selectedProfile), [selectedProfile]);
  const router = useRouter()

  const topics = ["general", "support", "business", "feedback", "other"]

  const questions = ["whatIsNfc", "whatDevicesItSupports", "isAppNeeded", "isItFree", "delivery"]

  const changeCardVariant = (direction: 'prev' | 'next') => {
    const variants = Object.values(CardVariantEnum);
    const currentIndex = variants.indexOf(selectedVariant);

    let newIndex;
    if (direction === 'prev') {
      newIndex = (currentIndex - 1 + variants.length) % variants.length;
    } else {
      newIndex = (currentIndex + 1) % variants.length;
    }

    const newVariant = variants[newIndex];
    setSelectedVariant(newVariant);
  };

  const changeProfile = (direction: 'prev' | 'next') => {
    const images = profiles.map((p) => p.image);
    const currentIndex = images.indexOf(selectedProfile);

    let newIndex;
    if (direction === 'prev') {
      newIndex = (currentIndex - 1 + images.length) % images.length;
    } else {
      newIndex = (currentIndex + 1) % images.length;
    }

    setSelectedProfile(images[newIndex]);
  };

  const contactForm = useForm({
    mode: "uncontrolled",
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      topic: "",
      message: "",
      terms: false,
    },
    validate: {
      firstName: (value) =>
        value.length < 2 ? t("contactForm.validations.name") : null,
      lastName: (value) =>
        value.length < 2 ? t("contactForm.validations.surname") : null,
      email: (value) =>
        !/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(value) ? t("contactForm.validations.email") : null,
      phone: (value) =>
        value.length < 9 ? t("contactForm.validations.phone") : null,
      topic: (value) =>
        value.length < 2 ? t("contactForm.validations.topic") : null,
      message: (value) =>
        value.length < 5 ? t("contactForm.validations.message") : null,
      terms: (value) =>
        value !== true ? t("contactForm.validations.terms") : null,
    },
  })

  const handleContactingForm = ({ firstName, lastName, email, phone, topic, message }: { firstName: string, lastName: string; email: string; phone: string; topic: string; message: string }) => {
    axios.post("/api/mail", {
      subject: "Kontaktní formulář",
      to: "info@quickpass.cz",
      type: "contact",
      data: { firstName, lastName, email, phone, topic, message },
     })
     .then(() => {
        contactForm.reset();
        alert(t("contact"));
     })
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash;
      if (hash) {
        const id = hash.replace("#", "");
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  }, []);

  return (
    <LandingWrapperStyled>
      <LandingIdentityWrapperStyled>
          <LandingIdentityTitleWrapperStyled>
            <h1>
              {t.rich("hero.title", {
                highlight: (chunks) => <span>{chunks}</span>
              })}
            </h1>
            <p>
              {t.rich("hero.subtitle", {
                highlight: (chunks) => <span>{chunks}</span>
              })}
            </p>
            <div>
              <Button onClick={() => router.push("/order")} variant={ButtonVariant.PRIMARY} size={ButtonSize.md} label={t("whyUs.orderNow")} />
              <Button onClick={() => router.push("/about")} variant={ButtonVariant.SECONDARY} size={ButtonSize.md} label={t("card.learnMore")} />
            </div>
          </LandingIdentityTitleWrapperStyled>
         <Image src="/images/landing_card.png" alt="Landing card image placeholder" width={400} height={300} />
      </LandingIdentityWrapperStyled>

      <LandingVideoWrapperStyled>
        <div>
          <ReactPlayer url="https://www.youtube.com/watch?v=6gjgGUo0I1c&t=53s&ab_channel=WillyCao" controls={true} />
          <LandingVideoTitleWrapperStyled>
            <h3>{t("whyUs.stepForward")}</h3>
            <h2>{t("whyUs.title")}</h2>
            <p>{t("whyUs.desc")}</p>
            <div>
              <span>{t("whyUs.features.fast")}</span>
              <span>{t("whyUs.features.eco")}</span>
              <span>{t("whyUs.features.modern")}</span>
              <span>{t("whyUs.features.upToDate")}</span>
            </div>
            <Button onClick={() => router.push("/order")} variant={ButtonVariant.PRIMARY} size={ButtonSize.md} label={t("whyUs.orderNow")} />
          </LandingVideoTitleWrapperStyled>
        </div>
        <LandingBenefitsWrapperStyled>
          <LandingBenefitWrapperStyled>
            <h3>{t("pros.onePlace.title")}</h3>
            <p>{t("pros.onePlace.desc")}</p>
          </LandingBenefitWrapperStyled>
          <LandingBenefitWrapperStyled>
            <h3>{t("pros.sharing.title")}</h3>
            <p>{t("pros.sharing.desc")}</p>
          </LandingBenefitWrapperStyled>
          <LandingBenefitWrapperStyled>
            <h3>{t("pros.style.title")}</h3>
            <p>{t("pros.style.desc")}</p>
          </LandingBenefitWrapperStyled>
        </LandingBenefitsWrapperStyled>
      </LandingVideoWrapperStyled>

      <LandingSolutionsWrapperStyled>
        <LandingSolutionMaskStyled />
        <LandingSolutionTitleWrapperStyled>
          <h4>{t("ourSolution.subtitle")}</h4>
          <h3>{t("ourSolution.title")}</h3>
          <span>{t("ourSolution.desc")}</span>
        </LandingSolutionTitleWrapperStyled>
        <LandingSolutionWrapperStyled>
          <LandingSolutionStyled>{t("ourSolution.features.eco")}</LandingSolutionStyled>
          <LandingSolutionStyled>{t("ourSolution.features.digital")}</LandingSolutionStyled>
          <LandingSolutionStyled>{t("ourSolution.features.practical")}</LandingSolutionStyled>
          <LandingSolutionStyled>{t("ourSolution.features.modern")}</LandingSolutionStyled>
        </LandingSolutionWrapperStyled>
      </LandingSolutionsWrapperStyled>

      <LandingAdaptWrapperStyled>
        <LandingTitleWrapperStyled>
          <div>
            <h4>{t("card.title")}</h4>
            <h3>{t("card.subtitle")}</h3>
            <p>{t("card.desc")}</p>
          </div>
          <LandingTitleWrapWrapperStyled>
            <div>
              <h3>{t("card.premium.title")}</h3>
              <p>{t("card.premium.desc")}</p>
            </div>
            <div>
              <h3>{t("card.sharing.title")}</h3>
              <p>{t("card.sharing.desc")}</p>
            </div>
          </LandingTitleWrapWrapperStyled>
          <LandingTitleButtonWrapperStyled>
            <Button onClick={() => router.push("/about")} variant={ButtonVariant.SECONDARY} size={ButtonSize.sm} label={t("card.learnMore")} />
            <Button onClick={() => router.push("/register")} variant={ButtonVariant.LIGHT} size={ButtonSize.sm} label={t("card.register")} rightSection={<FontAwesomeIcon icon={faChevronRight} />} />
          </LandingTitleButtonWrapperStyled>
        </LandingTitleWrapperStyled>
        <LandingAdaptEditorWrapperStyled>
          <Image src={`/images/${selectedVariant}.png`} alt={`image of ${selectedVariant} card`} width={400} height={280} />
          <EditorVariantControlsStyled>
            <FontAwesomeIcon onClick={() => changeCardVariant("prev")} icon={faChevronCircleLeft} size="2xl" />
            <EditorVariantIndicatorWrapperStyled>
              {Object.entries(CardVariantEnum).map(([key, value]) => (
                <EditorVariantIndicatorStyled key={`${key}-indicator`} $selected={value === selectedVariant} />
              ))}
            </EditorVariantIndicatorWrapperStyled>
            <FontAwesomeIcon onClick={() => changeCardVariant("next")} icon={faChevronCircleRight} size="2xl" />
          </EditorVariantControlsStyled>
          <Button onClick={() => router.push("/editor")} variant={ButtonVariant.PRIMARY} size={ButtonSize.md} label={t("card.openEditor")} rightSection={<FontAwesomeIcon icon={faRightFromBracket} />} />
        </LandingAdaptEditorWrapperStyled>
      </LandingAdaptWrapperStyled>

      <LandingNFCWrapperStyled>
        <h3>{t("nfc.title")}</h3>
        <p>{t("nfc.desc")}</p>
        <div>
          <Button onClick={() => router.push("/order")} variant={ButtonVariant.PRIMARY} size={ButtonSize.md} label={t("nfc.orderNow")} />
          <Button onClick={() => router.push("/about")} variant={ButtonVariant.SECONDARY} size={ButtonSize.md} label={t("nfc.learnMore")} />
        </div>
      </LandingNFCWrapperStyled>

      <LandingReviewWrapperStyled>
        <LandingProfileWrapperStyled>
          <Image src="/images/big_logo.png" alt="big logo" height={28} width={162} />
          {profile && (
            <>
              <h3>{profile.desc}</h3>
              <Image src={profile.image} alt={`Profile image of ${profile.name}`} width={64} height={64} />
              <h4>{profile.name}</h4>
              <p>{profile.title}</p>
            </>
          )}
        </LandingProfileWrapperStyled>
        <EditorVariantControlsStyled>
            <FontAwesomeIcon onClick={() => changeProfile("prev")} icon={faChevronCircleLeft} size="2xl" />
            <EditorVariantIndicatorWrapperStyled>
              {profiles.map((profile) => (
                <EditorVariantIndicatorStyled key={`${profile.image}-indicator`} $selected={profile.image === selectedProfile} />
              ))}
            </EditorVariantIndicatorWrapperStyled>
            <FontAwesomeIcon onClick={() => changeProfile("next")} icon={faChevronCircleRight} size="2xl" />
          </EditorVariantControlsStyled>
      </LandingReviewWrapperStyled>

      <LandingFAQWrapperStyled>
        <LandingFAQTitleWrapperStyled>
          <h2>{t("faq.title")}</h2>
          <span>{t("faq.desc")}</span>
        </LandingFAQTitleWrapperStyled>
        <LandingFAQQuestionsWrapperStyled>
            {questions.map((question) => (
              <QuestionDrawer key={question} question={question} />
            ))}
        </LandingFAQQuestionsWrapperStyled>
        <LandingFAQFooterWrapperStyled>
          <h3>{t("faq.moreQuestions")}</h3>
          <span>{t("faq.help")}</span>
          <div>
            <Button onClick={() => router.push("/#contact")} variant={ButtonVariant.SECONDARY} size={ButtonSize.sm} label={t("faq.contact")} />
            <Button onClick={() => router.push("/faq")} variant={ButtonVariant.LIGHT} size={ButtonSize.sm} label={t("faq.takeALook")} />
          </div>
        </LandingFAQFooterWrapperStyled>
      </LandingFAQWrapperStyled>

      <LandingContactFormStyled onSubmit={contactForm.onSubmit(handleContactingForm)} id="contact">
        <LandingContactTitleWrapperStyled>
          <h2>{t("contactForm.title")}</h2>
          <span>{t("contactForm.desc")}</span>
        </LandingContactTitleWrapperStyled>
        <LandingContactRowWrapperStyled>
          <TextInput
            label={t("contactForm.name")}
            placeholder={t("contactForm.enterName")}
            key={contactForm.key("firstName")}
            {...contactForm.getInputProps("firstName")}
          />
          <TextInput
            label={t("contactForm.surname")}
            placeholder={t("contactForm.enterSurname")}
            key={contactForm.key("lastName")}
            {...contactForm.getInputProps("lastName")}
          />
        </LandingContactRowWrapperStyled>
        <LandingContactRowWrapperStyled>
          <TextInput
            label={t("contactForm.email")}
            placeholder={t("contactForm.enterEmail")}
            key={contactForm.key("email")}
            {...contactForm.getInputProps("email")}
          />
          <TextInput
            label={t("contactForm.phone")}
            placeholder={t("contactForm.enterPhone")}
            key={contactForm.key("phone")}
            {...contactForm.getInputProps("phone")}
          />
        </LandingContactRowWrapperStyled>
        <Select
          label={t("contactForm.topic")}
          placeholder={t("contactForm.enterTopic")}
          data={topics.map((topic) => ({ value: topic, label: t(`contactForm.topics.${topic}`) }))}
          key={contactForm.key("topic")}
          {...contactForm.getInputProps("topic")}
        />
        <Textarea
          resize="vertical"
          label={t("contactForm.message")}
          placeholder={t("contactForm.enterMessage")}
          key={contactForm.key("message")}
          {...contactForm.getInputProps("message")}
        />
        <Checkbox
          label={t("contactForm.terms")}
          key={contactForm.key("terms")}
          {...contactForm.getInputProps("terms", { type: "checkbox" })}
          mt="md"
        />
        <Button variant={ButtonVariant.PRIMARY} size={ButtonSize.md} label={t("contactForm.submit")} type="submit" />
      </LandingContactFormStyled>
    </LandingWrapperStyled>
  );
};

const QuestionDrawer = ({ question }: { question: string }) => {
  const t = useTranslations("Landing.faq.questions")
  const [opened, { toggle }] = useDisclosure(false);

  return (
    <div>
        <div>
          <h4>{t(`${question}.question`)}</h4>
          <div onClick={toggle}>
            <FontAwesomeIcon icon={opened ? faChevronUp : faChevronDown} />
          </div>
        </div>
        <Collapse in={opened}>
          <p>{t(`${question}.answer`)}</p>
        </Collapse>
    </div>
  )
}
