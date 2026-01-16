"use client";

import Inbox from '@/Dashboard/Inbox';
import { use } from 'react';

export default function InboxPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <Inbox />;
}
