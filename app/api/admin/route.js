export const metadata = {
  title: 'Admin Dashboard',
};

export default function AdminDashboardPage() {
  // In a real app, replace this with actual user/auth data
  const currentUser = {
    name: 'Admin User',
    role: 'admin',
    email: 'admin@example.com',
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <header>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-sm text-gray-600">
          Signed in as {currentUser.name} ({currentUser.role})
        </p>
      </header>

      <section className="border rounded-lg p-4 space-y-2">
        <h2 className="text-lg font-semibold">User Info</h2>
        <div className="text-sm space-y-1">
          <p><span className="font-medium">Name:</span> {currentUser.name}</p>
          <p><span className="font-medium">Email:</span> {currentUser.email}</p>
          <p><span className="font-medium">Role:</span> {currentUser.role}</p>
        </div>
      </section>

      <section className="border rounded-lg p-4 space-y-3">
        <h2 className="text-lg font-semibold">Management</h2>
        <ul className="list-disc list-inside text-sm space-y-1">
          <li>
            <a
              href="/admin/booking-management"
              className="text-blue-600 underline"
            >
              Go to Booking Management
            </a>
          </li>
        </ul>
      </section>
    </main>
  );
}