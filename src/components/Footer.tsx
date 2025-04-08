import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">VapesPrime</h3>
            <p className="text-gray-600">
              Sua loja especializada em vapes e acessórios em São Paulo.
            </p>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Categorias</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/categoria/ignite-8000" className="text-gray-600 hover:text-gray-900">
                  Ignite 8000
                </Link>
              </li>
              <li>
                <Link to="/categoria/ignite-15000" className="text-gray-600 hover:text-gray-900">
                  Ignite 15000
                </Link>
              </li>
              <li>
                <Link to="/categoria/coolplay-1500" className="text-gray-600 hover:text-gray-900">
                  Coolplay 1500
                </Link>
              </li>
              <li>
                <Link to="/categoria/lost-mary-10000" className="text-gray-600 hover:text-gray-900">
                  Lost Mary 10000
                </Link>
              </li>
              <li>
                <Link to="/categoria/oxbar-8000" className="text-gray-600 hover:text-gray-900">
                  Oxbar 8000
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Informações</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/sobre" className="text-gray-600 hover:text-gray-900">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link to="/entrega" className="text-gray-600 hover:text-gray-900">
                  Política de Entrega
                </Link>
              </li>
              <li>
                <Link to="/termos" className="text-gray-600 hover:text-gray-900">
                  Termos e Condições
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Contato</h3>
            <p className="text-gray-600">
              Avenida 9 de Julho, 1981
              <br />
              São Paulo - SP
              <br />
              Email: vapesprimebh@gmail.com
              <br />
              Tel: (11) 93415-4811
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} VapesPrime. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
