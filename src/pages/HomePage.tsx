import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/components/ProductCard";
import ProductCard from "@/components/ProductCard";
import { useCart } from "@/context/CartContext";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Helmet } from "react-helmet-async";

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch products with highest stock for featured section
        const { data: productsData, error: productsError } = await supabase
          .from("produtos")
          .select("*")
          .order("estoque", { ascending: false })
          .limit(8);

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
        
        setFeaturedProducts(formattedProducts);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Structured data for the homepage
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "VapesPrime - Loja de Vapes em São Paulo",
    "description": "Encontre os melhores vapes e produtos premium em São Paulo. Entrega rápida, preços competitivos e atendimento personalizado.",
    "url": "https://vapesprime.com.br",
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": featuredProducts.map((product, index) => ({
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
  };

  return (
    <>
      <Helmet>
        <title>VapesPrime - Loja de Vapes em São Paulo | Produtos Premium</title>
        <meta name="description" content="Encontre os melhores vapes e produtos premium em São Paulo. Entrega rápida, preços competitivos e atendimento personalizado. ✓ Produtos originais ✓ Garantia ✓ Pagamento seguro" />
        <meta name="keywords" content="vapes, vape shop, vape store, vape sp, vape são paulo, vape delivery, vape online, vape premium, vape original, vape barato, vape loja, vape produtos, vape acessórios" />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <div>
        {/* Hero Section */}
        <section 
          className="w-full relative min-h-[600px] bg-cover bg-center flex items-center"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/fumaca.jpeg')`
          }}
        >
          <div className="container mx-auto px-4 py-24 md:py-32 flex flex-col items-center text-center relative z-10">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">VapesPrime</h1>
            <p className="text-xl md:text-2xl mb-10 max-w-2xl text-white">
              A melhor loja de vapes do Brasil com produtos premium e os sabores mais exclusivos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/categoria/ignite-8000" 
                className="bg-white text-purple-700 px-8 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors"
              >
                Explorar Produtos
              </Link>
              <Link 
                to="/sobre" 
                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-medium hover:bg-white/10 transition-colors"
              >
                Saiba Mais
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold mb-8">Produtos em Destaque</h2>
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="h-80 bg-gray-200 animate-pulse rounded-lg"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onAddToCart={addToCart}
                />
              ))}
            </div>
          )}
        </section>

        {/* Information Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="text-center">
              <div className="mb-4 inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Qualidade Premium</h3>
              <p className="text-gray-600">
                Todos os nossos produtos são selecionados cuidadosamente para garantir a melhor experiência.
              </p>
            </div>
            
            <div className="text-center">
              <div className="mb-4 inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8 4-8-4V5l8 4 8-4v2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Entrega Rápida</h3>
              <p className="text-gray-600">
                Entregamos em toda a cidade:
                <br />
                Centro: R$ 10,00
                <br />
                Demais regiões: R$ 20,00
              </p>
            </div>
            
            <div className="text-center">
              <div className="mb-4 inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Pagamento Seguro</h3>
              <p className="text-gray-600">
                Utilizamos os métodos mais seguros de pagamento para sua tranquilidade.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default HomePage;
