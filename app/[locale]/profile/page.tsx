'use client';

import { Profile } from "@/components/Profile/Profile";
import useSWR from "swr";
import { fetcher } from "@/utils/fetcher";
import { Loader } from "@mantine/core";

export default function ProfilePage() {
  const { data, error, isLoading } = useSWR(`/api/profile?myAccount=true`, fetcher);
  const profile = data?.profile

  if (isLoading) return <Loader />
  if (error && error.status !== 401) return <div>Chyba při načítání profilu</div>
  if (!profile) return <div>Profil nebyl nalezen</div>

  return <Profile profile={profile} />;
}
