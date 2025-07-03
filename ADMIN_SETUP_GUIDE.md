# 🔧 Ghid Configurare Administrator pentru Nexar

## 📋 Pasul 1: Crearea Administratorului în Supabase

### 1.1 Rulează script-ul SQL pentru administrator
1. **Mergi la Supabase Dashboard** → **SQL Editor**
2. **Rulează următorul script** (copiază și paste):

```sql
-- Creează funcția pentru verificarea rolului de admin
CREATE OR REPLACE FUNCTION is_admin(user_email text)
RETURNS boolean AS $$
BEGIN
  RETURN user_email = 'admin@nexar.ro';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Adaugă coloana is_admin la tabela profiles dacă nu există
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'is_admin'
  ) THEN
    ALTER TABLE profiles ADD COLUMN is_admin boolean DEFAULT false;
  END IF;
END $$;

-- Creează funcția pentru setarea automată a admin-ului
CREATE OR REPLACE FUNCTION handle_admin_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Dacă email-ul este admin@nexar.ro, setează is_admin = true
  IF NEW.email = 'admin@nexar.ro' THEN
    NEW.is_admin = true;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Creează trigger-ul pentru setarea automată a admin-ului
DROP TRIGGER IF EXISTS set_admin_role ON profiles;
CREATE TRIGGER set_admin_role
  BEFORE INSERT OR UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION handle_admin_user();

-- Actualizează profilul existent dacă există deja admin@nexar.ro
UPDATE profiles 
SET is_admin = true 
WHERE email = 'admin@nexar.ro';

-- Adaugă politici RLS pentru admin
CREATE POLICY "Adminii pot vedea toate anunțurile" ON listings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE user_id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Adminii pot actualiza orice anunț" ON listings
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE user_id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Adminii pot șterge orice anunț" ON listings
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE user_id = auth.uid() AND is_admin = true
    )
  );

-- Adaugă politici pentru gestionarea utilizatorilor
CREATE POLICY "Adminii pot vedea toate profilurile" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles p2
      WHERE p2.user_id = auth.uid() AND p2.is_admin = true
    )
  );

-- Index pentru performanță
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON profiles(is_admin);
```

3. **Click pe "Run"** pentru a executa

### 1.2 Creează contul de administrator
1. **În aplicația Nexar**, mergi la `/auth`
2. **Înregistrează-te** cu:
   - **Email**: `admin@nexar.ro`
   - **Parolă**: `NexarAdmin2024!`
   - **Nume**: `Administrator Nexar`
   - **Telefon**: `0790454647`
   - **Locația**: `București`
   - **Tip**: `Dealer Autorizat`

### 1.3 Verifică că administratorul a fost creat
1. **În Supabase Dashboard** → **Table Editor** → **profiles**
2. **Verifică** că există o înregistrare cu:
   - `email = admin@nexar.ro`
   - `is_admin = true`

## 🔐 Pasul 2: Funcționalități Administrator

### 2.1 Acces la panoul de administrare
- **URL**: `/admin`
- **Credențiale**: 
  - Email: `admin@nexar.ro`
  - Parolă: `NexarAdmin2024!`

### 2.2 Funcționalități disponibile
- ✅ **Dashboard** cu statistici generale
- ✅ **Gestionare anunțuri** (aprobare/respingere/editare/ștergere)
- ✅ **Gestionare utilizatori** (vizualizare/suspendare)
- ✅ **Rapoarte** și monitorizare activitate
- ✅ **Moderare conținut** în timp real

### 2.3 Permisiuni speciale
- **Poate vedea toate anunțurile** (inclusiv cele inactive)
- **Poate edita orice anunț** de pe platformă
- **Poate șterge orice anunț** 
- **Poate suspenda utilizatori**
- **Poate aproba/respinge anunțuri**

## 🛡️ Pasul 3: Securitate

### 3.1 Protecția contului admin
- **Parolă puternică** (minim 12 caractere)
- **Email unic** (admin@nexar.ro)
- **Acces restricționat** doar pentru administratori

### 3.2 Monitorizare activitate
- **Toate acțiunile admin** sunt înregistrate
- **Audit trail** pentru modificări importante
- **Alerte** pentru activități suspecte

## ⚠️ Important

- **UN SINGUR ADMINISTRATOR** per platformă
- **Nu partaja credențialele** cu nimeni
- **Schimbă parola** periodic
- **Monitorizează activitatea** regulat

## 🆘 Depanare

### Administratorul nu poate accesa panoul
1. Verifică că email-ul este exact `admin@nexar.ro`
2. Verifică în tabela `profiles` că `is_admin = true`
3. Rulează din nou script-ul SQL dacă este necesar

### Administratorul nu poate modera anunțuri
1. Verifică politicile RLS în Supabase
2. Asigură-te că trigger-ul pentru admin funcționează
3. Reautentifică-te în aplicație

**🎉 Administratorul este acum configurat și gata de utilizare!**