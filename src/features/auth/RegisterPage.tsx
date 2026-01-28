import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import { Input } from "../../components/Input";
import Button from "../../components/Button";
import { useAppStore } from "../../store/useAppStore";
import { useToast } from "../../components/ToastProvider";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const registerUser = useAppStore((state) => state.registerUser);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const error = registerUser({ name, email, password });
    if (error === "missing_fields") {
      addToast("Preencha todos os campos.", "error");
      return;
    }
    if (error === "email_taken") {
      addToast("E-mail já cadastrado.", "error");
      return;
    }
    addToast("Conta criada!", "success");
    navigate("/dashboard");
  };

  return (
    <AuthLayout>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="text-sm font-semibold">Nome</label>
          <Input value={name} onChange={(event) => setName(event.target.value)} required />
        </div>
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
          Criar conta
        </Button>
        <p className="text-center text-sm text-slate-400">
          Já tem conta?{" "}
          <Link className="text-indigo-300 hover:text-indigo-200" to="/auth/login">
            Fazer login
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default RegisterPage;
