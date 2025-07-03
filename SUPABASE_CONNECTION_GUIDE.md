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

### 2.2 Configurează variabilele de mediu
1. Creează un fișier `.env` în rădăcina proiectului
2. Adaugă următoarele linii:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## 🗄️ Pasul 3: Configurarea Bazei de Date

### 3.1 Rulează migrația
1. În Supabase dashboard, mergi la **SQL Editor**
2. Copiază și rulează conținutul din `supabase/migrations/20250618171235_throbbing_field.sql`
3. Click pe **Run** pentru a executa migrația

### 3.2 Verifică tabelele create
1. În Supabase dashboard, mergi la **Table Editor**
2. Verifică că există următoarele tabele:
   - ✅ `profiles`
   - ✅ `listings`
   - ✅ `favorites`
   - ✅ `messages`
   - ✅ `reviews`

## 🔐 Pasul 4: Configurarea Autentificării

### 4.1 Activează providerii de autentificare
1. Mergi la **Authentication** → **Providers**
2. Activează:
   - ✅ **Email** (deja activat)
   - ✅ **Google** (opțional)
   - ✅ **Facebook** (opțional)

### 4.2 Configurează URL-urile de redirect
1. În **Authentication** → **URL Configuration**
2. Adaugă:
   - **Site URL**: `http://localhost:5173` (pentru dezvoltare)
   - **Redirect URLs**: `http://localhost:5173/auth/callback`

## 📊 Pasul 5: Configurarea Row Level Security (RLS)

Migrația a configurat automat politicile de securitate:

**Profiles:**
- Toată lumea poate vedea profilurile
- Utilizatorii pot edita doar propriul profil

**Listings:**
- Toată lumea poate vedea anunțurile active
- Utilizatorii pot crea/edita doar propriile anunțuri

**Favorites & Messages:**
- Utilizatorii văd doar propriile favorite/mesaje

## 🚀 Pasul 6: Testarea Integrării

### 6.1 Testează autentificarea
1. În aplicația Nexar, mergi la `/auth`
2. Înregistrează un cont nou
3. Verifică că utilizatorul apare în **Authentication** → **Users**

### 6.2 Testează funcționalitățile
1. **Creează un anunț** - Mergi la `/adauga-anunt`
2. **Vezi anunțurile** - Mergi la `/anunturi`
3. **Adaugă la favorite** - Click pe inimă la un anunț
4. **Trimite mesaj** - Contactează un vânzător

## 👨‍💼 Acces Administrator

### Credențiale Admin:
- **Email**: `admin@nexar.ro`
- **Parolă**: `NexarAdmin2024!`

### Funcționalități Admin:
- Dashboard cu statistici
- Gestionare anunțuri (aprobare/respingere)
- Gestionare utilizatori
- Rapoarte și monitorizare

## 🔧 Configurări Avansate (Opțional)

### Storage pentru imagini
1. Mergi la **Storage** → **Buckets**
2. Creează un bucket nou: `listing-images`
3. Configurează politicile pentru upload-ul imaginilor

### Realtime pentru mesaje
1. Mergi la **Database** → **Replication**
2. Activează replicarea pentru tabelul `messages`

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
- [ ] Credențiale adăugate în `.env`
- [ ] Migrația rulată cu succes
- [ ] Tabele create și verificate
- [ ] Autentificare configurată
- [ ] RLS activat
- [ ] Funcționalități testate
- [ ] Acces admin verificat

**🎉 Felicitări! Aplicația Nexar este acum conectată la Supabase și gata de utilizare!**