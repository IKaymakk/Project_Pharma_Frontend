import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '@/layouts/AdminLayout';
import ProductsPage from '@/pages/admin/ProductsPage';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/admin" replace />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<div>Dashboard (Özet Ekranı)</div>} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="users" element={<div>Kullanıcı Yönetimi</div>} />
            <Route path="settings" element={<div>Sistem Ayarları</div>} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastStyle={{ fontSize: "13px", fontFamily: "Inter, sans-serif" }}
      />
    </>

  );
}

export default App;