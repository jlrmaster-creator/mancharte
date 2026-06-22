import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';

export function Layout() {
  return (
    <div className="min-h-dvh flex">
      <Sidebar />
      <main className="flex-1 md:ml-64 pb-20 md:pb-0 min-h-dvh">
        <div className="max-w-5xl mx-auto px-4 py-6 md:py-8">
          <Outlet />
        </div>
      </main>
      <MobileNav />
    </div>
  );
}
