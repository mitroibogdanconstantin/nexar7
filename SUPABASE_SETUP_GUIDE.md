# 🚀 Ghid Complet Configurare Supabase pentru Nexar

## 📋 Pasul 1: Crearea Contului și Proiectului

### 1.1 Creează cont Supabase
1. Mergi la [supabase.com](https://supabase.com)
2. Click pe **"Start your project"**
3. Înregistrează-te cu GitHub, Google sau email
4. Confirmă email-ul dacă este necesar

### 1.2 Creează un proiect nou
1. În dashboard, click pe **"New Project"**
2. Completează:
   - **Organization**: Selectează organizația ta
   - **Name**: `nexar-motorcycle-marketplace`
   - **Database Password**: Generează o parolă sigură (salvează-o!)
   - **Region**: Alege `Europe (Frankfurt)` pentru România
   - **Pricing Plan**: Selectează **Free** pentru început
3. Click pe **"Create new project"**
4. Așteaptă 2-3 minute pentru inițializare

## 🔑 Pasul 2: Obținerea Credențialelor

### 2.1 Găsește credențialele API
1. În dashboard-ul proiectului, mergi la **Settings** → **API**
2. Copiază următoarele:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **anon public key**: Cheia lungă care începe cu `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 2.2 Conectează aplicația
1. În aplicația Nexar, click pe butonul **"Connect to Supabase"** din header
2. Introdu:
   - **URL Proiect**: URL-ul copiat mai sus
   - **Anon Key**: Cheia publică copiată mai sus
3. Click pe **"Conectează la Supabase"**

## 🗄️ Pasul 3: Configurarea Bazei de Date

### 3.1 Rulează migrația SQL
1. În Supabase dashboard, mergi la **SQL Editor**
2. Copiază și rulează conținutul din fișierul `supabase/migrations/20250618171235_throbbing_field.sql` din proiect
3. Click pe **Run** pentru a executa migrația

### 3.2 Verifică tabelele create
1. În Supabase dashboard, mergi la **Table Editor**
2. Verifică că există următoarele tabele:
   - ✅ `profiles` - Profiluri utilizatori
   - ✅ `listings` - Anunțuri motociclete
   - ✅ `favorites` - Anunțuri favorite
   - ✅ `messages` - Mesaje între utilizatori
   - ✅ `reviews` - Recenzii și rating-uri

## 🔐 Pasul 4: Configurarea Autentificării

### 4.1 Activează Email Auth
1. Mergi la **Authentication** → **Providers**
2. Asigură-te că **Email** este activat
3. Dezactivează **Phone Auth** dacă este activat

### 4.2 Configurează Email Confirmation
1. În **Authentication** → **Email Templates**
2. Personalizează template-ul pentru **Confirmation**:
   - **Subject**: "Confirmă-ți contul Nexar"
   - **Content**: Personalizează mesajul pentru utilizatorii tăi

### 4.3 Configurează URL-urile de redirect
1. În **Authentication** → **URL Configuration**
2. Adaugă:
   - **Site URL**: `http://localhost:5173` (pentru dezvoltare) sau URL-ul tău de producție
   - **Redirect URLs**: `http://localhost:5173/auth/callback` (pentru dezvoltare) sau URL-ul tău de producție

## 📦 Pasul 5: Configurarea Storage

### 5.1 Creează buckets pentru imagini
1. Mergi la **Storage**
2. Creează două bucket-uri noi:
   - `listing-images` - pentru imaginile anunțurilor
   - `profile-images` - pentru avatarele utilizatorilor

### 5.2 Configurează politicile de securitate pentru Storage
1. Pentru fiecare bucket, mergi la tab-ul **Policies**
2. Adaugă următoarele politici:
   - **Citire publică**: Toată lumea poate vedea imaginile
   - **Scriere autentificată**: Doar utilizatorii autentificați pot încărca imagini
   - **Ștergere proprie**: Utilizatorii pot șterge doar propriile imagini

## 🚀 Pasul 6: Testarea Integrării

### 6.1 Testează autentificarea
1. În aplicația Nexar, mergi la `/auth`
2. Înregistrează un cont nou
3. Verifică email-ul pentru confirmarea contului
4. Conectează-te cu contul nou

### 6.2 Testează funcționalitățile
1. **Creează un anunț** - Mergi la `/adauga-anunt`
2. **Vezi anunțurile** - Mergi la `/anunturi`
3. **Adaugă la favorite** - Click pe inimă la un anunț
4. **Trimite mesaj** - Contactează un vânzător

## 🔧 Configurări Avansate (Opțional)

### Configurează Email Provider pentru Email-uri Reale
1. Mergi la **Authentication** → **Email Templates**
2. Click pe **Email Provider Settings**
3. Configurează un provider SMTP (ex: SendGrid, Mailgun)

### Configurează Limitele de Stocare
1. Mergi la **Storage** → **Policies**
2. Adaugă o politică pentru a limita dimensiunea fișierelor la 5MB

## 🆘 Depanare Probleme Comune

### "Invalid API key"
Verifică că ai copiat corect anon key-ul din Settings → API

### "Row Level Security policy violation"
Verifică că utilizatorul este autentificat și politicile RLS sunt configurate corect

### "Table doesn't exist"
Rulează din nou migrația din SQL Editor

### "CORS error"
Adaugă domeniul tău în Settings → API → CORS

## ✅ Checklist Final

- [ ] Cont Supabase creat
- [ ] Proiect configurat
- [ ] Credențiale adăugate în aplicație
- [ ] Tabele create prin migrație
- [ ] Autentificare configurată
- [ ] Storage configurat
- [ ] Funcționalități de bază testate
- [ ] Aplicația funcționează complet cu Supabase

**🎉 Felicitări! Aplicația Nexar este acum conectată la Supabase și gata de utilizare!**