import { PasswordInput, Title } from "@mantine/core";
import { Desc, ResetControls, ResetForm } from "./ResetPassword.style"
import { useForm } from "@mantine/form";
import { Button, ButtonSize, ButtonVariant } from "../Button";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import axios from "axios";

export const ResetPassword = () => {
    const [loading, setLoading] = useState(false);
    const t = useTranslations("Reset")
    const router = useRouter();
    const searchParams = useSearchParams();
    const code = searchParams.get("code");
    const email = searchParams.get("email");

    const newPasswordForm = useForm({
        mode: 'uncontrolled',
        initialValues: { password: '', confirmPassword: '' },
        validate: {
          password: (value) => (value.length < 5 ? t("validation.password") : null),
          confirmPassword: (value, values) => (value !== values.password ? t("validation.confirmPassword") : null),
        },
    })

    const reset = async ({ password }: { password: string }) => {
        setLoading(true);
        await axios.post('/api/reset', { password, code, email })
            .then(({ data }) => {
                newPasswordForm.reset();
                router.push('/login');
                alert(t("success"));
            })
            .catch(() => {
                newPasswordForm.setFieldError("password", t("validation.error"))
            });
        setLoading(false);
    }

    return (
        <ResetForm onSubmit={newPasswordForm.onSubmit(reset)}>
            <Title order={1} mb="md">{t("title")}</Title>
            <Desc>{t("desc")}</Desc>
            <PasswordInput
                key={newPasswordForm.key('password')}
                name="password"
                label={t("newPassword")}
                placeholder={t("newPassword")}
                {...newPasswordForm.getInputProps('password')}
            />
            <PasswordInput
                key={newPasswordForm.key('confirmPassword')}
                name="confirmPassword"
                label={t("confirmPassword")}
                placeholder={t("confirmPassword")}
                {...newPasswordForm.getInputProps('confirmPassword')}
            />
            <ResetControls>
                <Link href="/login">{t("account2")}</Link>
            </ResetControls>
            <Button loading={loading} type="submit" label={t("reset")} size={ButtonSize.md} variant={ButtonVariant.PRIMARY} />
        </ResetForm>
    )
}