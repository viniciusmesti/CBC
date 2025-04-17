// src/pages/LoginPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import roboImage from '../assets/robo_sentado.png';
import roboCpf from '../assets/robo_cpf.png';
import roboCnpj from '../assets/robo_cnpj.png';
import { FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { IMaskInput } from 'react-imask';

export default function LoginPage() {
  const [documentId, setDocumentId] = useState('');
  const [documentType, setDocumentType] = useState<'CPF' | 'CNPJ'>('CPF');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const [robotVisible, setRobotVisible] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);
    try {
      await login(documentId.replace(/\D/g, ''), documentType);
      navigate('/conversations');
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || 'Falha ao autenticar');
    } finally {
      setLoading(false);
    }
  };

  const mask = documentType === 'CPF'
    ? '000.000.000-00'
    : '00.000.000/0000-00';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-white px-4">
      <motion.div
        className="relative bg-white rounded-2xl shadow-xl px-8 py-16 w-full max-w-sm border border-gray-200"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <motion.img
          src={roboImage}
          alt="Robô BCB"
          className="absolute -top-40 left-1/2 transform -translate-x-1/2 w-44 h-w-44"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        />
        <h1 className="text-3xl font-bold text-center mb-8 font-sans">BCB</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* CPF/CNPJ Input com máscara */}
          <div className="relative">
            <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <IMaskInput
              mask={mask}
              unmask={true}          
              value={documentId}
              onAccept={(value: string) => setDocumentId(value)}
              className="w-full pl-10 pr-4 py-3 rounded-full border text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
              placeholder="CPF ou CNPJ"
              required
            />
          </div>

          {/* Toggle CPF / CNPJ */}
          <div className="flex justify-center gap-10 text-sm font-bold">
            {(['CPF', 'CNPJ'] as const).map(type => (
              <button
                key={type}
                type="button"
                onClick={() => {
                  setDocumentType(type);
                  setRobotVisible(true);
                }}
                className={`pb-1 ${documentType === type ? 'border-b-2 border-black' : 'border-transparent'}`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Robô só aparece após clique */}
          {robotVisible && (
            <div className="flex justify-center mt-4 mb-2">
              <motion.img
                src={documentType === 'CPF' ? roboCpf : roboCnpj}
                alt={`Robô ${documentType}`}
                className="  left-1/2  transform -translate-x-1/2 w-20 h-w-20"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              />
            </div>
          )}



          {/* Mensagem de erro */}
          {errorMsg && (
            <p className="text-center text-red-500 text-sm">{errorMsg}</p>
          )}

          {/* Botão de envio */}
          <motion.button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-3 bg-cyan-400 text-white text-lg font-bold rounded-full hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-colors"
            disabled={loading}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
