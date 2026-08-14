import { NavLink, Outlet, useNavigate } from "react-router-dom";

export default function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    navigate("/login");
  };

  return (
    <div>
      <aside>
        <h2>Cashier App</h2>

        <nav>
          <NavLink to="/admin">
            Dashboard
          </NavLink>

          <NavLink to="/admin/products">
            Products
          </NavLink>

          <NavLink to="/admin/categories">
            Categories
          </NavLink>

          <NavLink to="/admin/cashiers">
            Cashiers
          </NavLink>

          <NavLink to="/admin/reports">
            Reports
          </NavLink>
        </nav>

        <button onClick={handleLogout}>
          Logout
        </button>
      </aside>

      <main>
        <Outlet />
      </main>
    </div>
  );
}