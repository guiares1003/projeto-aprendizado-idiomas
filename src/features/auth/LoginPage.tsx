import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import { Input } from "../../components/Input";
import Button from "../../components/Button";
import { useAppStore } from "../../store/useAppStore";
import { useToast } from "../../components/ToastProvider";

const LoginPage = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const loginUser = useAppStore((state) => state.loginUser);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const error = loginUser({ email, password });
    if (error === "missing_fields") {
      addToast("Preencha e-mail e senha.", "error");
      return;
    }
    if (error === "invalid_credentials") {
      addToast("Credenciais inválidas.", "error");
      return;
    }
    addToast("Login realizado!", "success");
    navigate("/dashboard");
  };

  return (
    <AuthLayout>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="text-sm font-semibold">E-mail</label>
          <Input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>
        <div>
          <label className="text-sm font-semibold">Senha</label>
          <Input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full">
          Entrar
        </Button>
        <p className="text-center text-sm text-slate-500">
          Ainda não tem conta?{" "}
          <Link className="text-indigo-300 hover:text-indigo-200" to="/auth/register">
            Criar conta
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;
