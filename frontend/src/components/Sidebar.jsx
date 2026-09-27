import { NavLink } from "react-router-dom";

function Sidebar() {
  const menuItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Leads", path: "/leads" },
    { name: "Customers", path: "/customers" },
    { name: "Deals", path: "/deals" },
    { name: "Pipeline", path: "/pipeline" },
  ];

  return (
    <aside className="w-64 border-r border-[#D8D3DA] bg-[#E8E5EA] dark:border-[#3B383D] dark:bg-[#1A1A1A]">
      <div className="flex h-16 items-center border-b border-[#D8D3DA] px-6 dark:border-[#3B383D]">
        <h1 className="text-xl font-bold text-[#27242A] dark:text-[#F3F3F3]">
          CRM
        </h1>
      </div>

      <nav className="p-4">
        <p className="mb-3 px-3 text-xs font-semibold uppercase text-[#918B94]">
          Workspace
        </p>

        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `mt-1 block rounded-lg px-3 py-2 text-sm ${
                isActive
                  ? "bg-[#DDD6E8] font-medium text-[#6339BD] dark:bg-[#2D2A30] dark:text-[#F3F3F3]"
                  : "text-[#6F6972] hover:bg-[#F0EDF1] dark:text-[#A7A3AA] dark:hover:bg-[#25232A] dark:hover:text-[#F3F3F3]"
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
