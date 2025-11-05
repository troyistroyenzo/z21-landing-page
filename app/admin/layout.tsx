import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard | Z21',
  description: 'Admin dashboard for Z21',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-950">
      {children}
    </div>
  );
}
