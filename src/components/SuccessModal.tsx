import React from 'react';
import { CheckCircle, Home, Eye } from 'lucide-react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoHome: () => void;
  onViewListing?: () => void;
  title?: string;
  message?: string;
  showViewButton?: boolean;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  onGoHome,
  onViewListing,
  title = "Felicitări!",
  message = "Anunțul a fost publicat cu succes!",
  showViewButton = false
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 animate-scale-in">
        {/* Header cu animație */}
        <div className="text-center p-8 pb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            {title}
          </h2>
          
          <p className="text-gray-600 leading-relaxed">
            {message}
          </p>
        </div>

        {/* Buttons */}
        <div className="px-8 pb-8">
          <div className="space-y-3">
            {/* Buton principal - Mergi la pagina principală */}
            <button
              onClick={onGoHome}
              className="w-full bg-nexar-accent text-white py-4 rounded-xl font-semibold hover:bg-nexar-gold transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2 shadow-lg"
            >
              <Home className="h-5 w-5" />
              <span>Mergi la Pagina Principală</span>
            </button>

            {/* Buton secundar - Vezi anunțul (opțional) */}
            {showViewButton && onViewListing && (
              <button
                onClick={onViewListing}
                className="w-full bg-gray-100 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <Eye className="h-5 w-5" />
                <span>Vezi Anunțul</span>
              </button>
            )}

            {/* Buton pentru închidere */}
            <button
              onClick={onClose}
              className="w-full text-gray-500 py-2 rounded-xl font-medium hover:text-gray-700 transition-colors"
            >
              Închide
            </button>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-4 left-4 w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
        <div className="absolute top-6 right-6 w-1 h-1 bg-green-300 rounded-full animate-pulse"></div>
        <div className="absolute bottom-8 left-6 w-1.5 h-1.5 bg-green-200 rounded-full animate-bounce"></div>
      </div>
    </div>
  );
};

export default SuccessModal;