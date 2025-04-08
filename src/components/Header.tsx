import { ShoppingCart, Menu, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Category {
  id: string;
  nome: string;
}

const Header = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from("categorias")
        .select("id, nome")
        .order("nome");

      if (!error && data) {
        setCategories(data);
      }
    };

    fetchCategories();
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="font-bold text-xl">
          VapesPrime
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-gray-700 hover:text-gray-900">
            Início
          </Link>
          
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center text-gray-700 hover:text-gray-900">
              Categorias <ChevronDown className="ml-1 h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {categories.map((category) => (
                <DropdownMenuItem key={category.id}>
                  <Link
                    to={`/categoria/${category.id}`}
                    className="w-full text-gray-700 hover:text-gray-900"
                  >
                    {category.nome}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Link to="/contato" className="text-gray-700 hover:text-gray-900">
            Contato
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <Link to="/carrinho" className="text-gray-700 hover:text-gray-900">
            <ShoppingCart className="h-6 w-6" />
          </Link>
          
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col space-y-4 mt-8">
                <Link to="/" className="text-lg">
                  Início
                </Link>
                <div className="space-y-2">
                  <p className="text-lg font-medium">Categorias</p>
                  <div className="pl-4 space-y-2">
                    {categories.map((category) => (
                      <Link
                        key={category.id}
                        to={`/categoria/${category.id}`}
                        className="block text-gray-700 hover:text-gray-900"
                      >
                        {category.nome}
                      </Link>
                    ))}
                  </div>
                </div>
                <Link to="/contato" className="text-lg">
                  Contato
                </Link>
                <Link to="/carrinho" className="text-lg">
                  Carrinho
                </Link>
                <Link to="/admin" className="text-lg text-blue-600">
                  Área Administrativa
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
