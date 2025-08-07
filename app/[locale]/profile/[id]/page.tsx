"use client"

import { useParams } from "next/navigation";
import useSWR from "swr";
import { fetcher } from "@/utils/fetcher";
import { Loader } from "@mantine/core";
import { DigitalProfile } from "@/components/DigitalProfile/DigitalProfile";

export default function IdProfilePage() {
  const params = useParams()
  const { id } = params;
  const { data, error, isLoading } = useSWR(`/api/profile?id=${id}`, fetcher);
  const profile = data?.profile

  if (isLoading) return <Loader />
  if (error) return <div>Chyba při načítání profilu</div>
  if (!profile) return <div>Profil nebyl nalezen</div>

  return <DigitalProfile profile={profile} />
}