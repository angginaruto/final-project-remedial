import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import LoginPage from "../pages/LoginPage";
import AdminDashboard from "../pages/admin/AdminDashboard";
import CashierDashboard from "../pages/cashier/CashierDashboard";
import AdminLayout from "../layouts/AdminLayout";
import ProductsPage from "../pages/admin/ProductsPage";
import CategoriesPage from "../pages/admin/CategoriesPage";
import CashiersPage from "../pages/admin/CashiersPage";
import ReportsPage from "../pages/admin/ReportsPage";
import ProtectedRoute from "./ProtectedRoute";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]} />
          }
        >
          <Route
            path="/admin"
            element={<AdminLayout />}
          >
            <Route
              index
              element={<AdminDashboard />}
            />

            <Route
              path="products"
              element={<ProductsPage />}
            />

            <Route
              path="categories"
              element={<CategoriesPage />}
            />

            <Route
              path="cashiers"
              element={<CashiersPage />}
            />

            <Route
              path="reports"
              element={<ReportsPage />}
            />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["CASHIER"]} />}>
          <Route
            path="/cashier"
            element={<CashierDashboard />}
          />
        </Route>

        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}