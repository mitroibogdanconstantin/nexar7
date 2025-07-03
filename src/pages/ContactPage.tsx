import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, AlertTriangle } from 'lucide-react';

const ContactPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Numele este obligatoriu';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email-ul este obligatoriu';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Email-ul nu este valid';
    }
    
    if (!formData.subject.trim()) {
      errors.subject = 'Subiectul este obligatoriu';
    }
    
    if (!formData.message.trim()) {
      errors.message = 'Mesajul este obligatoriu';
    } else if (formData.message.trim().length < 10) {
      errors.message = 'Mesajul trebuie să aibă cel puțin 10 caractere';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setSubmitError(null);
    
    // Simulăm trimiterea formularului
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Contact</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Informații de Contact</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-nexar-accent mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Adresă</h3>
                    <p className="text-gray-700">Bulevardul Dem Radulescu 24, Râmnicu Vâlcea</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Phone className="h-5 w-5 text-nexar-accent mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Telefon</h3>
                    <p className="text-gray-700">0790 454 647</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Mail className="h-5 w-5 text-nexar-accent mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Email</h3>
                    <p className="text-gray-700">contact@nexar.ro</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-nexar-accent mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Program</h3>
                    <div className="text-gray-700">
                      <p>Luni - Vineri: 09:00 - 17:00</p>
                      <p>Weekend: Închis</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Locația Noastră</h2>
                <div className="bg-gray-200 rounded-lg h-64 overflow-hidden">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2833.368629856657!2d24.36612687678971!3d45.10300196280406!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x474d8a1a5a9e2bb9%3A0x7e5d9a3db1f73eac!2sBulevardul%20Dem%20R%C4%83dulescu%2C%20R%C3%A2mnicu%20V%C3%A2lcea!5e0!3m2!1sro!2sro!4v1687954611544!5m2!1sro!2sro" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Trimite-ne un Mesaj</h2>
              
              {submitSuccess && (
                <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 animate-fade-in">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-green-800">Mesaj trimis cu succes!</h3>
                      <p className="text-green-700 text-sm">Îți mulțumim pentru mesaj. Te vom contacta în cel mai scurt timp posibil.</p>
                    </div>
                  </div>
                </div>
              )}
              
              {submitError && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 animate-fade-in">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-red-800">Eroare la trimiterea mesajului</h3>
                      <p className="text-red-700 text-sm">{submitError}</p>
                    </div>
                  </div>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nume complet *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-nexar-accent focus:border-transparent ${
                      formErrors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Numele tău"
                  />
                  {formErrors.name && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-nexar-accent focus:border-transparent ${
                      formErrors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="email@exemplu.com"
                  />
                  {formErrors.email && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefon
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-nexar-accent focus:border-transparent"
                    placeholder="0790 45 46 47"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subiect *
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-nexar-accent focus:border-transparent ${
                      formErrors.subject ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Selectează un subiect</option>
                    <option value="Întrebare generală">Întrebare generală</option>
                    <option value="Suport tehnic">Suport tehnic</option>
                    <option value="Probleme cu contul">Probleme cu contul</option>
                    <option value="Probleme cu anunțurile">Probleme cu anunțurile</option>
                    <option value="Sugestii">Sugestii</option>
                    <option value="Altele">Altele</option>
                  </select>
                  {formErrors.subject && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.subject}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mesaj *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={5}
                    className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-nexar-accent focus:border-transparent ${
                      formErrors.message ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Scrie mesajul tău aici..."
                  ></textarea>
                  {formErrors.message && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.message}</p>
                  )}
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-nexar-accent text-white py-3 rounded-lg font-semibold hover:bg-nexar-gold transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Se trimite...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      <span>Trimite Mesaj</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;