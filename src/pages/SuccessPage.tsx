import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { CheckCircle } from 'lucide-react';

const SuccessPage = () => {
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (sessionId) {
      clearCart();
    }
  }, [sessionId, clearCart]);

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="max-w-md mx-auto">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
        <h1 className="text-3xl font-bold mb-4">Pagamento Confirmado!</h1>
        <p className="text-gray-600 mb-8">
          Obrigado pela sua compra! Você receberá um e-mail com os detalhes do seu pedido.
        </p>
        <div className="space-y-4">
          <Link to="/">
            <Button className="w-full">Voltar para a Loja</Button>
          </Link>
          <p className="text-sm text-gray-500">
            ID da transação: {sessionId}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage; 