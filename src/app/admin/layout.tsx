// app/admin/layout.tsx
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth'; 
import { redirect } from 'next/navigation';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side protection: Check if the user is an admin
  const session = await getServerSession(authOptions);
  
  // ตรวจสอบว่าผู้ใช้ล็อกอินอยู่และมี role เป็น admin
  if (!session?.user || session.user.role !== 'admin') {
    redirect('/');
  }

  return (
    <div className="admin-layout">
      {/* Admin navbar could be added here */}
      <main>{children}</main>
    </div>
  );
}