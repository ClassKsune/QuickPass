import { ProfileState } from "@/types/Profile";
import { BorderRadius, Colors, Spacing } from "@/utils";
import { Textarea, TextInput, Button } from "@mantine/core";
import styled from "styled-components";
import { UploadButtonWithLabel } from "./UploadButtonWithLabel";
import { useTranslations } from "next-intl";
import { faShare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { copyToClipboard } from "@/utils/clipboard";
import { useState } from "react";
import { Colorss } from "./Colors";
    import mongoose from 'mongoose';

interface ProfileProps {
    profile: ProfileState;
    setProfile: (data: ProfileState) => void;
}



export const User = ({ profile, setProfile }: ProfileProps) => {
    const t = useTranslations("Profile.user");
    const [copied, setCopied] = useState(false);


    
    const changeItem = (field: string, value: string | null) => {
        setProfile({ ...profile, [field]: value });
    };

    const handleAliasButtonClick = async () => {
        if (typeof window === 'undefined') return;
        
        const profileUrl = window.location.href.replace(/^https?:\/\//, '').replace(/^www\./, '') + `/${profile.alias ?? profile.url}`;
        const profileName = profile.name || 'Profile';
        
        const success = await copyToClipboard(profileUrl, {
            useWebShare: true
        });
        
        if (success) {
            console.log("Profile URL shared/copied successfully!");
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } else {
            console.log("Profile URL copy operation completed (manual fallback may have been used)");
        }
    };

    return (
        <div style={{ position: "relative" }}>
            {copied && <Popup>{t("copyPopup")}</Popup>}

            <UserHeader>
                <h1>{t("setup")}</h1>
                <Button onClick={handleAliasButtonClick} style={{ marginLeft: "0.5rem", alignSelf: "flex-end" }}>
                    <span>{t("share")}</span>
                    <FontAwesomeIcon icon={faShare} />
                </Button>
            </UserHeader>
            
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
                    onChange={({ target }) => changeItem("telephone", target.value)}
                    value={profile.telephone ?? ""}
                    style={{ gridColumn: "span 1" }}
                    label={t("telephone")}
                    type="tel"
                />
                <TextInput
                    onChange={({ target }) => changeItem("email", target.value)}
                    value={profile.email ?? ""}
                    style={{ gridColumn: "span 1" }}
                    label={t("email")}
                    type="email"
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
                <TextInput
                    onChange={({ target }) => changeItem("company", target.value)}
                    value={profile.company ?? ""}
                    style={{ gridColumn: "span 1" }}
                    label={t("company")}
                />
                <TextInput
                    onChange={({ target }) => changeItem("position", target.value)}
                    value={profile.position ?? ""}
                    style={{ gridColumn: "span 1" }}
                    label={t("position")}
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

const Popup = styled.div`
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${Colors.black};
    color: ${Colors.white};
    padding: 10px 15px;
    border-radius: ${BorderRadius.sm};
    box-shadow: 0 4px 6px rgba(0,0,0,0.2);
    animation: fadein 0.3s ease, fadeout 0.3s ease 1.7s;
    z-index: 9999;

    @keyframes fadein {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }

    @keyframes fadeout {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(-10px); }
    }
`;

const UserWrapperStyled = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
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

    @media (max-width: 480px) {
        padding: ${Spacing.sm};
    }
`;

const AliasWrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    margin-bottom: ${Spacing.sm};
    gap: ${Spacing.sm};

    .mantine-TextInput-root {
        flex: 1;
    }

    @media (max-width: 600px) {
        flex-direction: column;
        align-items: stretch;

        button {
            width: 100%;
        }
    }
`;

const UserHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: ${Spacing.sm};
    flex-wrap: wrap;
    gap: ${Spacing.sm};

    h1 {
        margin: 0;
        font-size: 24px;
        font-weight: 700;
    }

    button {
        background-color: ${Colors.white};
        border: 2px solid ${Colors.black};
        transition: background-color 0.3s ease;

        &:hover {
            background-color: ${Colors.white};
        }
    }

    span {
        gap: ${Spacing.sm};
        color: ${Colors.black};
        font-weight: 700;
    }

    @media (max-width: 480px) {
        flex-direction: column;
        align-items: flex-start;

        button {
            align-self: stretch;
            width: 100%;
        }
    }
`;
