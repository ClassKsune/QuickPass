import { TextInput, Title } from "@mantine/core";
import { Desc, ForgotControls, ForgotForm } from "./Forgot.style"
import { useForm } from "@mantine/form";
import { Button, ButtonSize, ButtonVariant } from "../Button";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import Link from "next/link";
import axios from "axios";

export const Forgot = () => {
    const { data: session } = useSession();
    const user = useMemo(() => session?.user, [session]);
    const [loading, setLoading] = useState(false);
    const t = useTranslations("Login")
    const router = useRouter();

    const forgotForm = useForm({
        mode: 'uncontrolled',
        initialValues: { email: '' },
        validate: {
          email: (value) => (/^\S+@\S+$/.test(value) ? null : t("validation.email")),
        },
    })

    const forgot = async ({ email }: { email: string }) => {
        setLoading(true);
        await axios.post('/api/forgot', { email })
            .then(({ data }) => {
                forgotForm.reset();
                router.push('/forgot');
                alert(t("emailSent"));
            })
            .catch(() => {
                forgotForm.setFieldError("email", t("validation.error"))
            });
        setLoading(false);
    }

    if (user) {
        return <span>{t("alreadyLogged")}</span>
    }

    return (
        <ForgotForm onSubmit={forgotForm.onSubmit(forgot)}>
            <Title order={1} mb="md">{t("forgotTitle")}</Title>
            <Desc>{t("forgotDesc")}</Desc>
            <TextInput
                key={forgotForm.key('email')}
                type="email"
                name="email"
                label={t("email")}
                placeholder={t("email")}
                autoComplete="on"
                {...forgotForm.getInputProps('email')}
            />
            <ForgotControls>
                <Link href="/login">{t("account2")}</Link>
            </ForgotControls>
            <Button loading={loading} type="submit" label={t("sendEmail")} size={ButtonSize.md} variant={ButtonVariant.PRIMARY} />
        </ForgotForm>
    )
}