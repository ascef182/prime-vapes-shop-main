
import { useEffect } from "react";
import { Outlet, useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { LayoutDashboard, Package, Tag, LogOut } from "lucide-react";

const AdminLayout = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !user) {
      toast({
        title: "Acesso negado",
        description: "Você precisa estar logado para acessar o painel administrativo.",
        variant: "destructive",
      });
      navigate("/auth");
    }
  }, [user, loading, navigate, toast]);

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado do painel administrativo.",
    });
    navigate("/");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md hidden md:block">
        <div className="p-6 border-b">
          <h2 className="font-bold text-xl">VapesPrime</h2>
          <p className="text-gray-500 text-sm">Painel Administrativo</p>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <Link
                to="/admin"
                className="flex items-center p-2 rounded-md hover:bg-gray-50"
              >
                <LayoutDashboard className="mr-3 h-5 w-5 text-gray-500" />
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/produtos"
                className="flex items-center p-2 rounded-md hover:bg-gray-50"
              >
                <Package className="mr-3 h-5 w-5 text-gray-500" />
                <span>Produtos</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/categorias"
                className="flex items-center p-2 rounded-md hover:bg-gray-50"
              >
                <Tag className="mr-3 h-5 w-5 text-gray-500" />
                <span>Categorias</span>
              </Link>
            </li>
          </ul>
        </nav>
        
        <div className="absolute bottom-0 w-64 p-4 border-t">
          <Button
            onClick={handleSignOut}
            variant="outline"
            className="w-full justify-start"
          >
            <LogOut className="mr-2 h-4 w-4" /> Sair
          </Button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-x-hidden">
        {/* Mobile Header */}
        <div className="md:hidden bg-white shadow-sm p-4 flex justify-between items-center">
          <h2 className="font-bold text-lg">VapesPrime Admin</h2>
          
          <div className="flex items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        <div className="md:hidden flex justify-around border-b bg-white py-2">
          <Link to="/admin" className="flex flex-col items-center p-2 text-xs">
            <LayoutDashboard className="h-5 w-5 mb-1" />
            <span>Dashboard</span>
          </Link>
          <Link to="/admin/produtos" className="flex flex-col items-center p-2 text-xs">
            <Package className="h-5 w-5 mb-1" />
            <span>Produtos</span>
          </Link>
          <Link to="/admin/categorias" className="flex flex-col items-center p-2 text-xs">
            <Tag className="h-5 w-5 mb-1" />
            <span>Categorias</span>
          </Link>
        </div>
        
        {/* Page Content */}
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
