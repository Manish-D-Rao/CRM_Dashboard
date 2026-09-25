function Sidebar() {
  return (
    <aside className="w-64 border-r border-gray-200 bg-white">
      <div className="flex h-16 items-center border-b px-6">
        <h1 className="text-xl font-bold text-gray-900">
          CRM
        </h1>
      </div>

      <nav className="p-4">
        <p className="mb-3 px-3 text-xs font-semibold uppercase text-gray-400">
          Workspace
        </p>

        <a
          href="#"
          className="block rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-900"
        >
          Dashboard
        </a>

        <a
          href="#"
          className="mt-1 block rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100"
        >
          Leads
        </a>

        <a
          href="#"
          className="mt-1 block rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100"
        >
          Customers
        </a>

        <a
          href="#"
          className="mt-1 block rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100"
        >
          Deals
        </a>

        <a
          href="#"
          className="mt-1 block rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100"
        >
          Pipeline
        </a>

        <a
          href="#"
          className="mt-1 block rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100"
        >
          Activities
        </a>
      </nav>
    </aside>
  );
}

export default Sidebar;