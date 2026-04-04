import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '@/layouts/AdminLayout';
import ProductsPage from '@/pages/admin/ProductsPage';
import { PublicLayout } from '@/components/web/layout/PublicLayout'; // ✅ Yeni Layout eklendi
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HomePage from '@/pages/web/HomePage';
import ProductsPage2 from './pages/web/ProductsPage';
import AboutPage from './pages/web/About';
import QualityPage from './pages/web/QualityPage';
import GlobalLoader from './components/shared/GlobalLoader';
import Contact from './pages/web/Contact';
import CertificatesPage from './pages/admin/Certificates';
function App() {
  return (
    <>
      <Router>
        <GlobalLoader />
        <Routes>

          {/* 🌐 VİTRİN (PUBLIC) TARAFI */}
          <Route path="/" element={<PublicLayout />}>
            {/* Anasayfa */}
            <Route index element={<HomePage />} />
            {/* Diğer Alt Sayfalar (Şimdilik geçici) */}
            <Route path="about" element={<AboutPage />} />
            <Route path="products" element={<ProductsPage2 />} />
            <Route path="quality" element={<QualityPage />} />
            <Route path="contact" element={<Contact />} />
          </Route>


          {/* 🔒 YÖNETİM (ADMIN) TARAFI (Burası hiç bozulmadı) */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<div>Dashboard (Özet Ekranı)</div>} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="certificates" element={<CertificatesPage />} />
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