import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.tsx";
import { ToastProvider } from "./context/ToastContext.tsx";
import { Navbar } from "./components/layout/Navbar.tsx";
import { Footer } from "./components/layout/Footer.tsx";
import { HomePage } from "./pages/HomePage.tsx";
import { LawyerDirectoryPage } from "./pages/LawyerDirectoryPage.tsx";
import { LawyerProfilePage } from "./pages/LawyerProfilePage.tsx";
import { LegalCategoriesPage } from "./pages/LegalCategoriesPage.tsx";
import { AuthPage } from "./pages/AuthPage.tsx";
import { ClientDashboardPage } from "./pages/ClientDashboardPage.tsx";
import { LawyerDashboardPage } from "./pages/LawyerDashboardPage.tsx";
import { AdminDashboardPage } from "./pages/AdminDashboardPage.tsx";
import { ForLawyersPage } from "./pages/ForLawyersPage.tsx";
import { AboutPage } from "./pages/AboutPage.tsx";

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/lawyers" element={<LawyerDirectoryPage />} />
                <Route path="/lawyers/:id" element={<LawyerProfilePage />} />
                <Route path="/categories" element={<LegalCategoriesPage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/dashboard/client" element={<ClientDashboardPage />} />
                <Route path="/dashboard/lawyer" element={<LawyerDashboardPage />} />
                <Route path="/dashboard/admin" element={<AdminDashboardPage />} />
                <Route path="/for-lawyers" element={<ForLawyersPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
