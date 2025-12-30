import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const role = useSelector((state) => state.auth.role);

  const commonLinks = [
    { name: "Dashboard", path: "/" },
  ];

  const adminLinks = [
      { name: "Invite User", path: "/invite" },
    { name: "Users", path: "/users" },
    { name: "Products", path: "/products" },
    { name: "Inventory", path: "/inventory" },
  ];

  const managerLinks = [
    { name: "Invite User", path: "/invite" },
    { name: "Products", path: "/products" },
    { name: "Inventory", path: "/inventory" },
  ];

  const staffLinks = [
    { name: "Inventory", path: "/inventory" },
  ];

  let links = commonLinks;

  if (role === "ADMIN") links = [...links, ...adminLinks];
  if (role === "MANAGER") links = [...links, ...managerLinks];
  if (role === "STAFF") links = [...links, ...staffLinks];

  return (
    <aside className="w-60 bg-gray-900 text-white flex flex-col">
      <div className="h-14 flex items-center px-6 font-bold text-xl">
        IMS
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `block px-3 py-2 rounded ${
                isActive ? "bg-gray-700" : "hover:bg-gray-800"
              }`
            }
          >
            {link.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
