import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { HelmetProvider } from "react-helmet-async";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import CategoryPage from "./pages/CategoryPage";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import AuthPage from "./pages/AuthPage";
import SuccessPage from "./pages/SuccessPage";
import ContactPage from "./pages/ContactPage";

// Admin Pages
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import CategoriasList from "./pages/admin/categorias/CategoriasList";
import CategoriaForm from "./pages/admin/categorias/CategoriaForm";
import ProdutosList from "./pages/admin/produtos/ProdutosList";
import ProdutoForm from "./pages/admin/produtos/ProdutoForm";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <AuthProvider>
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Admin Routes */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="categorias" element={<CategoriasList />} />
                  <Route path="categorias/nova" element={<CategoriaForm />} />
                  <Route path="categorias/editar/:id" element={<CategoriaForm isEditing />} />
                  <Route path="produtos" element={<ProdutosList />} />
                  <Route path="produtos/novo" element={<ProdutoForm />} />
                  <Route path="produtos/editar/:id" element={<ProdutoForm isEditing />} />
                </Route>
                
                {/* Auth Routes */}
                <Route path="/auth" element={<AuthPage />} />
                
                {/* Public Routes */}
                <Route
                  path="/"
                  element={
                    <>
                      <Header />
                      <main className="min-h-screen">
                        <HomePage />
                      </main>
                      <Footer />
                    </>
                  }
                />
                <Route
                  path="/success"
                  element={
                    <>
                      <Header />
                      <main className="min-h-screen">
                        <SuccessPage />
                      </main>
                      <Footer />
                    </>
                  }
                />
                <Route
                  path="/categoria/:id"
                  element={
                    <>
                      <Header />
                      <main className="min-h-screen">
                        <CategoryPage />
                      </main>
                      <Footer />
                    </>
                  }
                />
                <Route
                  path="/produto/:id"
                  element={
                    <>
                      <Header />
                      <main className="min-h-screen">
                        <ProductPage />
                      </main>
                      <Footer />
                    </>
                  }
                />
                <Route
                  path="/carrinho"
                  element={
                    <>
                      <Header />
                      <main className="min-h-screen">
                        <CartPage />
                      </main>
                      <Footer />
                    </>
                  }
                />
                <Route
                  path="/contato"
                  element={
                    <>
                      <Header />
                      <main className="min-h-screen">
                        <ContactPage />
                      </main>
                      <Footer />
                    </>
                  }
                />
                
                {/* Catch-all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </CartProvider>
      </AuthProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
