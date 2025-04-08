import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

const AuthPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const { signIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Debug: Verificar se as variáveis de ambiente estão disponíveis
  useEffect(() => {
    console.log("Variáveis de ambiente disponíveis:", {
      adminEmail: import.meta.env.VITE_ADMIN_EMAIL,
      hasAdminPassword: !!import.meta.env.VITE_ADMIN_PASSWORD,
    });
  }, []);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError(null);
    
    try {
      console.log("Tentando fazer login com:", { email });
      
      // Proceed with sign in
      const { error, success } = await signIn(email, password);
      
      if (error) {
        console.error("Login error details:", error);
        if (error.message.includes("Email not confirmed")) {
          setLoginError("Este email ainda não foi confirmado. Por favor, verifique sua caixa de entrada.");
        } else if (error.message.includes("Invalid login credentials")) {
          throw new Error("Email ou senha incorretos. Tente novamente.");
        } else {
          throw error;
        }
      }
      
      if (success) {
        toast({
          title: "Login realizado com sucesso",
          description: "Bem-vindo ao painel administrativo.",
        });
        navigate("/admin");
      }
    } catch (error: any) {
      console.error("Error during authentication:", error);
      setLoginError(
        error.message || "Email ou senha incorretos. Tente novamente."
      );
      toast({
        title: "Erro ao fazer login",
        description: error.message || "Email ou senha incorretos. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetAdminPassword = async () => {
    setIsLoading(true);
    setLoginError(null);
    
    try {
      const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
      const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;

      if (!adminEmail || !adminPassword) {
        throw new Error("Credenciais de administrador não configuradas no arquivo .env");
      }

      console.log("Tentando resetar senha do admin:", adminEmail);
      
      // Primeiro, tenta fazer login com as credenciais atuais
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: adminEmail,
        password: adminPassword,
      });

      if (signInError) {
        // Se não conseguir fazer login, tenta criar uma nova conta
        const { error: signUpError } = await supabase.auth.signUp({
          email: adminEmail,
          password: adminPassword,
        });

        if (signUpError) {
          if (signUpError.message.includes("already registered")) {
            // Se a conta já existe, tenta resetar a senha
            const { error: resetError } = await supabase.auth.resetPasswordForEmail(adminEmail, {
              redirectTo: window.location.origin + '/admin',
            });

            if (resetError) {
              throw resetError;
            }

            toast({
              title: "Email de reset enviado",
              description: "Verifique sua caixa de entrada para redefinir a senha.",
            });
          } else {
            throw signUpError;
          }
        } else {
          toast({
            title: "Conta criada com sucesso",
            description: "A conta de administrador foi criada. Você pode fazer login agora.",
          });
        }
      } else {
        toast({
          title: "Login bem sucedido",
          description: "As credenciais estão corretas.",
        });
        navigate("/admin");
      }
    } catch (error: any) {
      console.error("Error resetting admin password:", error);
      setLoginError(error.message || "Erro ao resetar senha do administrador.");
      toast({
        title: "Erro ao resetar senha",
        description: error.message || "Não foi possível resetar a senha do administrador.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Área Administrativa
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Faça login para acessar o painel de administração
          </p>
        </div>
        
        {loginError && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{loginError}</AlertDescription>
          </Alert>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSignIn}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">Email</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Senha</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Senha"
              />
            </div>
          </div>

          <div className="flex flex-col space-y-3">
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Entrando...
                </>
              ) : (
                "Entrar"
              )}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={resetAdminPassword}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Resetando...
                </>
              ) : (
                "Resetar/Criar conta de administrador"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
