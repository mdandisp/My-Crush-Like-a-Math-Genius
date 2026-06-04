import { redirect } from 'next/navigation';

export default async function TopicDetailRedirect({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  // Redirect to edit page by default
  redirect(`/admin/topics/edit?id=${resolvedParams.id}`);
}
