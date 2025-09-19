import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

function ActivatePage() {
  const { token } = useParams();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('Activating your account...');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Activation token not found.');
      return;
    }

    const activateAccount = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/auth/activate/${token}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Activation failed.');
        }

        setStatus('success');
        setMessage(data.message);
      } catch (err: any) {
        setStatus('error');
        setMessage(err.message);
      }
    };

    activateAccount();
  }, [token]);

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="text-center">
            <p className="text-gray-300">{message}</p>
          </div>
        );

      case 'success':
        return (
          <>
            <img
              src="https://i.imgur.com/your-white-logo.png"
              alt="Synode Logo"
              className="w-24 mx-auto mb-10 opacity-80"
            />

            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-20 h-20 text-green-400 mx-auto mb-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>

            <h1 className="text-3xl font-bold text-white mb-2">Account Activated</h1>
            <p className="text-gray-300 mb-6">{message || 'Your email address has been confirmed.'}</p>

            <Link
              to="/login"
              className="block w-full py-3 rounded-md bg-cyan-600 hover:bg-cyan-500 font-semibold text-white transition-colors"
            >
              Go to Login
            </Link>
          </>
        );

      case 'error':
        return (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-20 h-20 text-red-400 mx-auto mb-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>

            <h2 className="text-2xl font-bold text-red-400 mb-2">Something went wrong</h2>
            <p className="text-gray-300 mb-6">{message}</p>

            <Link
              to="/signup"
              className="text-cyan-400 hover:text-cyan-300 font-medium"
            >
              Try signing up again
            </Link>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#0f2a36] to-[#103036] flex items-center justify-center px-4 text-white">
      <div className="w-full max-w-md bg-black bg-opacity-30 backdrop-blur-md p-10 rounded-xl shadow-xl text-center">
        {renderContent()}
      </div>
    </div>
  );
}

export default ActivatePage;
