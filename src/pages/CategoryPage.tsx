import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/components/ProductCard";
import ProductCard from "@/components/ProductCard";
import { useCart } from "@/context/CartContext";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { ChevronRight, ShoppingBag } from "lucide-react";
import { Helmet } from "react-helmet-async";

const CategoryPage = () => {
  const { id } = useParams<{ id: string }>();
  const [category, setCategory] = useState<{ nome: string; descricao: string | null } | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [flavors, setFlavors] = useState<string[]>([]);
  const [selectedFlavor, setSelectedFlavor] = useState<string>("all");
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchCategoryAndProducts = async () => {
      setLoading(true);
      
      try {
        // Fetch category
        const { data: categoryData, error: categoryError } = await supabase
          .from("categorias")
          .select("nome, descricao")
          .eq("id", id)
          .single();

        if (categoryError) throw categoryError;
        setCategory(categoryData);

        // Fetch products for this category
        const { data: productsData, error: productsError } = await supabase
          .from("produtos")
          .select("*")
          .eq("categoria_id", id);

        if (productsError) throw productsError;
        
        // Convert products data to match Product type
        const formattedProducts = productsData.map(product => ({
          ...product,
          descricao: product.descricao && typeof product.descricao === 'object'
            ? { 
                texto: 'texto' in product.descricao 
                  ? String(product.descricao.texto || '') || null
                  : null,
                imagens: 'imagens' in product.descricao && Array.isArray(product.descricao.imagens)
                  ? product.descricao.imagens.map(String)
                  : []
              }
            : { texto: typeof product.descricao === 'string' ? product.descricao : null, imagens: [] }
        }));
        
        // Extract unique flavors from product names
        const allFlavors = formattedProducts
          .map(product => {
            const nameParts = product.nome.split('-');
            return nameParts.length > 1 ? nameParts[1].trim() : '';
          })
          .filter(flavor => flavor !== ''); // Remove empty flavors
        
        setFlavors(['all', ...new Set(allFlavors)]);
        setProducts(formattedProducts);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCategoryAndProducts();
    }
  }, [id]);

  const filteredProducts = selectedFlavor === "all" 
    ? products 
    : products.filter(product => product.nome.toLowerCase().includes(selectedFlavor.toLowerCase()));

  // Structured data for the category
  const categoryStructuredData = category ? {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": category.nome,
    "description": category.descricao || `Encontre os melhores ${category.nome} em São Paulo. Produtos premium com entrega rápida.`,
    "url": `https://vapesprime.com.br/categoria/${category.id}`,
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": products.map((product, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Product",
          "name": product.nome,
          "description": product.descricao?.texto || "",
          "image": product.imagem_url || "",
          "offers": {
            "@type": "Offer",
            "price": product.preco,
            "priceCurrency": "BRL",
            "availability": product.estoque > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
          }
        }
      }))
    }
  } : null;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="h-8 w-1/3 bg-gray-200 animate-pulse mb-8 rounded"></div>
        <div className="h-4 w-2/3 bg-gray-200 animate-pulse mb-12 rounded"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="h-80 bg-gray-200 animate-pulse rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{category ? `${category.nome} | VapesPrime - Loja de Vapes em São Paulo` : "Categoria | VapesPrime"}</title>
        <meta name="description" content={category?.descricao || `Encontre os melhores ${category?.nome || 'vapes'} em São Paulo. Produtos premium com entrega rápida e preços competitivos.`} />
        <meta name="keywords" content={`vapes, ${category?.nome}, vape shop, vape store, vape sp, vape são paulo, vape delivery, vape online, vape premium, vape original`} />
        {categoryStructuredData && (
          <script type="application/ld+json">
            {JSON.stringify(categoryStructuredData)}
          </script>
        )}
      </Helmet>

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-purple-700 to-blue-700 text-white">
          <div className="container mx-auto px-4 py-16">
            <div className="flex items-center text-sm text-white/80 mb-4">
              <Link to="/" className="hover:text-white">Home</Link>
              <ChevronRight className="h-4 w-4 mx-2" />
              <span>{category?.nome || "Categoria"}</span>
            </div>
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{category?.nome || "Categoria"}</h1>
              {category?.descricao && (
                <p className="text-lg text-white/90">{category.descricao}</p>
              )}
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="container mx-auto px-4 py-12">
          {products.length > 0 ? (
            <>
              {/* Flavor filters */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Sabores</h2>
                <Tabs defaultValue="all" value={selectedFlavor} onValueChange={setSelectedFlavor}>
                  <TabsList className="flex flex-wrap gap-2 h-auto">
                    {flavors.map(flavor => (
                      <TabsTrigger 
                        key={flavor} 
                        value={flavor}
                        className="px-4 py-2 rounded-full capitalize"
                      >
                        {flavor === 'all' ? 'Todos' : flavor}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {filteredProducts.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onAddToCart={addToCart}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <ShoppingBag className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-2xl font-medium text-gray-800 mb-2">
                Nenhum produto encontrado
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Não existem produtos nesta categoria no momento. Por favor, volte mais tarde.
              </p>
              <Link 
                to="/"
                className="inline-flex items-center px-6 py-3 rounded-full bg-purple-700 text-white font-medium hover:bg-purple-800 transition-colors"
              >
                Explorar outras categorias
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CategoryPage;
