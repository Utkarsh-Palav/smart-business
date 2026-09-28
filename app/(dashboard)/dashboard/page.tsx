export default function DashboardPage() {
  return (
    <div className="p-6 md:p-8">
      <div className="mx-auto max-w-7xl">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Dashboard
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage your businesses, locations, and review cards.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border bg-card p-5">
            <p className="text-sm text-muted-foreground">
              Businesses
            </p>

            <p className="mt-2 text-3xl font-semibold">
              0
            </p>
          </div>

          <div className="rounded-xl border bg-card p-5">
            <p className="text-sm text-muted-foreground">
              Locations
            </p>

            <p className="mt-2 text-3xl font-semibold">
              0
            </p>
          </div>

          <div className="rounded-xl border bg-card p-5">
            <p className="text-sm text-muted-foreground">
              Review Cards
            </p>

            <p className="mt-2 text-3xl font-semibold">
              0
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}