'use client';

import { Orders } from '@/components/Orders/Orders';
import { useSession } from 'next-auth/react';
import { useMemo } from 'react';

export default function OrdersPage() {
  const { data: session } = useSession();
  const user = useMemo(() => session?.user, [session]);

  if (!user?.rights.includes('admin')) return <>Not authorized to access.</>
  return <Orders />;
}
