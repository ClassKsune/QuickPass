import { ProfileState } from "@/types/Profile";
import { BorderRadius, Colors, Spacing } from "@/utils";
import { Textarea, TextInput, Button } from "@mantine/core";
import styled from "styled-components";
import { UploadButtonWithLabel } from "./UploadButtonWithLabel";
import { useTranslations } from "next-intl";

interface ProfileProps {
    profile: ProfileState;
    setProfile: (data: ProfileState) => void;
}

export const User = ({ profile, setProfile }: ProfileProps) => {
    const t = useTranslations("Profile.user");

    const changeItem = (field: string, value: string | null) => {
        setProfile({ ...profile, [field]: value });
    };

    const handleAliasButtonClick = () => {
        
         try {
            navigator.clipboard.writeText(window.location.href + `/${profile.alias ?? profile.url}`);
            console.log("Text copied to clipboard!");
        } catch (err) {
            console.error("Failed to copy: ", err);
  }
    };

    return (
        <div>
            <h1>{t("setup")}</h1>
            <AliasWrapper>
                <TextInput
                    label={t("alias")}
                    placeholder={profile.url}
                    onChange={({ target }) =>
                        changeItem("alias", target.value.length > 0 ? target.value : null)
                    }
                    value={profile.alias ?? ""}
                    style={{ flex: 1 }}
                />
                <Button onClick={handleAliasButtonClick} style={{ marginLeft: "0.5rem", alignSelf: "flex-end" }}>
                    Share profile
                </Button>
            </AliasWrapper>

            <h2>
                {t("required")} <span>({t("info")})</span>
            </h2>
            <UserWrapperStyled>
                <UploadButtonWithLabel
                    label={t("image")}
                    onUpload={(res) => changeItem("image", res[0].url)}
                />
                <TextInput
                    onChange={({ target }) => changeItem("name", target.value)}
                    value={profile.name}
                    style={{ gridColumn: "span 1" }}
                    label={t("name")}
                />
                <TextInput
                    onChange={({ target }) => changeItem("surname", target.value)}
                    value={profile.surname}
                    style={{ gridColumn: "span 1" }}
                    label={t("surname")}
                />
                <TextInput
                    onChange={({ target }) => changeItem("country", target.value)}
                    value={profile.country ?? ""}
                    style={{ gridColumn: "1 / -1" }}
                    label={t("country")}
                />
                <TextInput
                    onChange={({ target }) => changeItem("city", target.value)}
                    value={profile.city ?? ""}
                    style={{ gridColumn: "1 / -1" }}
                    label={t("city")}
                />
                <Textarea
                    onChange={({ target }) => changeItem("bio", target.value)}
                    value={profile.bio ?? ""}
                    style={{ gridColumn: "1 / -1" }}
                    label={t("bio")}
                    resize="vertical"
                    maxLength={250}
                />
            </UserWrapperStyled>
        </div>
    );
};

const UserWrapperStyled = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto;
    padding: ${Spacing.sm} ${Spacing.lg} ${Spacing.md} ${Spacing.lg};
    border: 1px solid ${Colors.black};
    border-radius: ${BorderRadius.md};
    row-gap: ${Spacing.xs};
    column-gap: ${Spacing.md};

    button {
        text-align: center;
    }

    & > div:first-child {
        grid-column: 1 / -1;
        text-align: center;
    }
`;

const AliasWrapper = styled.div`
    display: flex;
    align-items: flex-end;
    margin-bottom: ${Spacing.sm};

    .mantine-TextInput-root {
        flex: 1;
    }
`;
