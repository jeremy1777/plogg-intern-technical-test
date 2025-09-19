import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useEffect } from 'react';

function ConfirmEmailPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate('/signup');
    }
  }, [email, navigate]);

  const handleResendEmail = () => {
    alert('Resend email feature is not implemented yet.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#0f2a36] to-[#103036] flex items-center justify-center px-4 text-white relative">
      
      <div className="absolute top-6 left-6">
        <Link
          to="/login"
          className="flex items-center gap-2 text-gray-400 hover:text-cyan-300 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back to Login
        </Link>
      </div>

      <div className="w-full max-w-xl bg-black bg-opacity-30 backdrop-blur-md p-10 rounded-xl shadow-lg text-center">
        <h1 className="text-4xl font-bold text-cyan-400 tracking-widest mb-2">synode</h1>
        <h2 className="text-2xl font-semibold text-white mb-6">Confirm your email address</h2>

        <ul className="text-left text-sm text-gray-300 space-y-3 mb-8 list-disc list-inside">
          <li>
            A confirmation email has been sent to: <strong className="text-white">{email || 'your email'}</strong>
          </li>
          <li>
            It may take up to 5 minutes to arrive. Please check your inbox and spam folder.
          </li>
          <li>
            Click the link in the email to activate your account.
          </li>
        </ul>

        <button
          onClick={handleResendEmail}
          className="w-full py-3 px-4 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-md font-semibold text-white transition-colors"
        >
          Resend Email
        </button>
      </div>
    </div>
  );
}

export default ConfirmEmailPage;
