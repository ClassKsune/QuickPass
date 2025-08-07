import { ProfileState } from "@/types/Profile";
import { DigitalVideosWrapperStyled, DigitalProfileBioStyled, DigitalProfileContentStyled, DigitalProfileImage, DigitalProfileImageWrapper, DigitalProfileTitleWrapperStyled, DigitalProfileWrapperStyled, DigitalLinkWrapperStyled, DigitalLinksWrapperStyled, DigitalProfileSocialsStyled, DigitalProfileSocialStyled } from "./DigitalProfile.style";
import Image from "next/image";
import ReactPlayer from 'react-player/youtube'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faShare } from "@fortawesome/free-solid-svg-icons";
import { Colors } from "@/utils";
import { SocialMediaIcon } from "./SocialMediaIcon";

export const DigitalProfile = ({ profile }: { profile: ProfileState }) => {
    const handleShare = () => {
        if (typeof window === 'undefined') return;
        
        try {
            const profileUrl = `${window.location.origin}/profile/${profile.alias ?? profile.url}`;
            navigator.clipboard.writeText(profileUrl);
            // You could add a toast notification here if needed
            console.log("Profile URL copied to clipboard!");
        } catch (err) {
            console.error("Failed to copy profile URL: ", err);
        }
    };

    return (
        <DigitalProfileWrapperStyled>
            <DigitalProfileImageWrapper>
                <DigitalProfileImage $set={!!profile.image} priority src={profile.image || '/images/image_placeholder.svg'} alt="Profile picture" width={400} height={400} />
            </DigitalProfileImageWrapper>
            <DigitalProfileContentStyled>
                <DigitalProfileTitleWrapperStyled>
                    <div className="name-share-wrapper">
                        <h2>{`${profile.name} ${profile.surname}`}</h2>
                        <button className="share-button" onClick={handleShare} title="Share profile">
                            <FontAwesomeIcon icon={faShare} size="sm" />
                        </button>
                    </div>
                    {profile.country && profile.city && (
                        <div className="location-wrapper">
                            <FontAwesomeIcon icon={faMapMarkerAlt} size="lg" color={Colors.error} />
                            <h3>{`${profile.country}, ${profile.city}`}</h3>
                        </div>
                    )}
                </DigitalProfileTitleWrapperStyled>
                {profile.socials.length > 0 && (
                    <DigitalProfileSocialsStyled>
                        {profile.socials.map((social) => (
                            <DigitalProfileSocialStyled key={social._id} href={social.url} target="_blank">
                                <SocialMediaIcon url={social.url} />
                            </DigitalProfileSocialStyled>
                        ))}
                    </DigitalProfileSocialsStyled>
                )}
                {profile.bio && (
                    <DigitalProfileBioStyled>
                        <p>{profile.bio}</p>
                    </DigitalProfileBioStyled>
                )}
                {profile.links.length > 0 && (
                    <DigitalLinksWrapperStyled>
                        {profile.links.map((link) => (
                            <DigitalLinkWrapperStyled key={link._id} href={link.url} target="_blank">
                                {link.iconUrl && <Image src={link.iconUrl} alt={`Picture of link - ${link.name}`} width={32} height={32} />}
                                <h4>
                                    {link.name} |
                                    <span> {link.description}</span>
                                </h4>
                            </DigitalLinkWrapperStyled>
                        ))}
                    </DigitalLinksWrapperStyled>
                )}
                {profile.videos.length > 0 && (
                    <DigitalVideosWrapperStyled>
                        {profile.videos.map((video) => (
                            <ReactPlayer
                                key={video._id}
                                url={video.url}
                                controls={true}
                            />
                        ))}
                    </DigitalVideosWrapperStyled>
                )}
            </DigitalProfileContentStyled>
        </DigitalProfileWrapperStyled>
    )
}