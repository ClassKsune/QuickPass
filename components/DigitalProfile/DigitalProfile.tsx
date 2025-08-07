import { ProfileState } from "@/types/Profile";
import { DigitalVideosWrapperStyled, DigitalProfileBioStyled, DigitalProfileJobInfoStyled, DigitalProfileContentStyled, DigitalProfileImage, DigitalProfileImageWrapper, DigitalProfileTitleWrapperStyled, DigitalProfileWrapperStyled, DigitalLinkWrapperStyled, DigitalLinksWrapperStyled, DigitalProfileSocialsStyled, DigitalProfileSocialStyled } from "./DigitalProfile.style";
import Image from "next/image";
import ReactPlayer from 'react-player/youtube'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faShare, faCopy, faHeart } from "@fortawesome/free-solid-svg-icons";
import { Colors } from "@/utils";
import { SocialMediaIcon } from "./SocialMediaIcon";
import { useState, useRef, useEffect } from "react";
import { copyToClipboard } from "@/utils/clipboard";

export const DigitalProfile = ({ profile }: { profile: ProfileState }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const handleShare = async () => {
        if (typeof window === 'undefined') return;
        
        const profileUrl = `${window.location.origin}/profile/${profile.alias ?? profile.url}`;
        const profileName = profile.name || 'Profile';
        
        const success = await copyToClipboard(profileUrl, {
            useWebShare: true,
            shareTitle: `${profileName} - QuickPass Profile`,
            shareText: `Check out ${profileName}'s profile on QuickPass`,
            fallbackMessage: "Copy this profile link:"
        });
        
        if (success) {
            console.log("Profile URL shared/copied successfully!");
        } else {
            console.log("Profile URL copy operation completed (manual fallback may have been used)");
        }
        
        setIsMenuOpen(false); // Close menu after action
    };

    const handleMenuToggle = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleSaveProfile = () => {
        console.log("Save profile functionality");
        setIsMenuOpen(false);
    };

    const handleCopyLink = async () => {
        if (typeof window === 'undefined') return;
        
        const profileUrl = `${window.location.origin}/profile/${profile.alias ?? profile.url}`;
        
        const success = await copyToClipboard(profileUrl, {
            useWebShare: false, // Force clipboard copy instead of share dialog
            fallbackMessage: "Copy this profile link:"
        });
        
        if (success) {
            console.log("Profile link copied to clipboard!");
        } else {
            console.log("Profile link copy operation completed (manual fallback may have been used)");
        }
        
        setIsMenuOpen(false);
    };

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };

        if (isMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMenuOpen]);

    return (
        <DigitalProfileWrapperStyled>
            <DigitalProfileImageWrapper>
                <DigitalProfileImage $set={!!profile.image} priority src={profile.image || '/images/image_placeholder.svg'} alt="Profile picture" width={400} height={400} />
                <div className="menu-container" ref={menuRef}>
                    <button className="menu-button-overlay" onClick={handleMenuToggle}>
                        <span className="dots-icon">⋯</span>
                    </button>
                    {isMenuOpen && (
                        <div className="dropdown-menu">
                            <button className="menu-item" onClick={handleShare}>
                                <FontAwesomeIcon icon={faShare} />
                                <span>Share</span>
                            </button>
                        </div>
                    )}
                </div>
            </DigitalProfileImageWrapper>
            <DigitalProfileContentStyled>
                <DigitalProfileTitleWrapperStyled>
                    <h2>{`${profile.name} ${profile.surname}`}</h2>
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
                         <DigitalProfileJobInfoStyled>
                            {profile.position && profile.company && (
                            <h4>{`${profile.position}, ${profile.company}`}</h4>
                        )}
                        {profile.position && !profile.company && (
                            <h4>{profile.position}</h4>
                        )}
                        {!profile.position && profile.company && (
                            <h4>{profile.company}</h4>
                        )}
                        </DigitalProfileJobInfoStyled>
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