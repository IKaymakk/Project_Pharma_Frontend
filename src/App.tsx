import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '@/layouts/AdminLayout';
import ProductsPage from '@/pages/admin/ProductsPage';
import { PublicLayout } from '@/components/web/layout/PublicLayout'; // ✅ Yeni Layout eklendi
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HomePage from '@/pages/web/HomePage';
function App() {
  return (
    <>
      <Router>
        <Routes>

          {/* 🌐 VİTRİN (PUBLIC) TARAFI */}
          <Route path="/" element={<PublicLayout />}>
            {/* Anasayfa */}
            <Route index element={<HomePage />} />
            {/* Diğer Alt Sayfalar (Şimdilik geçici) */}
            <Route path="about" element={<div className="p-20 text-center text-xl">Kurumsal Sayfası</div>} />
            <Route path="products" element={<div className="p-20 text-center text-xl">Ürünler Kataloğu</div>} />
            <Route path="quality" element={<div className="p-20 text-center text-xl">Kalite (GMP) Sayfası</div>} />
            <Route path="contact" element={<div className="p-20 text-center text-xl">İletişim Sayfası</div>} />
          </Route>


          {/* 🔒 YÖNETİM (ADMIN) TARAFI (Burası hiç bozulmadı) */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<div>Dashboard (Özet Ekranı)</div>} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="users" element={<div>Kullanıcı Yönetimi</div>} />
            <Route path="settings" element={<div>Sistem Ayarları</div>} />
          </Route>


          {/* 404 Durumunda Anasayfaya At */}
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