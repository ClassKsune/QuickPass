import { useMemo, useState } from 'react';
import axios from 'axios';
import { mutate } from 'swr';
import { ProfileState } from '@/types/Profile';
import { ProfileAndDigitalWrapperStyled, ProfileWrapper, ProfileWrapperStyled, SocialsAndLinksWrapperStyled } from './Profile.style';
import { Socials } from './Socials';
import { Videos } from './Videos';
import { Links } from './Links';
import { User } from './User';
import { DigitalProfile } from '../DigitalProfile/DigitalProfile';
import { Button, ButtonSize, ButtonVariant } from '../Button';
import { useTranslations } from 'next-intl';
import { HexColorPicker } from "react-colorful";



export const Profile = ({ profile }: { profile: ProfileState }) => {
  const t = useTranslations("Profile");
  const [socials, setSocials] = useState(profile.socials);
  const [videos, setVideos] = useState(profile.videos);
  const [links, setLinks] = useState(profile.links);
  const [user, setUser] = useState(profile);
  const [accentColor, setColor] = useState(profile.accentColor);

  const digitalProfile = useMemo(() => ({ ...user, socials, videos, links, accentColor}), [socials, videos, links, user, accentColor])


  const handleSave = () => {
    axios.post('/api/profile', { newProfile: { ...user, socials, videos, links, accentColor } })
      .then(() => mutate('/api/profile?myAccount=true'))
      .catch(err => console.error("Save error:", err));
  };
// <HexColorPicker color={accentColor} onChange={setColor} />
  return (
    <ProfileWrapper>
      <ProfileAndDigitalWrapperStyled>
        <ProfileWrapperStyled className="test">

          <User profile={user} setProfile={setUser} />
          <h2>{t("optional")} <span>({t("info")})</span></h2>
          
          <SocialsAndLinksWrapperStyled>
            <div>
              <h3>{t("social")}</h3>
              <Socials data={socials} setData={setSocials} />
            </div>
            <div>
              <h3>{t("link")}</h3>
              <Links data={links} setData={setLinks} />
            </div>
            <div>
              <h3>{t("video")}</h3>
              <Videos data={videos} setData={setVideos} />
            </div>
          </SocialsAndLinksWrapperStyled>
        </ProfileWrapperStyled>
        <DigitalProfile profile={digitalProfile} />
      </ProfileAndDigitalWrapperStyled>
      <Button variant={ButtonVariant.SUCCESS} size={ButtonSize.lg} label={t("save")} onClick={handleSave} />


    </ProfileWrapper>
  )
};
