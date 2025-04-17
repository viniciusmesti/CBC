import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import roboImage from '../assets/robo_sentado.png';

export default function LoginPage() {
  const [documentId, setDocumentId] = useState('');
  const [documentType, setDocumentType] = useState<'CPF' | 'CNPJ'>('CPF');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(documentId, documentType);
      navigate('/conversations');
    } catch (error) {
      alert('Erro ao autenticar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="relative bg-white rounded-[24px] shadow-lg px-8 py-12 w-full max-w-sm border border-gray-200">
        <img
          src={roboImage}
          alt="Robô BCB"
          className="absolute -top-20 left-1/2 transform -translate-x-1/2 w-32"
        />
        <h1 className="text-3xl font-bold text-center mb-8 font-sans">BCB</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            placeholder="Insira seu CPF ou CNPJ"
            value={documentId}
            onChange={(e) => setDocumentId(e.target.value)}
            className="w-full px-4 py-3 rounded-[12px] border text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
            required
          />
          <input
            type="password"
            placeholder="Insira sua senha"
            disabled
            className="w-full px-4 py-3 rounded-[12px] border text-sm text-gray-500 bg-gray-100"
          />
          <div className="flex justify-center gap-10 text-sm font-bold text-black">
            <label className="cursor-pointer">
              <input
                type="radio"
                name="documentType"
                value="CPF"
                className="hidden"
                checked={documentType === 'CPF'}
                onChange={() => setDocumentType('CPF')}
              />
              <span className={`border-b-2 ${documentType === 'CPF' ? 'border-black' : 'border-transparent'} pb-1`}>CPF</span>
            </label>
            <label className="cursor-pointer">
              <input
                type="radio"
                name="documentType"
                value="CNPJ"
                className="hidden"
                checked={documentType === 'CNPJ'}
                onChange={() => setDocumentType('CNPJ')}
              />
              <span className={`border-b-2 ${documentType === 'CNPJ' ? 'border-black' : 'border-transparent'} pb-1`}>CNPJ</span>
            </label>
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-cyan-400 text-white text-lg font-bold rounded-full hover:bg-cyan-500 transition-all duration-200"
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
          <p className="text-center text-xs text-gray-600">
            Esqueceu sua senha?{' '}
            <a href="#" className="text-black font-semibold underline">Clique aqui!</a>
          </p>
        </form>
      </div>
    </div>
  );
}
