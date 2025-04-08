import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, Upload, X } from "lucide-react";
import { ProductDescription } from "@/vite-env";

interface Categoria {
  id: string;
  nome: string;
}

interface ProdutoFormProps {
  isEditing?: boolean;
}

const ProdutoForm = ({ isEditing = false }: ProdutoFormProps) => {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");
  const [estoque, setEstoque] = useState("");
  const [comentarios, setComentarios] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [imagePath, setImagePath] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditing);
  
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchCategorias();
    
    if (isEditing && id) {
      fetchProduto(id);
    }
  }, [isEditing, id]);

  const fetchCategorias = async () => {
    try {
      const { data, error } = await supabase
        .from("categorias")
        .select("id, nome")
        .order("nome");

      if (error) throw error;
      setCategorias(data || []);
    } catch (error) {
      console.error("Error fetching categorias:", error);
      toast({
        title: "Erro ao carregar categorias",
        description: "Houve um problema ao buscar as categorias.",
        variant: "destructive",
      });
    }
  };

  const fetchProduto = async (produtoId: string) => {
    try {
      const { data, error } = await supabase
        .from("produtos")
        .select("*")
        .eq("id", produtoId)
        .single();

      if (error) throw error;
      
      if (data) {
        setNome(data.nome || "");
        setDescricao(data.descricao?.texto || "");
        setPreco(data.preco?.toString() || "");
        setEstoque(data.estoque?.toString() || "");
        setComentarios(data.comentarios || "");
        setCategoriaId(data.categoria_id || "");
        setImageUrl(data.imagem_url || "");
        setImagePath(data.imagem_path || "");
        
        // Set preview image
        if (data.imagem_url) {
          setPreviewUrl(data.imagem_url);
        } else if (data.imagem_path) {
          const { data: { publicUrl } } = supabase.storage
            .from('produtos')
            .getPublicUrl(data.imagem_path);
          setPreviewUrl(publicUrl);
        }
      }
    } catch (error) {
      console.error("Error fetching produto:", error);
      toast({
        title: "Erro ao carregar produto",
        description: "Não foi possível carregar os dados do produto.",
        variant: "destructive",
      });
    } finally {
      setInitialLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleExternalImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value);
    if (e.target.value) {
      setPreviewUrl(e.target.value);
      setImageFile(null);
      setImagePath("");
    }
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return null;
    
    try {
      setUploading(true);
      
      // Create a unique file path
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;
      
      // Upload to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from('produtos')
        .upload(filePath, imageFile, {
          cacheControl: '3600',
          upsert: false
        });
        
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('produtos')
        .getPublicUrl(filePath);
      
      return filePath;
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Erro ao enviar imagem",
        description: "Não foi possível enviar a imagem para o servidor.",
        variant: "destructive",
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const clearImage = () => {
    setImageFile(null);
    setPreviewUrl("");
    setImageUrl("");
    setImagePath("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (nome.trim() === "") {
        throw new Error("O nome do produto é obrigatório");
      }

      const precoValue = parseFloat(preco.replace(",", "."));
      if (isNaN(precoValue) || precoValue <= 0) {
        throw new Error("O preço deve ser um número válido maior que zero");
      }

      const estoqueValue = parseInt(estoque);
      if (isNaN(estoqueValue) || estoqueValue < 0) {
        throw new Error("O estoque deve ser um número válido maior ou igual a zero");
      }

      // Upload image if a new file is selected
      let newImagePath = imagePath;
      if (imageFile) {
        const uploadedPath = await uploadImage();
        if (uploadedPath) {
          newImagePath = uploadedPath;
        }
      }

      // Prepare the description as a JSONB object
      const descricaoObj: ProductDescription = {
        texto: descricao || null,
        imagens: []
      };

      const produtoData = {
        nome,
        descricao: descricaoObj,
        preco: precoValue,
        estoque: estoqueValue,
        comentarios: comentarios || null,
        categoria_id: categoriaId || null,
        imagem_url: imageUrl || null,
        imagem_path: newImagePath || null
      };

      if (isEditing && id) {
        // Update existing produto
        const { error } = await supabase
          .from("produtos")
          .update(produtoData)
          .eq("id", id);

        if (error) throw error;
        
        toast({
          title: "Produto atualizado",
          description: "O produto foi atualizado com sucesso.",
        });
      } else {
        // Create new produto
        const { error } = await supabase
          .from("produtos")
          .insert([produtoData]);

        if (error) throw error;
        
        toast({
          title: "Produto criado",
          description: "O produto foi criado com sucesso.",
        });
      }
      
      // Redirect to produtos list
      navigate("/admin/produtos");
    } catch (error: any) {
      console.error("Error saving produto:", error);
      toast({
        title: "Erro ao salvar produto",
        description: error.message || "Ocorreu um erro ao salvar o produto.",
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
          onClick={() => navigate("/admin/produtos")}
          className="mr-4"
        >
          <ChevronLeft className="h-4 w-4 mr-1" /> Voltar
        </Button>
        <h1 className="text-2xl font-bold">
          {isEditing ? "Editar Produto" : "Novo Produto"}
        </h1>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
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

            <div>
              <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 mb-1">
                Categoria
              </label>
              <select
                id="categoria"
                value={categoriaId}
                onChange={(e) => setCategoriaId(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Selecione uma categoria</option>
                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nome}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="preco" className="block text-sm font-medium text-gray-700 mb-1">
                Preço *
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  R$
                </span>
                <input
                  type="text"
                  id="preco"
                  value={preco}
                  onChange={(e) => setPreco(e.target.value.replace(/[^0-9.,]/g, ''))}
                  className="w-full p-2 pl-10 border border-gray-300 rounded-md"
                  placeholder="0,00"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="estoque" className="block text-sm font-medium text-gray-700 mb-1">
                Estoque *
              </label>
              <input
                type="number"
                id="estoque"
                value={estoque}
                min="0"
                onChange={(e) => setEstoque(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
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
              rows={3}
            />
          </div>

          {/* Image Upload Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Imagem do Produto
            </label>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Image Upload */}
              <div>
                <label htmlFor="image-upload" className="block text-sm text-gray-600 mb-1">
                  Enviar nova imagem
                </label>
                <div className="flex items-center space-x-2">
                  <label className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
                    <Upload className="h-4 w-4 mr-2" />
                    Selecionar Arquivo
                    <input
                      id="image-upload"
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={handleImageChange}
                      disabled={!!imageUrl}
                    />
                  </label>
                  {(imageFile || imagePath) && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={clearImage}
                    >
                      <X className="h-4 w-4 mr-1" /> Remover
                    </Button>
                  )}
                </div>
              </div>
              
              {/* External URL */}
              <div>
                <label htmlFor="image-url" className="block text-sm text-gray-600 mb-1">
                  Ou usar URL externa
                </label>
                <input
                  type="url"
                  id="image-url"
                  value={imageUrl}
                  onChange={handleExternalImageUrlChange}
                  placeholder="https://exemplo.com/imagem.jpg"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  disabled={!!(imageFile || imagePath)}
                />
              </div>
            </div>
            
            {/* Image Preview */}
            {previewUrl && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Pré-visualização:</p>
                <div className="relative w-40 h-40 border border-gray-200 rounded-md overflow-hidden">
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="w-full h-full object-contain"
                    onError={() => {
                      toast({
                        title: "Erro na imagem",
                        description: "Não foi possível carregar a imagem da URL fornecida.",
                        variant: "destructive",
                      });
                      setPreviewUrl("");
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="mb-6">
            <label htmlFor="comentarios" className="block text-sm font-medium text-gray-700 mb-1">
              Comentários Adicionais
            </label>
            <textarea
              id="comentarios"
              value={comentarios}
              onChange={(e) => setComentarios(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              rows={3}
            />
          </div>

          <div className="flex justify-end">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate("/admin/produtos")}
              className="mr-2"
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={loading || uploading}
            >
              {loading || uploading ? "Salvando..." : isEditing ? "Atualizar" : "Criar"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProdutoForm;
