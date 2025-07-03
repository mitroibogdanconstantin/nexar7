import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Shield, AlertTriangle, CheckCircle, Users, Gavel } from 'lucide-react';

const TermsPage = () => {
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
              <FileText className="h-8 w-8 text-nexar-accent" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Termeni și Condiții</h1>
            <p className="text-gray-600">
              Ultima actualizare: 18 Decembrie 2024
            </p>
          </div>

          <div className="prose max-w-none">
            {/* Introducere */}
            <section className="mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <Shield className="h-6 w-6 text-nexar-accent" />
                <h2 className="text-2xl font-bold text-gray-900">1. Introducere</h2>
              </div>
              <p className="text-gray-700 mb-4">
                Bine ați venit pe Nexar.ro! Acești Termeni și Condiții ("Termeni") reglementează utilizarea platformei noastre de marketplace pentru motociclete. Prin accesarea și utilizarea serviciilor noastre, acceptați să respectați acești termeni.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 text-sm">
                  <strong>Important:</strong> Vă rugăm să citiți cu atenție acești termeni înainte de a utiliza platforma. Dacă nu sunteți de acord cu oricare dintre acești termeni, vă rugăm să nu utilizați serviciile noastre.
                </p>
              </div>
            </section>

            {/* Definiții */}
            <section className="mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <Users className="h-6 w-6 text-nexar-accent" />
                <h2 className="text-2xl font-bold text-gray-900">2. Definiții</h2>
              </div>
              <ul className="space-y-3 text-gray-700">
                <li><strong>"Platforma"</strong> - site-ul web Nexar.ro și toate serviciile asociate</li>
                <li><strong>"Utilizator"</strong> - orice persoană care accesează sau utilizează platforma</li>
                <li><strong>"Vânzător"</strong> - utilizator care publică anunțuri pentru vânzarea de motociclete</li>
                <li><strong>"Cumpărător"</strong> - utilizator interesat să achiziționeze motociclete</li>
                <li><strong>"Anunț"</strong> - listarea unei motociclete pentru vânzare pe platformă</li>
                <li><strong>"Conținut"</strong> - toate informațiile, textele, imaginile și datele publicate pe platformă</li>
              </ul>
            </section>

            {/* Eligibilitate */}
            <section className="mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <CheckCircle className="h-6 w-6 text-nexar-accent" />
                <h2 className="text-2xl font-bold text-gray-900">3. Eligibilitate și Înregistrare</h2>
              </div>
              <div className="space-y-4 text-gray-700">
                <h3 className="text-lg font-semibold">3.1 Vârsta Minimă</h3>
                <p>Pentru a utiliza platforma, trebuie să aveți cel puțin 18 ani sau să aveți acordul părinților/tutorilor legali.</p>
                
                <h3 className="text-lg font-semibold">3.2 Informații de Cont</h3>
                <p>La înregistrare, vă angajați să furnizați informații corecte, complete și actualizate. Sunteți responsabil pentru menținerea confidențialității contului dvs.</p>
                
                <h3 className="text-lg font-semibold">3.3 Un Cont per Utilizator</h3>
                <p>Fiecare utilizator poate avea un singur cont activ. Conturile multiple sunt interzise și pot fi suspendate.</p>
              </div>
            </section>

            {/* Utilizarea Platformei */}
            <section className="mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <Gavel className="h-6 w-6 text-nexar-accent" />
                <h2 className="text-2xl font-bold text-gray-900">4. Utilizarea Platformei</h2>
              </div>
              <div className="space-y-4 text-gray-700">
                <h3 className="text-lg font-semibold">4.1 Utilizare Permisă</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>Publicarea de anunțuri legitime pentru motociclete</li>
                  <li>Căutarea și contactarea vânzătorilor</li>
                  <li>Utilizarea funcțiilor de mesagerie pentru comunicare</li>
                  <li>Lăsarea de recenzii oneste și constructive</li>
                </ul>
                
                <h3 className="text-lg font-semibold">4.2 Utilizare Interzisă</h3>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <ul className="list-disc list-inside space-y-2 text-red-800">
                    <li>Publicarea de anunțuri false sau înșelătoare</li>
                    <li>Vânzarea de vehicule furate sau cu probleme legale</li>
                    <li>Hărțuirea sau amenințarea altor utilizatori</li>
                    <li>Utilizarea de limbaj ofensator sau discriminatoriu</li>
                    <li>Încercarea de a ocoli sistemele de securitate</li>
                    <li>Spam-ul sau publicitatea neautorizată</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Anunțuri și Conținut */}
            <section className="mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <AlertTriangle className="h-6 w-6 text-nexar-accent" />
                <h2 className="text-2xl font-bold text-gray-900">5. Anunțuri și Conținut</h2>
              </div>
              <div className="space-y-4 text-gray-700">
                <h3 className="text-lg font-semibold">5.1 Responsabilitatea Vânzătorului</h3>
                <p>Vânzătorii sunt responsabili pentru:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Acuratețea informațiilor din anunț</li>
                  <li>Calitatea și autenticitatea fotografiilor</li>
                  <li>Respectarea legislației în vigoare</li>
                  <li>Comunicarea promptă cu potențialii cumpărători</li>
                </ul>
                
                <h3 className="text-lg font-semibold">5.2 Moderarea Conținutului</h3>
                <p>Ne rezervăm dreptul de a modera, edita sau elimina orice conținut care încalcă acești termeni sau legislația aplicabilă.</p>
                
                <h3 className="text-lg font-semibold">5.3 Proprietatea Intelectuală</h3>
                <p>Prin publicarea conținutului, acordați Nexar.ro o licență non-exclusivă de utilizare pentru afișarea pe platformă.</p>
              </div>
            </section>

            {/* Tranzacții */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Tranzacții și Plăți</h2>
              <div className="space-y-4 text-gray-700">
                <h3 className="text-lg font-semibold">6.1 Facilitarea Tranzacțiilor</h3>
                <p>Nexar.ro facilitează contactul între vânzători și cumpărători, dar nu este parte în tranzacțiile efectuate.</p>
                
                <h3 className="text-lg font-semibold">6.2 Responsabilitatea Părților</h3>
                <p>Vânzătorii și cumpărătorii sunt responsabili pentru:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Negocierea prețului și condițiilor</li>
                  <li>Verificarea documentelor vehiculului</li>
                  <li>Efectuarea plăților și transferului de proprietate</li>
                  <li>Respectarea obligațiilor legale</li>
                </ul>
                
                <h3 className="text-lg font-semibold">6.3 Limitarea Răspunderii</h3>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800">
                    Nexar.ro nu este responsabil pentru disputele, fraudele sau problemele care apar în cadrul tranzacțiilor între utilizatori.
                  </p>
                </div>
              </div>
            </section>

            {/* Taxe și Comisioane */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Taxe și Comisioane</h2>
              <div className="space-y-4 text-gray-700">
                <h3 className="text-lg font-semibold">7.1 Servicii Gratuite</h3>
                <p>Înregistrarea și utilizarea de bază a platformei sunt gratuite pentru utilizatori.</p>
                
                <h3 className="text-lg font-semibold">7.2 Servicii Premium</h3>
                <p>Anumite funcții premium (anunțuri evidențiate, promovare) pot fi supuse unor taxe care vor fi comunicate în avans.</p>
                
                <h3 className="text-lg font-semibold">7.3 Modificarea Tarifelor</h3>
                <p>Ne rezervăm dreptul de a modifica structura tarifară cu o notificare prealabilă de 30 de zile.</p>
              </div>
            </section>

            {/* Confidențialitate */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Confidențialitate și Protecția Datelor</h2>
              <div className="space-y-4 text-gray-700">
                <p>Colectarea și utilizarea datelor personale sunt reglementate de <Link to="/confidentialitate" className="text-nexar-accent hover:underline">Politica noastră de Confidențialitate</Link>.</p>
                
                <h3 className="text-lg font-semibold">8.1 Consimțământul</h3>
                <p>Prin utilizarea platformei, consimțiți la colectarea și prelucrarea datelor conform politicii de confidențialitate.</p>
                
                <h3 className="text-lg font-semibold">8.2 Securitatea Datelor</h3>
                <p>Implementăm măsuri de securitate pentru protejarea datelor dvs., dar nu putem garanta securitatea absolută.</p>
              </div>
            </section>

            {/* Încetarea Serviciului */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Suspendarea și Încetarea</h2>
              <div className="space-y-4 text-gray-700">
                <h3 className="text-lg font-semibold">9.1 Suspendarea Contului</h3>
                <p>Putem suspenda sau închide conturile care încalcă acești termeni, fără notificare prealabilă.</p>
                
                <h3 className="text-lg font-semibold">9.2 Încetarea Voluntară</h3>
                <p>Puteți închide contul oricând prin contactarea serviciului clienți.</p>
                
                <h3 className="text-lg font-semibold">9.3 Efectele Încetării</h3>
                <p>La închiderea contului, anunțurile vor fi eliminate, dar obligațiile contractuale rămân în vigoare.</p>
              </div>
            </section>

            {/* Limitarea Răspunderii */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Limitarea Răspunderii</h2>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <div className="space-y-4 text-gray-700">
                  <p><strong>10.1</strong> Nexar.ro furnizează platforma "ca atare" fără garanții de orice fel.</p>
                  <p><strong>10.2</strong> Nu garantăm acuratețea, completitudinea sau fiabilitatea conținutului publicat de utilizatori.</p>
                  <p><strong>10.3</strong> Răspunderea noastră este limitată la valoarea serviciilor plătite în ultimele 12 luni.</p>
                  <p><strong>10.4</strong> Nu suntem responsabili pentru daune indirecte, incidentale sau consecutive.</p>
                </div>
              </div>
            </section>

            {/* Legea Aplicabilă */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Legea Aplicabilă și Jurisdicția</h2>
              <div className="space-y-4 text-gray-700">
                <p>Acești termeni sunt guvernați de legea română și se supun jurisdicției instanțelor din România.</p>
                <p>Orice dispută va fi soluționată prin negociere amiabilă sau, în caz de eșec, prin instanțele competente din Râmnicu Vâlcea.</p>
              </div>
            </section>

            {/* Modificări */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Modificarea Termenilor</h2>
              <div className="space-y-4 text-gray-700">
                <p>Ne rezervăm dreptul de a modifica acești termeni oricând. Modificările vor fi comunicate prin:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Publicarea pe site-ul web</li>
                  <li>Notificare prin email (dacă este cazul)</li>
                  <li>Notificare în aplicație</li>
                </ul>
                <p>Continuarea utilizării platformei după modificări constituie acceptarea noilor termeni.</p>
              </div>
            </section>

            {/* Contact */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Contact</h2>
              <div className="bg-nexar-accent/10 rounded-lg p-6">
                <p className="text-gray-700 mb-4">Pentru întrebări despre acești termeni, ne puteți contacta:</p>
                <div className="space-y-2 text-gray-700">
                  <p><strong>Email:</strong> legal@nexar.ro</p>
                  <p><strong>Telefon:</strong> 0790 454 647</p>
                  <p><strong>Adresă:</strong> Bulevardul Dem Radulescu 24, Râmnicu Vâlcea, România</p>
                  <p><strong>Program:</strong> Luni - Vineri: 09:00 - 17:00</p>
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

export default TermsPage;