
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Tag, ShoppingCart, Truck } from "lucide-react";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    lowStockProducts: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Count produtos
        const { count: productsCount, error: productsError } = await supabase
          .from("produtos")
          .select("*", { count: "exact", head: true });

        // Count categorias
        const { count: categoriesCount, error: categoriesError } = await supabase
          .from("categorias")
          .select("*", { count: "exact", head: true });

        // Count low stock products (less than 3)
        const { data: lowStockData, error: lowStockError } = await supabase
          .from("produtos")
          .select("id")
          .lt("estoque", 3);

        if (!productsError && !categoriesError && !lowStockError) {
          setStats({
            totalProducts: productsCount || 0,
            totalCategories: categoriesCount || 0,
            lowStockProducts: lowStockData?.length || 0
          });
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="h-32 bg-gray-100 rounded-lg animate-pulse"></div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Total de Produtos
                </CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalProducts}</div>
                <p className="text-xs text-muted-foreground">
                  Produtos cadastrados
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Total de Categorias
                </CardTitle>
                <Tag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalCategories}</div>
                <p className="text-xs text-muted-foreground">
                  Categorias cadastradas
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Produtos com Baixo Estoque
                </CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.lowStockProducts}</div>
                <p className="text-xs text-muted-foreground">
                  Produtos com menos de 3 unidades
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Regiões de Entrega
                </CardTitle>
                <Truck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5</div>
                <p className="text-xs text-muted-foreground">
                  Regiões disponíveis
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Gerenciamento Rápido</CardTitle>
                <CardDescription>
                  Acesse as principais funcionalidades do sistema.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Link to="/admin/produtos">
                    <Button variant="outline" className="w-full">
                      <Package className="mr-2 h-4 w-4" />
                      Produtos
                    </Button>
                  </Link>
                  <Link to="/admin/produtos/novo">
                    <Button variant="outline" className="w-full">
                      Novo Produto
                    </Button>
                  </Link>
                  <Link to="/admin/categorias">
                    <Button variant="outline" className="w-full">
                      <Tag className="mr-2 h-4 w-4" />
                      Categorias
                    </Button>
                  </Link>
                  <Link to="/admin/categorias/nova">
                    <Button variant="outline" className="w-full">
                      Nova Categoria
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Loja Online</CardTitle>
                <CardDescription>
                  Acesse e visualize a loja como um cliente.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-500">
                  Para verificar como os clientes estão vendo sua loja, acesse as páginas da loja online.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <Link to="/">
                    <Button variant="outline" className="w-full">
                      Página Inicial
                    </Button>
                  </Link>
                  <Link to="/categoria/ignite-8000">
                    <Button variant="outline" className="w-full">
                      Categorias
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
