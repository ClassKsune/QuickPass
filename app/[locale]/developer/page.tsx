'use client';

import { useSession } from 'next-auth/react';
import { useMemo } from 'react';
import DeveloperPage from '@/components/developer/developer';

export default function UpdateDatabasePage() {
  const { data: session } = useSession();
  const user = useMemo(() => session?.user, [session]);

  if (!user?.rights.includes('admin')) {
    return <div>Not authorized to access.</div>;
  }

  return <DeveloperPage />;
}
