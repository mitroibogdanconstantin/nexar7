import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Award, Clock, MapPin, Phone, Mail, ExternalLink } from 'lucide-react';

const AboutPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
 
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Despre Nexar</h1>
          
          <div className="prose max-w-none">
            <p className="text-lg text-gray-700 mb-6">
              Nexar este cel mai premium marketplace pentru motociclete din România, dedicat pasionaților de două roți care caută excelența în fiecare detaliu.
            </p>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Misiunea Noastră</h2>
            <p className="text-gray-700 mb-6">
              Conectăm vânzătorii și cumpărătorii de motociclete într-un mediu sigur, transparent și profesional. Oferim o platformă unde calitatea și încrederea sunt prioritățile noastre principale.
            </p>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">De Ce Nexar?</h2>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>Verificarea manuală a fiecărui anunț pentru siguranța maximă</li>
              <li>Sistem de rating și recenzii pentru transparență completă</li>
              <li>Interfață intuitivă și experiență de utilizare superioară</li>
              <li>Suport dedicat pentru toți utilizatorii noștri</li>
              <li>Comunitate activă de peste 15,000 de pasionați</li>
            </ul>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Echipa Noastră</h2>
            <p className="text-gray-700 mb-6">
              Suntem o echipă de profesioniști pasionați de motociclete, cu experiență vastă în domeniul automotive și tehnologic. Înțelegem nevoile comunității și lucrăm constant pentru a oferi cea mai bună experiență.
            </p>
            
            <div className="bg-nexar-accent/10 rounded-lg p-6 mt-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Contactează-ne</h3>
              <div className="space-y-2 text-gray-700">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-nexar-accent" />
                  <p><strong>Adresă:</strong> Bulevardul Dem Radulescu 24, Râmnicu Vâlcea</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-5 w-5 text-nexar-accent" />
                  <p><strong>Telefon:</strong> 0790 454 647</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-5 w-5 text-nexar-accent" />
                  <p><strong>Email:</strong> contact@nexar.ro</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-nexar-accent" />
                  <p><strong>Program:</strong> Luni - Vineri: 09:00 - 17:00</p>
                </div>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Partenerii Noștri</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <h3 className="font-bold text-gray-900 mb-2">Dealeri Autorizați</h3>
                <p className="text-gray-700 text-sm mb-2">Colaborăm cu cei mai buni dealeri de motociclete din România pentru a vă oferi cele mai bune oferte.</p>
                <Link to="/anunturi?sellerType=dealer" className="text-nexar-accent hover:text-nexar-gold transition-colors text-sm font-medium flex items-center">
                  Vezi dealeri <ExternalLink className="h-4 w-4 ml-1" />
                </Link>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <h3 className="font-bold text-gray-900 mb-2">Service-uri Recomandate</h3>
                <p className="text-gray-700 text-sm mb-2">Rețeaua noastră de service-uri partenere vă asigură întreținerea optimă a motocicletei.</p>
                <a href="#" className="text-nexar-accent hover:text-nexar-gold transition-colors text-sm font-medium flex items-center">
                  Vezi service-uri <ExternalLink className="h-4 w-4 ml-1" />
                </a>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Valorile Noastre</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <Award className="h-8 w-8 text-nexar-accent mx-auto mb-2" />
                <h3 className="font-bold text-gray-900 mb-1">Calitate</h3>
                <p className="text-gray-700 text-sm">Promovăm doar anunțuri de calitate, verificate manual.</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <Users className="h-8 w-8 text-nexar-accent mx-auto mb-2" />
                <h3 className="font-bold text-gray-900 mb-1">Comunitate</h3>
                <p className="text-gray-700 text-sm">Construim o comunitate unită de pasionați de motociclete.</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <Clock className="h-8 w-8 text-nexar-accent mx-auto mb-2" />
                <h3 className="font-bold text-gray-900 mb-1">Promptitudine</h3>
                <p className="text-gray-700 text-sm">Răspundem rapid la toate solicitările utilizatorilor.</p>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-6 mt-8">
              <Link 
                to="/" 
                className="bg-nexar-accent text-white px-6 py-3 rounded-lg font-semibold hover:bg-nexar-gold transition-colors inline-flex items-center"
              >
                Înapoi la Pagina Principală
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;