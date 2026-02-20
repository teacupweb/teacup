import Inbox from '@/Dashboard/Inbox';

export default async function InboxPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  console.log(id);
  return <Inbox id={id} />;
}
