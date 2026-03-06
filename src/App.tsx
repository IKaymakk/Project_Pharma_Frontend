import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '@/layouts/AdminLayout';
import ProductsPage from '@/pages/admin/ProductsPage'; // Sayfayı içeri al
import { Toaster } from "@/components/ui/toaster"
function App() {
  return (
    <>
      <Toaster />
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
    </>
  );
}

export default App;