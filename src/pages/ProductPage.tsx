import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/components/ProductCard";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import { Helmet } from "react-helmet-async";

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<{ nome: string; id: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    const fetchProductAndRelated = async () => {
      setLoading(true);
      
      try {
        // Fetch product
        const { data: productData, error: productError } = await supabase
          .from("produtos")
          .select("*")
          .eq("id", id)
          .single();

        if (productError) throw productError;
        
        // Convert the data to match the Product type
        const formattedProduct: Product = {
          ...productData,
          descricao: productData.descricao && typeof productData.descricao === 'object' && 'texto' in productData.descricao
            ? { texto: productData.descricao.texto || null, imagens: productData.descricao.imagens || [] }
            : { texto: typeof productData.descricao === 'string' ? productData.descricao : null, imagens: [] }
        };
        
        setProduct(formattedProduct);
        
        if (productData.categoria_id) {
          // Fetch category
          const { data: categoryData, error: categoryError } = await supabase
            .from("categorias")
            .select("nome, id")
            .eq("id", productData.categoria_id)
            .single();

          if (!categoryError) {
            setCategory(categoryData);
          }

          // Fetch related products
          const { data: relatedData, error: relatedError } = await supabase
            .from("produtos")
            .select("*")
            .eq("categoria_id", productData.categoria_id)
            .neq("id", id)
            .limit(4);

          if (!relatedError && relatedData) {
            // Convert related products data to match the Product type
            const formattedRelatedProducts: Product[] = relatedData.map(product => ({
              ...product,
              descricao: product.descricao && typeof product.descricao === 'object' && 'texto' in product.descricao
                ? { texto: product.descricao.texto || null, imagens: product.descricao.imagens || [] }
                : { texto: typeof product.descricao === 'string' ? product.descricao : null, imagens: [] }
            }));
            setRelatedProducts(formattedRelatedProducts);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProductAndRelated();
    }
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      // Add multiple times based on quantity
      for (let i = 0; i < quantity; i++) {
        addToCart(product);
      }
      
      toast({
        title: "Produto adicionado",
        description: `${quantity} unidade(s) de ${product.nome} adicionada(s) ao carrinho.`,
      });
    }
  };

  // Structured data for the product
  const productStructuredData = product ? {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.nome,
    "description": product.descricao?.texto || "",
    "image": product.imagem_url || "",
    "brand": {
      "@type": "Brand",
      "name": "VapesPrime"
    },
    "offers": {
      "@type": "Offer",
      "price": product.preco,
      "priceCurrency": "BRL",
      "availability": product.estoque > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "VapesPrime",
        "url": "https://vapesprime.com.br"
      }
    }
  } : null;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse">
          <div className="h-4 w-32 bg-gray-200 mb-8 rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="h-96 bg-gray-200 rounded-lg"></div>
            <div>
              <div className="h-8 w-2/3 bg-gray-200 mb-4 rounded"></div>
              <div className="h-4 w-full bg-gray-200 mb-2 rounded"></div>
              <div className="h-4 w-full bg-gray-200 mb-2 rounded"></div>
              <div className="h-4 w-2/3 bg-gray-200 mb-8 rounded"></div>
              <div className="h-8 w-32 bg-gray-200 mb-8 rounded"></div>
              <div className="h-12 w-full bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Produto não encontrado</h2>
        <p className="mb-8">O produto que você está procurando não existe ou foi removido.</p>
        <Link to="/">
          <Button>Voltar para a página inicial</Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{product ? `${product.nome} | VapesPrime - Loja de Vapes em São Paulo` : "Produto | VapesPrime"}</title>
        <meta name="description" content={product?.descricao?.texto || "Encontre os melhores vapes e produtos premium em São Paulo. Entrega rápida, preços competitivos e atendimento personalizado."} />
        <meta name="keywords" content={`vapes, ${product?.nome}, vape shop, vape store, vape sp, vape são paulo, vape delivery, vape online, vape premium, vape original`} />
        {productStructuredData && (
          <script type="application/ld+json">
            {JSON.stringify(productStructuredData)}
          </script>
        )}
      </Helmet>

      <div className="container mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <div className="mb-8">
          <nav className="flex items-center text-sm">
            <Link to="/" className="text-gray-500 hover:text-gray-700">Início</Link>
            <span className="mx-2 text-gray-400">/</span>
            {category && (
              <>
                <Link to={`/categoria/${category.id}`} className="text-gray-500 hover:text-gray-700">{category.nome}</Link>
                <span className="mx-2 text-gray-400">/</span>
              </>
            )}
            <span className="text-gray-900 font-medium">{product.nome}</span>
          </nav>
        </div>

        {/* Product Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div className="bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden h-[400px]">
            <img 
              src={
                product.imagem_url || 
                (product.imagem_path 
                  ? supabase.storage.from('produtos').getPublicUrl(product.imagem_path).data.publicUrl
                  : "/placeholder.svg")
              }
              alt={product.nome} 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div>
            <Link to={category ? `/categoria/${category.id}` : "/"} className="inline-flex items-center text-blue-600 mb-4">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Voltar
            </Link>
            <h1 className="text-3xl font-bold mb-4">{product.nome}</h1>
            <p className="text-gray-600 mb-6">{product.descricao?.texto || "Sem descrição disponível."}</p>
            
            <div className="flex items-center justify-between mb-6">
              <span className="text-3xl font-bold">R$ {product.preco.toFixed(2)}</span>
              <span className={`text-sm px-3 py-1 rounded-full ${product.estoque > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {product.estoque > 0 ? `${product.estoque} em estoque` : 'Esgotado'}
              </span>
            </div>
            
            {product.estoque > 0 && (
              <div className="mb-6">
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                  Quantidade
                </label>
                <div className="flex items-center">
                  <button
                    type="button"
                    className="w-10 h-10 border border-gray-300 flex items-center justify-center rounded-l-md"
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    id="quantity"
                    min="1"
                    max={product.estoque}
                    value={quantity}
                    onChange={e => setQuantity(Math.min(product.estoque, Math.max(1, parseInt(e.target.value))))}
                    className="w-16 h-10 border-t border-b border-gray-300 text-center"
                  />
                  <button
                    type="button"
                    className="w-10 h-10 border border-gray-300 flex items-center justify-center rounded-r-md"
                    onClick={() => setQuantity(q => Math.min(product.estoque, q + 1))}
                  >
                    +
                  </button>
                </div>
              </div>
            )}
            
            <Button 
              className="w-full py-6 text-lg"
              onClick={handleAddToCart}
              disabled={product.estoque <= 0}
            >
              <ShoppingCart className="mr-2 h-5 w-5" /> 
              {product.estoque > 0 ? 'Adicionar ao Carrinho' : 'Produto Esgotado'}
            </Button>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Produtos Relacionados</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onAddToCart={addToCart}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProductPage;
