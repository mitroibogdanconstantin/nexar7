import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Eye, Lock, Database, UserCheck, AlertTriangle, Mail, Phone } from 'lucide-react';

const PrivacyPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-nexar-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-nexar-accent" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Politica de Confidențialitate</h1>
            <p className="text-gray-600">
              Ultima actualizare: 18 Decembrie 2024
            </p>
          </div>

          <div className="prose max-w-none">
            {/* Introducere */}
            <section className="mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <Eye className="h-6 w-6 text-nexar-accent" />
                <h2 className="text-2xl font-bold text-gray-900">1. Introducere</h2>
              </div>
              <p className="text-gray-700 mb-4">
                La Nexar.ro, respectăm și protejăm confidențialitatea utilizatorilor noștri. Această Politică de Confidențialitate explică cum colectăm, utilizăm, stocăm și protejăm informațiile dvs. personale în conformitate cu Regulamentul General privind Protecția Datelor (GDPR) și legislația română aplicabilă.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 text-sm">
                  <strong>Angajamentul nostru:</strong> Ne angajăm să procesăm datele dvs. personale în mod transparent, corect și legal, respectând drepturile dvs. de confidențialitate.
                </p>
              </div>
            </section>

            {/* Operator de Date */}
            <section className="mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <UserCheck className="h-6 w-6 text-nexar-accent" />
                <h2 className="text-2xl font-bold text-gray-900">2. Operatorul de Date</h2>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <div className="space-y-2 text-gray-700">
                  <p><strong>Denumire:</strong> Nexar.ro</p>
                  <p><strong>Adresă:</strong> Bulevardul Dem Radulescu 24, Râmnicu Vâlcea, România</p>
                  <p><strong>Email contact:</strong> privacy@nexar.ro</p>
                  <p><strong>Telefon:</strong> 0790 454 647</p>
                  <p><strong>Responsabil Protecția Datelor:</strong> dpo@nexar.ro</p>
                </div>
              </div>
            </section>

            {/* Date Colectate */}
            <section className="mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <Database className="h-6 w-6 text-nexar-accent" />
                <h2 className="text-2xl font-bold text-gray-900">3. Datele pe care le Colectăm</h2>
              </div>
              <div className="space-y-6 text-gray-700">
                <div>
                  <h3 className="text-lg font-semibold mb-3">3.1 Date de Identificare</h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Nume și prenume</li>
                    <li>Adresă de email</li>
                    <li>Număr de telefon</li>
                    <li>Adresă fizică/locația</li>
                    <li>Data nașterii (pentru verificarea vârstei)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">3.2 Date de Cont</h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Informații de autentificare (email și parolă criptată)</li>
                    <li>Preferințe de cont și setări</li>
                    <li>Istoricul activității pe platformă</li>
                    <li>Tipul de utilizator (privat/dealer)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">3.3 Date despre Anunțuri</h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Informații despre motocicletele listate</li>
                    <li>Fotografii și descrieri</li>
                    <li>Prețuri și condiții de vânzare</li>
                    <li>Istoricul anunțurilor</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">3.4 Date Tehnice</h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Adresa IP și locația aproximativă</li>
                    <li>Tipul de browser și dispozitiv</li>
                    <li>Paginile vizitate și timpul petrecut</li>
                    <li>Referrer și link-uri de ieșire</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">3.5 Date de Comunicare</h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Mesajele trimise prin platformă</li>
                    <li>Recenziile și rating-urile acordate</li>
                    <li>Comunicările cu serviciul clienți</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Scopurile Prelucrării */}
            <section className="mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <Lock className="h-6 w-6 text-nexar-accent" />
                <h2 className="text-2xl font-bold text-gray-900">4. Scopurile Prelucrării Datelor</h2>
              </div>
              <div className="space-y-6 text-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-green-800 mb-2">Servicii Esențiale</h3>
                    <ul className="list-disc list-inside space-y-1 text-green-700 text-sm">
                      <li>Crearea și gestionarea conturilor</li>
                      <li>Facilitarea tranzacțiilor</li>
                      <li>Comunicarea între utilizatori</li>
                      <li>Suportul tehnic</li>
                    </ul>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-blue-800 mb-2">Îmbunătățiri</h3>
                    <ul className="list-disc list-inside space-y-1 text-blue-700 text-sm">
                      <li>Personalizarea experienței</li>
                      <li>Analize și statistici</li>
                      <li>Îmbunătățirea serviciilor</li>
                      <li>Dezvoltarea de noi funcții</li>
                    </ul>
                  </div>
                  
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-yellow-800 mb-2">Marketing</h3>
                    <ul className="list-disc list-inside space-y-1 text-yellow-700 text-sm">
                      <li>Newsletter-uri (cu consimțământ)</li>
                      <li>Oferte personalizate</li>
                      <li>Campanii promoționale</li>
                      <li>Cercetări de piață</li>
                    </ul>
                  </div>
                  
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-red-800 mb-2">Securitate</h3>
                    <ul className="list-disc list-inside space-y-1 text-red-700 text-sm">
                      <li>Prevenirea fraudelor</li>
                      <li>Detectarea abuzurilor</li>
                      <li>Respectarea legii</li>
                      <li>Protejarea utilizatorilor</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Temeiurile Legale */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Temeiurile Legale pentru Prelucrare</h2>
              <div className="space-y-4 text-gray-700">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">5.1 Executarea Contractului</h3>
                  <p className="text-sm">Prelucrăm datele pentru a vă furniza serviciile solicitate și pentru a executa obligațiile contractuale.</p>
                </div>
                
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">5.2 Consimțământul</h3>
                  <p className="text-sm">Pentru anumite activități (marketing, cookies non-esențiale), solicităm consimțământul dvs. explicit.</p>
                </div>
                
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">5.3 Interesul Legitim</h3>
                  <p className="text-sm">Pentru îmbunătățirea serviciilor, securitate și analize, ne bazăm pe interesul legitim.</p>
                </div>
                
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">5.4 Obligația Legală</h3>
                  <p className="text-sm">Când legea ne obligă să păstrăm sau să furnizăm anumite date autorităților.</p>
                </div>
              </div>
            </section>

            {/* Partajarea Datelor */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Partajarea Datelor</h2>
              <div className="space-y-4 text-gray-700">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="font-semibold text-yellow-800 mb-2">⚠️ Principiu Important</h3>
                  <p className="text-yellow-700 text-sm">Nu vindem, nu închiriem și nu partajăm datele dvs. personale cu terți pentru scopuri comerciale fără consimțământul dvs.</p>
                </div>
                
                <h3 className="text-lg font-semibold">6.1 Partajare Limitată</h3>
                <p>Partajăm datele doar în următoarele situații:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Cu alți utilizatori:</strong> Informațiile din anunțuri sunt vizibile public</li>
                  <li><strong>Furnizori de servicii:</strong> Pentru hosting, analize, plăți (cu acorduri de confidențialitate)</li>
                  <li><strong>Autorități:</strong> Când este cerut legal sau pentru prevenirea fraudelor</li>
                  <li><strong>Transferuri de afaceri:</strong> În caz de fuziune sau achiziție (cu notificare prealabilă)</li>
                </ul>
                
                <h3 className="text-lg font-semibold">6.2 Transferuri Internaționale</h3>
                <p>Dacă transferăm date în afara UE, ne asigurăm că există garanții adecvate (clauzele contractuale standard, decizii de adecvare).</p>
              </div>
            </section>

            {/* Păstrarea Datelor */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Perioada de Păstrare</h2>
              <div className="space-y-4 text-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-800 mb-2">Conturi Active</h3>
                    <p className="text-blue-700 text-sm">Datele sunt păstrate cât timp contul este activ și pentru 3 ani după ultima activitate.</p>
                  </div>
                  
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-semibold text-green-800 mb-2">Anunțuri</h3>
                    <p className="text-green-700 text-sm">Anunțurile sunt păstrate 2 ani după expirare pentru statistici și îmbunătățiri.</p>
                  </div>
                  
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h3 className="font-semibold text-purple-800 mb-2">Comunicări</h3>
                    <p className="text-purple-700 text-sm">Mesajele sunt păstrate 1 an pentru rezolvarea disputelor și suport.</p>
                  </div>
                  
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <h3 className="font-semibold text-orange-800 mb-2">Date Legale</h3>
                    <p className="text-orange-700 text-sm">Datele necesare pentru obligații legale sunt păstrate conform legislației (5-10 ani).</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Drepturile Utilizatorilor */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Drepturile Dvs. GDPR</h2>
              <div className="space-y-4 text-gray-700">
                <div className="bg-nexar-accent/10 border border-nexar-accent/20 rounded-lg p-6">
                  <h3 className="font-semibold text-nexar-accent mb-4">Aveți următoarele drepturi:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">🔍 Dreptul de Acces</h4>
                      <p className="text-sm">Să știți ce date avem despre dvs.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">✏️ Dreptul de Rectificare</h4>
                      <p className="text-sm">Să corectați datele incorecte.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">🗑️ Dreptul de Ștergere</h4>
                      <p className="text-sm">Să solicitați ștergerea datelor.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">⏸️ Dreptul de Restricționare</h4>
                      <p className="text-sm">Să limitați prelucrarea datelor.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">📦 Dreptul la Portabilitate</h4>
                      <p className="text-sm">Să primiți datele într-un format utilizabil.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">🚫 Dreptul de Opoziție</h4>
                      <p className="text-sm">Să vă opuneți anumitor prelucrări.</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-800 mb-2">Cum să vă exercitați drepturile:</h3>
                  <ul className="list-disc list-inside space-y-1 text-blue-700 text-sm">
                    <li>Trimiteți un email la: <strong>privacy@nexar.ro</strong></li>
                    <li>Contactați-ne telefonic: <strong>0790 454 647</strong></li>
                    <li>Utilizați formularul de contact din cont</li>
                    <li>Răspundem în maximum 30 de zile</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Securitatea Datelor */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Securitatea Datelor</h2>
              <div className="space-y-4 text-gray-700">
                <p>Implementăm măsuri tehnice și organizatorice pentru protejarea datelor dvs.:</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-semibold text-green-800 mb-2">🔒 Măsuri Tehnice</h3>
                    <ul className="list-disc list-inside space-y-1 text-green-700 text-sm">
                      <li>Criptarea datelor (SSL/TLS)</li>
                      <li>Autentificare cu doi factori</li>
                      <li>Backup-uri regulate și securizate</li>
                      <li>Monitorizarea sistemelor</li>
                    </ul>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-800 mb-2">👥 Măsuri Organizatorice</h3>
                    <ul className="list-disc list-inside space-y-1 text-blue-700 text-sm">
                      <li>Acces restricționat la date</li>
                      <li>Instruirea personalului</li>
                      <li>Politici de securitate stricte</li>
                      <li>Auditări regulate</li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-red-800 mb-2">Încălcări de Securitate</h3>
                      <p className="text-red-700 text-sm">În cazul unei încălcări de securitate care afectează datele dvs., vă vom notifica în termen de 72 de ore și vom lua măsurile necesare pentru limitarea impactului.</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Cookies */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Cookies și Tehnologii Similare</h2>
              <div className="space-y-4 text-gray-700">
                <p>Utilizăm cookies pentru îmbunătățirea experienței dvs. Pentru detalii complete, consultați <Link to="/cookies" className="text-nexar-accent hover:underline">Politica noastră de Cookies</Link>.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-semibold text-green-800 mb-2">Esențiale</h3>
                    <p className="text-green-700 text-sm">Necesare pentru funcționarea site-ului</p>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-800 mb-2">Analize</h3>
                    <p className="text-blue-700 text-sm">Pentru înțelegerea utilizării site-ului</p>
                  </div>
                  
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h3 className="font-semibold text-purple-800 mb-2">Marketing</h3>
                    <p className="text-purple-700 text-sm">Pentru personalizarea conținutului</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Modificări */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Modificări ale Politicii</h2>
              <div className="space-y-4 text-gray-700">
                <p>Putem actualiza această politică pentru a reflecta schimbările în serviciile noastre sau în legislație.</p>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="font-semibold text-yellow-800 mb-2">Notificarea Modificărilor</h3>
                  <ul className="list-disc list-inside space-y-1 text-yellow-700 text-sm">
                    <li>Publicarea pe site cu evidențierea modificărilor</li>
                    <li>Notificare prin email pentru modificări importante</li>
                    <li>Notificare în aplicație la următoarea autentificare</li>
                    <li>Perioada de tranziție de 30 de zile pentru adaptare</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Contact și Reclamații */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contact și Reclamații</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-nexar-accent/10 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Mail className="h-6 w-6 text-nexar-accent" />
                    <h3 className="font-semibold text-gray-900">Contactați-ne</h3>
                  </div>
                  <div className="space-y-2 text-gray-700 text-sm">
                    <p><strong>Email DPO:</strong> dpo@nexar.ro</p>
                    <p><strong>Email general:</strong> privacy@nexar.ro</p>
                    <p><strong>Telefon:</strong> 0790 454 647</p>
                    <p><strong>Adresă:</strong> Bulevardul Dem Radulescu 24, Râmnicu Vâlcea</p>
                  </div>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Phone className="h-6 w-6 text-blue-600" />
                    <h3 className="font-semibold text-gray-900">Autoritatea de Supraveghere</h3>
                  </div>
                  <div className="space-y-2 text-gray-700 text-sm">
                    <p><strong>ANSPDCP</strong></p>
                    <p>Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal</p>
                    <p><strong>Website:</strong> dataprotection.ro</p>
                    <p><strong>Email:</strong> anspdcp@dataprotection.ro</p>
                  </div>
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

export default PrivacyPage;