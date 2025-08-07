import { Checkbox, PasswordInput, TextInput, Title } from "@mantine/core";
import { Desc, LoginControls, LoginForm, NotOwnedAccount } from "./Login.style"
import { useForm } from "@mantine/form";
import { Button, ButtonSize, ButtonVariant } from "../Button";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

export const Login = () => {
    const { data: session } = useSession();
    const user = useMemo(() => session?.user, [session]);
    const [loading, setLoading] = useState(false);
    const t = useTranslations("Login")
    const router = useRouter();

    const loginForm = useForm({
        mode: 'uncontrolled',
        initialValues: { email: '', password: '' },

        validate: {
          email: (value) => (/^\S+@\S+$/.test(value) ? null : t("validation.email")),
          password: (value) => (value.length < 5 ? t("validation.password") : null),
        },
    })

    const login = async ({ email, password }: { email: string, password: string }) => {
        setLoading(true);
        const response = await signIn('credentials', { email, password, redirect: false });
        if (response?.error) {
            loginForm.setFieldError("email", t("validation.error"))
            loginForm.setFieldError("password", t("validation.error"))
        } else {
            loginForm.reset();
            router.push('/');
        }
        setLoading(false);
    }

    if (user) {
        return <span>{t("alreadyLogged")}</span>
    }

    return (
        <LoginForm onSubmit={loginForm.onSubmit(login)}>
            <Title order={1} mb="md">{t("title")}</Title>
            <Desc>{t("desc")}</Desc>
            <TextInput
                key={loginForm.key('email')}
                type="email"
                name="email"
                label={t("email")}
                placeholder={t("email")}
                autoComplete="on"
                {...loginForm.getInputProps('email')}
            />
            <PasswordInput
                mt="sm"
                mb="sm"
                key={loginForm.key('password')}
                label={t("password")}
                name="password"
                placeholder={t("password")}
                autoComplete="current-password"
                {...loginForm.getInputProps('password')}
            />
            <LoginControls>
                <Checkbox label="Remember me" />
                <Link href="/forgot">{t("forgottenPassword")}</Link>
            </LoginControls>
            <Button loading={loading} type="submit" label={t("login")} size={ButtonSize.md} variant={ButtonVariant.PRIMARY} />
            <NotOwnedAccount>{t("noAccount1")}<Link href="/register">{t("noAccount2")}</Link></NotOwnedAccount>
        </LoginForm>
    )
}