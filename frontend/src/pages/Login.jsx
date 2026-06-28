import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Fish, Lock, Mail, AlertCircle } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setValidationErrors({});
    setIsSubmitting(true);

    if (!email || !password) {
      setErrorMsg('Semua kolom wajib diisi.');
      setIsSubmitting(false);
      return;
    }

    const result = await login(email, password);

    if (result.success) {
      navigate('/dashboard');
    } else {
      if (result.errors) {
        setValidationErrors(result.errors);
      } else {
        setErrorMsg(result.message);
      }
    }
    setIsSubmitting(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      {/* Background decoration */}
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-cyan-500/10 rounded-full blur-[80px] -z-10"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[80px] -z-10"></div>

      <div className="w-full max-w-md p-8 glass rounded-2xl border border-slate-800 shadow-2xl">
        <div className="flex flex-col items-center gap-2 mb-8">
          <Link to="/" className="flex items-center gap-2">
            <Fish className="h-10 w-10 text-cyan-400 animate-pulse-cyan" />
            <div>
              <span className="font-bold text-xl tracking-wider text-cyan-400">F-RISK</span>
              <p className="text-[10px] text-slate-400 -mt-1 tracking-widest font-mono">WATER MONITOR</p>
            </div>
          </Link>
          <h2 className="mt-4 text-xl font-bold text-slate-200">Masuk ke Dashboard</h2>
          <p className="text-xs text-slate-400">Gunakan akun terdaftar Anda untuk memantau tambak</p>
        </div>

        {errorMsg && (
          <div className="mb-4 flex items-center gap-2 p-3 rounded-xl bg-red-950/40 border border-red-800 text-red-400 text-xs font-medium">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-xs font-semibold text-slate-300 mb-1">Alamat Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                autoComplete="username"
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:outline-none rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 transition-colors"
                required
              />
            </div>
            {validationErrors.email && (
              <span className="text-[10px] text-red-400 mt-1 block">{validationErrors.email[0]}</span>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-semibold text-slate-300 mb-1">Kata Sandi</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                autoComplete="current-password"
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:outline-none rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 transition-colors"
                required
              />
            </div>
            {validationErrors.password && (
              <span className="text-[10px] text-red-400 mt-1 block">{validationErrors.password[0]}</span>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-slate-950 font-bold text-xs shadow-md transition-all duration-300 hover:shadow-cyan-500/10 flex items-center justify-center"
          >
            {isSubmitting ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950 border-t-transparent"></div>
            ) : (
              'Masuk Sekarang'
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400">
          Belum punya akun?{' '}
          <Link to="/register" className="font-semibold text-cyan-400 hover:underline">
            Daftar di sini
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
