import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ActivatePage from './pages/ActivatePage';
import ConfirmEmailPage from './pages/ConfirmEmailPage';
import DashBoardPage from './pages/DashBoardPage';

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<LoginPage />} />
      <Route path="/signup" element={<RegisterPage />} />
      <Route path="/activate/:token" element={<ActivatePage />} />
      <Route path="/confirm-email" element={<ConfirmEmailPage />} />

      <Route path="/dashboard" element={<DashBoardPage />} />
    </Routes>
  </BrowserRouter>
  // </React.StrictMode>
);