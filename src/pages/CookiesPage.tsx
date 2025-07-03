import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Cookie, Settings, BarChart3, Target, Shield, Check, X, RefreshCw } from 'lucide-react';

const CookiesPage = () => {
  const [cookiePreferences, setCookiePreferences] = useState({
    essential: true, // Always true, cannot be disabled
    analytics: false,
    marketing: false,
    functional: false
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Load saved preferences from localStorage
    const savedPreferences = localStorage.getItem('cookiePreferences');
    if (savedPreferences) {
      setCookiePreferences({
        ...JSON.parse(savedPreferences),
        essential: true // Always ensure essential is true
      });
    }
  }, []);

  const handlePreferenceChange = (type: string, value: boolean) => {
    if (type === 'essential') return; // Cannot change essential cookies
    
    const newPreferences = {
      ...cookiePreferences,
      [type]: value
    };
    
    setCookiePreferences(newPreferences);
    localStorage.setItem('cookiePreferences', JSON.stringify(newPreferences));
  };

  const acceptAll = () => {
    const allAccepted = {
      essential: true,
      analytics: true,
      marketing: true,
      functional: true
    };
    setCookiePreferences(allAccepted);
    localStorage.setItem('cookiePreferences', JSON.stringify(allAccepted));
  };

  const rejectAll = () => {
    const onlyEssential = {
      essential: true,
      analytics: false,
      marketing: false,
      functional: false
    };
    setCookiePreferences(onlyEssential);
    localStorage.setItem('cookiePreferences', JSON.stringify(onlyEssential));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-nexar-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Cookie className="h-8 w-8 text-nexar-accent" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Politica de Cookies</h1>
            <p className="text-gray-600">
              Ultima actualizare: 18 Decembrie 2024
            </p>
          </div>

          {/* Cookie Preferences Panel */}
          <div className="bg-nexar-accent/5 border border-nexar-accent/20 rounded-xl p-6 mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <Settings className="h-6 w-6 text-nexar-accent" />
              <h2 className="text-xl font-bold text-gray-900">Setările Cookie-urilor</h2>
            </div>
            
            <div className="space-y-4">
              {/* Essential Cookies */}
              <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-green-600" />
                    <h3 className="font-semibold text-gray-900">Cookie-uri Esențiale</h3>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Necesare pentru funcționarea de bază a site-ului</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-green-600 font-medium">Întotdeauna Active</span>
                  <div className="w-12 h-6 bg-green-500 rounded-full flex items-center justify-end px-1">
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Analytics Cookies */}
              <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold text-gray-900">Cookie-uri de Analiză</h3>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Ne ajută să înțelegem cum utilizați site-ul</p>
                </div>
                <button
                  onClick={() => handlePreferenceChange('analytics', !cookiePreferences.analytics)}
                  className={`w-12 h-6 rounded-full flex items-center transition-colors ${
                    cookiePreferences.analytics ? 'bg-nexar-accent justify-end' : 'bg-gray-300 justify-start'
                  } px-1`}
                >
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                </button>
              </div>

              {/* Marketing Cookies */}
              <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <Target className="h-5 w-5 text-purple-600" />
                    <h3 className="font-semibold text-gray-900">Cookie-uri de Marketing</h3>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Pentru personalizarea reclamelor și conținutului</p>
                </div>
                <button
                  onClick={() => handlePreferenceChange('marketing', !cookiePreferences.marketing)}
                  className={`w-12 h-6 rounded-full flex items-center transition-colors ${
                    cookiePreferences.marketing ? 'bg-nexar-accent justify-end' : 'bg-gray-300 justify-start'
                  } px-1`}
                >
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                </button>
              </div>

              {/* Functional Cookies */}
              <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <Settings className="h-5 w-5 text-orange-600" />
                    <h3 className="font-semibold text-gray-900">Cookie-uri Funcționale</h3>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Pentru funcții avansate și personalizare</p>
                </div>
                <button
                  onClick={() => handlePreferenceChange('functional', !cookiePreferences.functional)}
                  className={`w-12 h-6 rounded-full flex items-center transition-colors ${
                    cookiePreferences.functional ? 'bg-nexar-accent justify-end' : 'bg-gray-300 justify-start'
                  } px-1`}
                >
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button
                onClick={acceptAll}
                className="flex-1 bg-nexar-accent text-white py-3 px-6 rounded-lg font-semibold hover:bg-nexar-gold transition-colors flex items-center justify-center space-x-2"
              >
                <Check className="h-4 w-4" />
                <span>Acceptă Toate</span>
              </button>
              <button
                onClick={rejectAll}
                className="flex-1 bg-gray-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-600 transition-colors flex items-center justify-center space-x-2"
              >
                <X className="h-4 w-4" />
                <span>Doar Esențiale</span>
              </button>
            </div>
          </div>

          <div className="prose max-w-none">
            {/* Ce sunt Cookie-urile */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Ce sunt Cookie-urile?</h2>
              <p className="text-gray-700 mb-4">
                Cookie-urile sunt fișiere mici de text care sunt stocate pe dispozitivul dvs. (computer, telefon, tabletă) când vizitați un site web. Ele sunt utilizate pe scară largă pentru a face site-urile web să funcționeze mai eficient și pentru a furniza informații proprietarilor site-ului.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">Tipuri de Cookie-uri:</h3>
                <ul className="list-disc list-inside space-y-1 text-blue-700 text-sm">
                  <li><strong>Cookie-uri de sesiune:</strong> Se șterg când închideți browser-ul</li>
                  <li><strong>Cookie-uri persistente:</strong> Rămân pe dispozitiv pentru o perioadă determinată</li>
                  <li><strong>Cookie-uri first-party:</strong> Setate de site-ul pe care îl vizitați</li>
                  <li><strong>Cookie-uri third-party:</strong> Setate de alte site-uri (ex: Google Analytics)</li>
                </ul>
              </div>
            </section>

            {/* Cum folosim Cookie-urile */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Cum Folosim Cookie-urile</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <Shield className="h-6 w-6 text-green-600" />
                    <h3 className="text-lg font-semibold text-green-800">Cookie-uri Esențiale</h3>
                  </div>
                  <p className="text-green-700 text-sm mb-3">Aceste cookie-uri sunt absolut necesare pentru funcționarea site-ului și nu pot fi dezactivate.</p>
                  <ul className="list-disc list-inside space-y-1 text-green-700 text-sm">
                    <li>Autentificare și securitate</li>
                    <li>Preferințele de limbă</li>
                    <li>Coșul de cumpărături</li>
                    <li>Setările de confidențialitate</li>
                  </ul>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <BarChart3 className="h-6 w-6 text-blue-600" />
                    <h3 className="text-lg font-semibold text-blue-800">Cookie-uri de Analiză</h3>
                  </div>
                  <p className="text-blue-700 text-sm mb-3">Ne ajută să înțelegem cum interactionați cu site-ul nostru.</p>
                  <ul className="list-disc list-inside space-y-1 text-blue-700 text-sm">
                    <li>Google Analytics</li>
                    <li>Statistici de vizitare</li>
                    <li>Comportamentul utilizatorilor</li>
                    <li>Optimizarea performanței</li>
                  </ul>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <Target className="h-6 w-6 text-purple-600" />
                    <h3 className="text-lg font-semibold text-purple-800">Cookie-uri de Marketing</h3>
                  </div>
                  <p className="text-purple-700 text-sm mb-3">Pentru afișarea de reclame relevante și măsurarea eficacității campaniilor.</p>
                  <ul className="list-disc list-inside space-y-1 text-purple-700 text-sm">
                    <li>Google Ads</li>
                    <li>Facebook Pixel</li>
                    <li>Retargeting</li>
                    <li>Măsurarea conversiilor</li>
                  </ul>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <Settings className="h-6 w-6 text-orange-600" />
                    <h3 className="text-lg font-semibold text-orange-800">Cookie-uri Funcționale</h3>
                  </div>
                  <p className="text-orange-700 text-sm mb-3">Îmbunătățesc funcționalitatea și personalizarea site-ului.</p>
                  <ul className="list-disc list-inside space-y-1 text-orange-700 text-sm">
                    <li>Chat-ul live</li>
                    <li>Videoclipuri integrate</li>
                    <li>Hărți interactive</li>
                    <li>Preferințele utilizatorului</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Cookie-uri Terțe Părți */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Cookie-uri de la Terțe Părți</h2>
              <p className="text-gray-700 mb-4">
                Utilizăm servicii de la terțe părți care pot seta propriile cookie-uri pe dispozitivul dvs.:
              </p>
              
              <div className="space-y-4">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Google Analytics</h3>
                  <p className="text-gray-700 text-sm mb-2">Pentru analizarea traficului și comportamentului utilizatorilor.</p>
                  <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-nexar-accent hover:underline text-sm">
                    Politica de confidențialitate Google →
                  </a>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Google Ads</h3>
                  <p className="text-gray-700 text-sm mb-2">Pentru afișarea de reclame relevante și măsurarea performanței.</p>
                  <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-nexar-accent hover:underline text-sm">
                    Despre reclamele Google →
                  </a>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Facebook Pixel</h3>
                  <p className="text-gray-700 text-sm mb-2">Pentru optimizarea campaniilor publicitare pe Facebook și Instagram.</p>
                  <a href="https://www.facebook.com/privacy/explanation" target="_blank" rel="noopener noreferrer" className="text-nexar-accent hover:underline text-sm">
                    Politica de confidențialitate Facebook →
                  </a>
                </div>
              </div>
            </section>

            {/* Gestionarea Cookie-urilor */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Cum să Gestionați Cookie-urile</h2>
              <div className="space-y-4 text-gray-700">
                <h3 className="text-lg font-semibold">4.1 Prin Site-ul Nostru</h3>
                <p>Puteți gestiona preferințele cookie-urilor folosind panoul de setări de mai sus sau prin banner-ul de cookie-uri care apare la prima vizită.</p>
                
                <h3 className="text-lg font-semibold">4.2 Prin Browser</h3>
                <p>Majoritatea browser-elor vă permit să controlați cookie-urile prin setările lor:</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 mb-2">Chrome</h4>
                    <p className="text-blue-700 text-sm">Setări → Confidențialitate și securitate → Cookie-uri și alte date de site</p>
                  </div>
                  
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <h4 className="font-semibold text-orange-800 mb-2">Firefox</h4>
                    <p className="text-orange-700 text-sm">Opțiuni → Confidențialitate și securitate → Cookie-uri și date de site</p>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 mb-2">Safari</h4>
                    <p className="text-blue-700 text-sm">Preferințe → Confidențialitate → Gestionarea datelor site-ului web</p>
                  </div>
                  
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-green-800 mb-2">Edge</h4>
                    <p className="text-green-700 text-sm">Setări → Cookie-uri și permisiuni de site → Gestionarea și ștergerea cookie-urilor</p>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold">4.3 Opt-out din Publicitatea Comportamentală</h3>
                <p>Puteți renunța la publicitatea comportamentală prin:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li><a href="https://www.youronlinechoices.com/" target="_blank" rel="noopener noreferrer" className="text-nexar-accent hover:underline">Your Online Choices</a></li>
                  <li><a href="https://optout.networkadvertising.org/" target="_blank" rel="noopener noreferrer" className="text-nexar-accent hover:underline">Network Advertising Initiative</a></li>
                  <li><a href="https://optout.aboutads.info/" target="_blank" rel="noopener noreferrer" className="text-nexar-accent hover:underline">Digital Advertising Alliance</a></li>
                </ul>
              </div>
            </section>

            {/* Impactul Dezactivării */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Impactul Dezactivării Cookie-urilor</h2>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h3 className="font-semibold text-yellow-800 mb-3">⚠️ Atenție</h3>
                <p className="text-yellow-700 mb-3">Dezactivarea anumitor cookie-uri poate afecta funcționarea site-ului:</p>
                <ul className="list-disc list-inside space-y-1 text-yellow-700 text-sm">
                  <li>Nu vă veți putea autentifica în cont</li>
                  <li>Preferințele nu vor fi salvate</li>
                  <li>Anumite funcții interactive nu vor funcționa</li>
                  <li>Experiența de navigare poate fi afectată</li>
                </ul>
              </div>
            </section>

            {/* Actualizări */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Actualizări ale Politicii</h2>
              <div className="space-y-4 text-gray-700">
                <p>Această politică poate fi actualizată periodic pentru a reflecta schimbările în utilizarea cookie-urilor sau în legislație.</p>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-800 mb-2">Cum vă notificăm:</h3>
                  <ul className="list-disc list-inside space-y-1 text-blue-700 text-sm">
                    <li>Actualizarea datei de modificare</li>
                    <li>Banner de notificare pe site</li>
                    <li>Email pentru modificări importante</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Contact */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Contact</h2>
              <div className="bg-nexar-accent/10 rounded-lg p-6">
                <p className="text-gray-700 mb-4">Pentru întrebări despre utilizarea cookie-urilor:</p>
                <div className="space-y-2 text-gray-700">
                  <p><strong>Email:</strong> cookies@nexar.ro</p>
                  <p><strong>Telefon:</strong> 0790 454 647</p>
                  <p><strong>Adresă:</strong> Bulevardul Dem Radulescu 24, Râmnicu Vâlcea, România</p>
                </div>
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 pt-6 mt-8">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <p className="text-sm text-gray-600">
                Ultima actualizare: 18 Decembrie 2024
              </p>
              <Link 
                to="/" 
                className="bg-nexar-accent text-white px-6 py-3 rounded-lg font-semibold hover:bg-nexar-gold transition-colors"
                onClick={() => window.scrollTo(0, 0)}
              >
                Înapoi la Nexar
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookiesPage;