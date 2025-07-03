import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle, AlertTriangle, Home, LogIn } from 'lucide-react';
import { supabase } from '../lib/supabase';

const PasswordResetPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Verificăm dacă avem un token valid în URL
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const type = params.get('type');
    
    if (!token || type !== 'recovery') {
      setError('Link invalid sau expirat. Te rugăm să soliciți un nou link de resetare a parolei.');
    }
  }, [location]);

  const validatePassword = (password: string): string => {
    if (!password) return 'Parola este obligatorie';
    if (password.length < 8) return 'Parola trebuie să aibă cel puțin 8 caractere';
    if (!/(?=.*[a-z])/.test(password)) return 'Parola trebuie să conțină cel puțin o literă mică';
    if (!/(?=.*[A-Z])/.test(password)) return 'Parola trebuie să conțină cel puțin o literă mare';
    if (!/(?=.*\d)/.test(password)) return 'Parola trebuie să conțină cel puțin o cifră';
    return '';
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    const passwordError = validatePassword(password);
    if (passwordError) errors.password = passwordError;
    
    if (password !== confirmPassword) {
      errors.confirmPassword = 'Parolele nu coincid';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setIsResetting(true);
      setError(null);
      
      // Obținem token-ul din URL
      const params = new URLSearchParams(location.search);
      const token = params.get('token');
      
      if (!token) {
        setError('Link invalid sau expirat. Te rugăm să soliciți un nou link de resetare a parolei.');
        setIsResetting(false);
        return;
      }
      
      // Resetăm parola
      const { error } = await supabase.auth.updateUser({
        password: password
      });
      
      if (error) {
        console.error('Error resetting password:', error);
        setError(error.message || 'A apărut o eroare la resetarea parolei. Te rugăm să încerci din nou.');
        setIsResetting(false);
        return;
      }
      
      // Succes
      setIsSuccess(true);
      setIsResetting(false);
      
      // Redirecționăm către pagina de login după 3 secunde
      setTimeout(() => {
        navigate('/auth');
      }, 3000);
      
    } catch (err) {
      console.error('Error in handleResetPassword:', err);
      setError('A apărut o eroare neașteptată. Te rugăm să încerci din nou sau să contactezi suportul.');
      setIsResetting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img 
            loading="lazy"
              src="/Nexar - logo_black & red.png" 
              alt="Nexar Logo" 
              className="h-24 w-auto"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                if (target.src.includes('Nexar - logo_black & red.png')) {
                  target.src = '/nexar-logo.png';
                } else if (target.src.includes('nexar-logo.png')) {
                  target.src = '/image.png';
                } else {
                  target.style.display = 'none';
                }
              }}
            />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
            Resetare Parolă
          </h2>
          
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                <div>
                  <p className="text-red-700">{error}</p>
                  <Link to="/auth" className="text-nexar-accent hover:text-nexar-gold transition-colors text-sm font-medium mt-2 inline-block">
                    Înapoi la pagina de autentificare
                  </Link>
                </div>
              </div>
            </div>
          )}
          
          {isSuccess ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Parolă resetată cu succes!
              </h3>
              <p className="text-gray-600 mb-6">
                Parola ta a fost actualizată. Vei fi redirecționat către pagina de autentificare în câteva secunde.
              </p>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                <Link
                  to="/auth"
                  className="flex-1 bg-nexar-accent text-white py-3 rounded-lg font-semibold hover:bg-nexar-gold transition-colors flex items-center justify-center space-x-2"
                >
                  <LogIn className="h-5 w-5" />
                  <span>Conectează-te</span>
                </Link>
                <Link
                  to="/"
                  className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors flex items-center justify-center space-x-2"
                >
                  <Home className="h-5 w-5" />
                  <span>Pagina Principală</span>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Parolă Nouă
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full pl-10 pr-10 py-3 border rounded-xl focus:ring-2 focus:ring-nexar-accent focus:border-transparent transition-colors ${
                      validationErrors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Minim 8 caractere"
                  />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {validationErrors.password && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    {validationErrors.password}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Parola trebuie să aibă minim 8 caractere, o literă mare, o literă mică și o cifră.
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmă Parola
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full pl-10 pr-10 py-3 border rounded-xl focus:ring-2 focus:ring-nexar-accent focus:border-transparent transition-colors ${
                      validationErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Repetă parola nouă"
                  />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {validationErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    {validationErrors.confirmPassword}
                  </p>
                )}
              </div>
              
              <button
                type="submit"
                disabled={isResetting}
                className="w-full bg-nexar-accent text-white py-3 rounded-xl font-semibold hover:bg-nexar-gold transition-colors transform hover:scale-105 duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isResetting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Se procesează...</span>
                  </div>
                ) : (
                  'Resetează Parola'
                )}
              </button>
              
              <div className="text-center mt-4">
                <Link to="/auth" className="text-nexar-accent hover:text-nexar-gold transition-colors text-sm">
                  Înapoi la pagina de autentificare
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default PasswordResetPage;