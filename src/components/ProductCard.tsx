import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, CircleCheck, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

export type Product = {
  id: string;
  nome: string;
  descricao: ProductDescription | null;
  preco: number;
  estoque: number;
  categoria_id: string | null;
  imagem_url: string | null;
  imagem_path: string | null;
};

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const { toast } = useToast();

  // Extract flavor from the product name (assuming format: "Name - Flavor")
  const getFlavorFromName = (name: string) => {
    const parts = name.split('-');
    return parts.length > 1 ? parts[1].trim() : '';
  };

  // Get product type from the product name (before the dash)
  const getProductType = (name: string) => {
    const parts = name.split('-');
    return parts[0].trim();
  };

  const flavor = getFlavorFromName(product.nome);
  const productType = getProductType(product.nome);

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product);
      toast({
        title: "Produto adicionado",
        description: `${product.nome} foi adicionado ao carrinho.`,
      });
    }
  };

  // Determine stock status for visual indicators
  const getStockStatusInfo = (stock: number) => {
    if (stock <= 0) {
      return {
        className: "text-red-600",
        label: "Esgotado",
        icon: <AlertTriangle className="h-3 w-3 mr-1" />,
        badgeColor: "bg-red-100 text-red-800"
      };
    } else if (stock <= 3) {
      return {
        className: "text-amber-600 font-medium",
        label: `Últimas ${stock} unid.`,
        icon: <AlertTriangle className="h-3 w-3 mr-1" />,
        badgeColor: "bg-amber-100 text-amber-800"
      };
    } else {
      return {
        className: "text-green-600 font-medium",
        label: `${stock} unid.`,
        icon: <CircleCheck className="h-3 w-3 mr-1" />,
        badgeColor: "bg-green-100 text-green-800"
      };
    }
  };

  const stockStatus = getStockStatusInfo(product.estoque);

  // Get product image URL (either from imagem_url, imagem_path, or fallback to placeholder)
  const getProductImageUrl = () => {
    if (product.imagem_url) return product.imagem_url;
    if (product.imagem_path) return `https://gdaipkiojgaiuslzgjsw.supabase.co/storage/v1/object/public/produtos/${product.imagem_path}`;
    return '/placeholder.svg';
  };

  return (
    <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-all border-0 rounded-2xl shadow-sm hover:translate-y-[-5px]">
      <div className="relative pt-[100%] bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          <img 
            src={getProductImageUrl()} 
            alt={product.nome} 
            className="w-full h-full object-cover" 
          />
        </div>
        {product.estoque > 0 && (
          <div className={`absolute top-3 right-3 ${stockStatus.badgeColor} text-xs font-medium px-2 py-1 rounded-full flex items-center`}>
            {stockStatus.icon}
            {stockStatus.label}
          </div>
        )}
      </div>
      <CardContent className="flex-grow p-6">
        <Badge variant="outline" className="mb-2 text-purple-700 border-purple-200 bg-purple-50">
          {productType}
        </Badge>
        <h3 className="font-semibold text-xl mb-1 text-gray-800">{flavor}</h3>
        <p className="text-gray-500 text-sm mb-4 line-clamp-2">
          {product.descricao?.texto || `${flavor} - Experiência única com o melhor vape.`}
        </p>
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-gray-900">R$ {product.preco.toFixed(2)}</span>
          <span className={`text-sm ${stockStatus.className}`}>
            {product.estoque > 0 ? stockStatus.label : 'Esgotado'}
          </span>
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0 flex gap-3">
        <Link 
          to={`/produto/${product.id}`} 
          className="flex-1"
        >
          <Button variant="outline" className="w-full rounded-full border-gray-300 hover:bg-gray-100 hover:text-gray-900">
            Detalhes
          </Button>
        </Link>
        <Button 
          onClick={handleAddToCart} 
          className="flex-1 rounded-full bg-purple-700 hover:bg-purple-800"
          disabled={product.estoque <= 0}
        >
          <ShoppingCart className="mr-2 h-4 w-4" /> Comprar
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
