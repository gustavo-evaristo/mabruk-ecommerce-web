import { SiteHeader } from '@/components/layout/site-header';
import { Footer } from '@/components/layout/footer';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main className="flex flex-1 items-center justify-center bg-paper px-6 py-16">
        {children}
      </main>
      <Footer />
    </>
  );
}
