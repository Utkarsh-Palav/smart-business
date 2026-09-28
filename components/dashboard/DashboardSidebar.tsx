import Link from "next/link";

export function DashboardSidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r bg-card md:block">
      <div className="flex h-16 items-center border-b px-6">
        <Link
          href="/dashboard"
          className="text-lg font-semibold tracking-tight"
        >
          Smart Business
        </Link>
      </div>

      <nav className="space-y-1 p-4">
        <Link
          href="/dashboard"
          className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
        >
          Overview
        </Link>

        <Link
          href="/dashboard/businesses"
          className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
        >
          Businesses
        </Link>

        <Link
          href="/dashboard/locations"
          className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
        >
          Locations
        </Link>

        <Link
          href="/dashboard/review-cards"
          className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
        >
          Review Cards
        </Link>
      </nav>
    </aside>
  );
}