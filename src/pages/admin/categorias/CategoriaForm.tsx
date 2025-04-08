
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft } from "lucide-react";

interface CategoriaFormProps {
  isEditing?: boolean;
}

const CategoriaForm = ({ isEditing = false }: CategoriaFormProps) => {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditing);
  
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (isEditing && id) {
      fetchCategoria(id);
    }
  }, [isEditing, id]);

  const fetchCategoria = async (categoriaId: string) => {
    try {
      const { data, error } = await supabase
        .from("categorias")
        .select("*")
        .eq("id", categoriaId)
        .single();

      if (error) throw error;
      
      if (data) {
        setNome(data.nome || "");
        setDescricao(data.descricao || "");
      }
    } catch (error: any) {
      console.error("Error fetching categoria:", error);
      toast({
        title: "Erro ao carregar categoria",
        description: "Não foi possível carregar os dados da categoria.",
        variant: "destructive",
      });
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (nome.trim() === "") {
        throw new Error("O nome da categoria é obrigatório");
      }

      if (isEditing && id) {
        // Update existing categoria
        const { error } = await supabase
          .from("categorias")
          .update({
            nome,
            descricao: descricao || null,
          })
          .eq("id", id);

        if (error) throw error;
        
        toast({
          title: "Categoria atualizada",
          description: "A categoria foi atualizada com sucesso.",
        });
      } else {
        // Create new categoria
        const { error } = await supabase
          .from("categorias")
          .insert([
            {
              nome,
              descricao: descricao || null,
            },
          ]);

        if (error) throw error;
        
        toast({
          title: "Categoria criada",
          description: "A categoria foi criada com sucesso.",
        });
      }
      
      // Redirect to categorias list
      navigate("/admin/categorias");
    } catch (error: any) {
      console.error("Error saving categoria:", error);
      toast({
        title: "Erro ao salvar categoria",
        description: error.message || "Ocorreu um erro ao salvar a categoria.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/admin/categorias")}
          className="mr-4"
        >
          <ChevronLeft className="h-4 w-4 mr-1" /> Voltar
        </Button>
        <h1 className="text-2xl font-bold">
          {isEditing ? "Editar Categoria" : "Nova Categoria"}
        </h1>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
              Nome *
            </label>
            <input
              type="text"
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <textarea
              id="descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              rows={4}
            />
          </div>

          <div className="flex justify-end">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate("/admin/categorias")}
              className="mr-2"
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
            >
              {loading ? "Salvando..." : isEditing ? "Atualizar" : "Criar"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoriaForm;
