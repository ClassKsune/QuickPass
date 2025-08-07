export interface SocialState {
    _id: string;
    url: string;
  }

  export interface LinkState {
    _id: string;
    name: string;
    description: string;
    url: string;
    iconUrl: string;
  }

  export interface VideoState {
    _id: string;
    url: string;
  }

  export interface ProfileState {
    accountId: string;
    url: string;
    alias: string | null;
    image: string | null;
    name: string;
    surname: string;
    country: string | null;
    city: string | null;
    bio: string | null;
    company: string | null;
    position: string | null;
    telephone: string | null;
    email: string | null;
    socials: SocialState[];
    links: LinkState[];
    videos: VideoState[];
    createdAt: string;
    updatedAt: string;
  }