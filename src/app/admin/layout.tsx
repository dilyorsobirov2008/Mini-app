import React from 'react';
import Link from 'next/link';
import { headers } from 'next/headers';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const heads = await headers();
  const pathname = heads.get('x-pathname') || '';
  const isLoginPage = pathname.includes('/admin/login');

  return (
    <div className="flex min-h-screen bg-gray-900 text-white font-sans">
      {!isLoginPage && (
        <aside className="w-64 bg-gray-800 border-r border-gray-700 hidden md:block">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-blue-400">Bozorcha Admin</h1>
          </div>
          <nav className="mt-6 px-4 space-y-2">
            <Link href="/admin" className="block px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors">
              🏠 Dashboard
            </Link>
            <Link href="/admin/products" className="block px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors">
              📦 Mahsulotlar
            </Link>
            <Link href="/admin/categories" className="block px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors">
              📂 Kategoriyalar
            </Link>
          </nav>
        </aside>
      )}

      <main className={`flex-1 ${!isLoginPage ? 'p-8' : ''}`}>
        {children}
      </main>
    </div>
  );
}
