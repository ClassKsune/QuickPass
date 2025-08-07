import { Checkbox, PasswordInput, TextInput, Title } from "@mantine/core";
import { RegisterControls, RegisterForm, NotOwnedAccount, NameWrapper, Description } from "./Register.style"
import { useForm } from "@mantine/form";
import { Button, ButtonSize, ButtonVariant } from "../Button";
import Link from "next/link";
import axios from "axios";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { useMemo, useState } from "react";

export const Register = () => {
    const { data: session } = useSession();
    const user = useMemo(() => session?.user, [session]);
    const [loading, setLoading] = useState(false);
    const t = useTranslations("Register")
    const router = useRouter();

    const registerForm = useForm({
        mode: 'uncontrolled',
        initialValues: { name: '', surname: '', email: '', password: '', terms: false, personalData: false },

        validate: {
          name: (value) => (value.length < 3 ? t("validation.name") : null),
          surname: (value) => (value.length < 4 ? t("validation.surname") : null),
          email: (value) => (/^\S+@\S+$/.test(value) ? null : t("validation.email")),
          password: (value) => (value.length < 5 ? t("validation.password") : null),
          terms: (value) => (value ? null : t("validation.terms")),
          personalData: (value) => (value ? null : t("validation.personalData")),
        },
    })

    const register = async ({ email, password, name, surname }: { email: string, password: string, name: string, surname: string }) => {
        setLoading(true);
        await axios.put('/api/account', { email, password, name, surname })
            .then(({ data }) => {
                if (data.success) {
                    registerForm.reset();
                    router.push('/login');
                }
            })
        setLoading(false);
    }

    if (user) {
        return <span>{t("alreadyRegistered")}</span>
    }

    return (
        <RegisterForm onSubmit={registerForm.onSubmit(register)}>
            <Title order={1} mb="md">{t("title")}</Title>
            <Description>{t("desc")}</Description>
            <NameWrapper>
                <TextInput
                    key={registerForm.key('name')}
                    name="firstname"
                    label={t("name")}
                    placeholder={t("name")}
                    autoComplete="given-name"
                    {...registerForm.getInputProps('name')}
                />
                <TextInput
                    key={registerForm.key('surname')}
                    name="lastname"
                    label={t("surname")}
                    placeholder={t("surname")}
                    autoComplete="family-name"
                    {...registerForm.getInputProps('surname')}
                />
            </NameWrapper>
            <TextInput
                key={registerForm.key('email')}
                type="email"
                name="email"
                label={t("email")}
                placeholder={t("email")}
                autoComplete="email"
                {...registerForm.getInputProps('email')}
            />
            <PasswordInput
                mt="sm"
                mb="sm"
                name="newpassword"
                key={registerForm.key('password')}
                label={t("password")}
                placeholder={t("password")}
                autoComplete="new-password"
                {...registerForm.getInputProps('password')}
            />
            <RegisterControls>
                <Checkbox label={t("terms")} {...registerForm.getInputProps('terms', { type: 'checkbox' })} />
                <Checkbox label={t("personalData")} {...registerForm.getInputProps('personalData', { type: 'checkbox' })} />
            </RegisterControls>
            <Button loading={loading} type="submit" label={t("register")} size={ButtonSize.md} variant={ButtonVariant.PRIMARY} />
            <NotOwnedAccount>{t("account1")}<Link href="/login">{t("account2")}</Link></NotOwnedAccount>
        </RegisterForm>
    )
}