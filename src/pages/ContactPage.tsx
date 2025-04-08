import { MapPin, Mail, Phone, Clock } from "lucide-react";

const ContactPage = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center"></h1>

      <div className="max-w-2xl mx-auto">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-6 text-center">Informações de Contato</h2>

          <div className="space-y-6">
            <div className="flex items-start">
              <MapPin className="h-6 w-6 text-gray-600 mr-4 mt-1" />
              <div>
                <h3 className="font-medium text-lg">Endereço</h3>
                <p className="text-gray-600">Avenida 9 de Julho, 1981</p>
                <p className="text-gray-600">São Paulo - SP</p>
              </div>
            </div>

            <div className="flex items-start">
              <Mail className="h-6 w-6 text-gray-600 mr-4 mt-1" />
              <div>
                <h3 className="font-medium text-lg">Email</h3>
                <p className="text-gray-600">vapesprimebh@gmail.com</p>
              </div>
            </div>

            <div className="flex items-start">
              <Phone className="h-6 w-6 text-gray-600 mr-4 mt-1" />
              <div>
                <h3 className="font-medium text-lg">Telefone</h3>
                <p className="text-gray-600">(11) 93415-4811</p>
              </div>
            </div>

            <div className="flex items-start">
              <Clock className="h-6 w-6 text-gray-600 mr-4 mt-1" />
              <div>
                <h3 className="font-medium text-lg">Horário de Atendimento</h3>
                <p className="text-gray-600">Segunda a Sexta: 9h às 22h</p>
                <p className="text-gray-600">Sábado e Domingo: 9h às 22h</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
