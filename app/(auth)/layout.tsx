import { AutoSiteFooter } from "@/components/site-footer";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-ink text-white">
      <div className="flex flex-1 flex-col">{children}</div>
      <AutoSiteFooter />
    </div>
  );
}
