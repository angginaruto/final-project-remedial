import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "../pages/LoginPage";
import AdminDashboard from "../pages/admin/AdminDashboard";
import CashierDashboard from "../pages/cashier/CashierDashboard";
import AdminLayout from "../layouts/AdminLayout";
import ProductsPage from "../pages/admin/products/ProductsPage";
import CashiersPage from "../pages/admin/cashier/CashierPage";
import ReportsPage from "../pages/admin/reports/ReportsPage";
import ProtectedRoute from "./ProtectedRoute";
import ShiftReportPage from "../pages/admin/reports/shiftReport/components/ShiftReportPage";
import DailyProductSalesPage from "../pages/admin/reports/dailyProductSales/components/DailyProductSalesPage";
import DailySalesReportPage from "../pages/admin/reports/dailySalesReport/components/DailySalesReportPage";
import TransactionPage from "../pages/cashier/transaction/TransactionPage";
import TransactionHistoryPage from "../pages/cashier/transactionhistory/TransactionHistoryPage";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />

            <Route path="products" element={<ProductsPage />} />

            <Route path="cashiers" element={<CashiersPage />} />

            <Route path="reports" element={<ReportsPage />} />

            <Route path="reports/shift" element={<ShiftReportPage />} />

            <Route path="reports/daily" element={<DailySalesReportPage />} />

            <Route
              path="reports/products"
              element={<DailyProductSalesPage />}
            />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["CASHIER"]} />}>
          <Route path="/cashier" element={<CashierDashboard />} />

          <Route path="/cashier/transaction" element={<TransactionPage />} />
          
          <Route
            path="/cashier/transactions"
            element={<TransactionHistoryPage />}
          />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
