import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ConversationsPage from './pages/ConversationsPage';
import ChatPage from './pages/ChatPage';
import NewConversationPage from './pages/NewConversationPage';
import { AuthProvider } from './contexts/AuthContext';
import TransactionsPage from './pages/TransactionsPage';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/conversations" element={<ConversationsPage />} />
          <Route path="/conversations/new" element={<NewConversationPage />} />
          <Route path="/conversations/:id" element={<ChatPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
