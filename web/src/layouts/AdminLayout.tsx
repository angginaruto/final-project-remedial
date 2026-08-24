import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "./AdminLayout.css";

export default function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    navigate("/login");
  };

  return (
    <div className="al">
      <aside className="al-sidebar">
        <h2 className="al-brand">Cashier App</h2>

        <nav className="al-nav">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              isActive ? "al-nav-link al-nav-link--active" : "al-nav-link"
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/admin/products"
            className={({ isActive }) =>
              isActive ? "al-nav-link al-nav-link--active" : "al-nav-link"
            }
          >
            Products
          </NavLink>

          <NavLink
            to="/admin/cashiers"
            className={({ isActive }) =>
              isActive ? "al-nav-link al-nav-link--active" : "al-nav-link"
            }
          >
            Cashiers
          </NavLink>

          <NavLink
            to="/admin/reports"
            className={({ isActive }) =>
              isActive ? "al-nav-link al-nav-link--active" : "al-nav-link"
            }
          >
            Reports
          </NavLink>
        </nav>

        <button onClick={handleLogout} className="al-logout-btn">
          Logout
        </button>
      </aside>

      <main className="al-content">
        <Outlet />
      </main>
    </div>
  );
}