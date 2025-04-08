import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Trash2, ShoppingBag, ChevronLeft } from "lucide-react";
import { createCheckoutSession } from "@/api/create-checkout-session";
import { stripePromise } from "@/lib/stripe";

const CartPage = () => {
  const { items, updateQuantity, removeFromCart, totalItems, totalPrice } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [deliveryOption, setDeliveryOption] = useState("zona-sul");
  const [isLoading, setIsLoading] = useState(false);
  
  // Delivery fee based on region
  const deliveryFees = {
    "centro": 10,
    "zona-sul": 20,
    "zona-norte": 20,
    "zona-leste": 20,
    "zona-oeste": 20
  };
  
  const deliveryFee = deliveryFees[deliveryOption as keyof typeof deliveryFees] || 10;
  const orderTotal = totalPrice + deliveryFee;

  const handleCheckout = async () => {
    try {
      setIsLoading(true);
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe não foi carregado corretamente');

      const { sessionId } = await createCheckoutSession(items, deliveryFee);
      
      const { error } = await stripe.redirectToCheckout({
        sessionId,
      });

      if (error) {
        toast({
          title: "Erro ao processar pagamento",
          description: error.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Erro ao processar pagamento",
        description: "Ocorreu um erro ao processar seu pagamento. Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="max-w-md mx-auto">
          <ShoppingBag className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h1 className="text-2xl font-bold mb-4">Seu carrinho está vazio</h1>
          <p className="text-gray-600 mb-8">
            Parece que você ainda não adicionou nenhum produto ao seu carrinho.
          </p>
          <Link to="/">
            <Button className="w-full">Continuar Comprando</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Seu Carrinho</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <div className="border rounded-lg overflow-hidden">
            <div className="hidden sm:grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b">
              <div className="col-span-6">
                <span className="font-medium">Produto</span>
              </div>
              <div className="col-span-2 text-center">
                <span className="font-medium">Preço</span>
              </div>
              <div className="col-span-2 text-center">
                <span className="font-medium">Quantidade</span>
              </div>
              <div className="col-span-2 text-center">
                <span className="font-medium">Total</span>
              </div>
            </div>
            
            {items.map(item => (
              <div key={item.product.id} className="grid grid-cols-1 sm:grid-cols-12 gap-4 p-4 border-b items-center">
                <div className="col-span-6 flex items-center">
                  <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center mr-4">
                    <img 
                      src={
                        item.product.imagem_url || 
                        (item.product.imagem_path 
                          ? `https://gdaipkiojgaiuslzgjsw.supabase.co/storage/v1/object/public/produtos/${item.product.imagem_path}`
                          : "/placeholder.svg")
                      }
                      alt={item.product.nome} 
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium">{item.product.nome}</h3>
                    <button 
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-red-500 text-sm flex items-center mt-1"
                    >
                      <Trash2 className="h-3 w-3 mr-1" /> Remover
                    </button>
                  </div>
                </div>
                
                <div className="col-span-2 text-center">
                  <span className="sm:hidden font-medium mr-2">Preço:</span>
                  R$ {item.product.preco.toFixed(2)}
                </div>
                
                <div className="col-span-2">
                  <div className="flex items-center justify-center">
                    <button
                      type="button"
                      className="w-8 h-8 border border-gray-300 flex items-center justify-center rounded-l-md"
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      max={item.product.estoque}
                      value={item.quantity}
                      onChange={e => updateQuantity(item.product.id, parseInt(e.target.value))}
                      className="w-12 h-8 border-t border-b border-gray-300 text-center"
                    />
                    <button
                      type="button"
                      className="w-8 h-8 border border-gray-300 flex items-center justify-center rounded-r-md"
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      disabled={item.quantity >= item.product.estoque}
                    >
                      +
                    </button>
                  </div>
                </div>
                
                <div className="col-span-2 text-center font-medium">
                  <span className="sm:hidden font-medium mr-2">Total:</span>
                  R$ {(item.product.preco * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6">
            <Link to="/" className="inline-flex items-center text-blue-600">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Continuar Comprando
            </Link>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Resumo do Pedido</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span>Subtotal ({totalItems} itens)</span>
                <span>R$ {totalPrice.toFixed(2)}</span>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  Região de Entrega
                </label>
                <select
                  value={deliveryOption}
                  onChange={e => setDeliveryOption(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="centro">Centro - R$ 10,00</option>
                  <option value="zona-sul">Zona Sul - R$ 20,00</option>
                  <option value="zona-norte">Zona Norte - R$ 20,00</option>
                  <option value="zona-leste">Zona Leste - R$ 20,00</option>
                  <option value="zona-oeste">Zona Oeste - R$ 20,00</option>
                </select>
              </div>
              
              <div className="flex justify-between">
                <span>Taxa de Entrega</span>
                <span>R$ {deliveryFee.toFixed(2)}</span>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>R$ {orderTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <Button 
              onClick={handleCheckout}
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Processando..." : "Finalizar Compra"}
            </Button>
            
            <p className="text-sm text-gray-500 mt-4">
              * Pagamento processado de forma segura via Stripe.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
