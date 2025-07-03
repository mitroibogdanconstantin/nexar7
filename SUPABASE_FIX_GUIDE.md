# 🔧 Ghid de Reparare Supabase pentru Nexar

## 🚨 Problemele identificate:

1. **Tabela `profiles` nu există** - cauza erorilor de autentificare
2. **Politici RLS incorecte** - cauza erorilor la crearea anunțurilor
3. **Validări lipsă** - permite date invalide

## 📋 Pași pentru reparare:

### **Pasul 1: Rulează migrațiile în Supabase**

1. **Mergi la Supabase Dashboard** → **SQL Editor**
2. **Rulează prima migrație** (copiază și paste):

```sql
-- Creează tabela profiles dacă nu există
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text,
  location text,
  description text,
  website text,
  avatar_url text,
  verified boolean DEFAULT false,
  seller_type text DEFAULT 'individual' CHECK (seller_type IN ('individual', 'dealer')),
  rating numeric(3,2) DEFAULT 0,
  reviews_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Politici RLS pentru profiles
DROP POLICY IF EXISTS "Profiles sunt vizibile pentru toți" ON profiles;
DROP POLICY IF EXISTS "Utilizatorii pot să-și actualizeze propriul profil" ON profiles;

CREATE POLICY "Profiles sunt vizibile pentru toți" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Utilizatorii pot să-și actualizeze propriul profil" ON profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Funcție pentru gestionarea utilizatorilor noi
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (
    user_id,
    name,
    email,
    phone,
    location,
    seller_type
  ) VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'location', ''),
    COALESCE(NEW.raw_user_meta_data->>'sellerType', 'individual')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pentru crearea automată a profilurilor
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Funcție pentru actualizarea timestamp-urilor
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pentru actualizarea automată a updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Indexuri pentru performanță
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_name ON profiles(name);
CREATE INDEX IF NOT EXISTS idx_profiles_location ON profiles(location);
CREATE INDEX IF NOT EXISTS idx_profiles_seller_type ON profiles(seller_type);
```

3. **Click pe "Run"** pentru a executa

### **Pasul 2: Rulează a doua migrație**

```sql
-- Creează tabela listings dacă nu există
CREATE TABLE IF NOT EXISTS listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  price numeric(10,2) NOT NULL,
  currency text DEFAULT 'EUR',
  year integer NOT NULL,
  mileage integer NOT NULL,
  location text NOT NULL,
  category text NOT NULL CHECK (category IN ('sport', 'touring', 'cruiser', 'adventure', 'naked', 'enduro', 'scooter', 'chopper')),
  brand text NOT NULL,
  model text NOT NULL,
  engine_capacity integer NOT NULL,
  fuel_type text NOT NULL CHECK (fuel_type IN ('benzina', 'electric', 'hibrid')),
  transmission text NOT NULL CHECK (transmission IN ('manuala', 'automata', 'semi-automata')),
  condition text NOT NULL CHECK (condition IN ('noua', 'excelenta', 'foarte_buna', 'buna', 'satisfacatoare')),
  color text,
  images text[] DEFAULT '{}',
  features text[] DEFAULT '{}',
  seller_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  seller_name text NOT NULL,
  seller_type text NOT NULL,
  rating numeric(3,2) DEFAULT 0,
  views_count integer DEFAULT 0,
  favorites_count integer DEFAULT 0,
  featured boolean DEFAULT false,
  status text DEFAULT 'active' CHECK (status IN ('active', 'sold', 'pending', 'rejected')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

-- Șterge politicile existente pentru a le recrea
DROP POLICY IF EXISTS "Anunțurile active sunt vizibile pentru toți" ON listings;
DROP POLICY IF EXISTS "Utilizatorii pot să-și creeze propriile anunțuri" ON listings;
DROP POLICY IF EXISTS "Utilizatorii pot să-și actualizeze propriile anunțuri" ON listings;
DROP POLICY IF EXISTS "Utilizatorii pot să-și șteargă propriile anunțuri" ON listings;
DROP POLICY IF EXISTS "Toată lumea poate vedea anunțurile active" ON listings;
DROP POLICY IF EXISTS "Utilizatorii autentificați pot crea anunțuri" ON listings;
DROP POLICY IF EXISTS "Utilizatorii pot actualiza propriile anunțuri" ON listings;
DROP POLICY IF EXISTS "Utilizatorii pot șterge propriile anunțuri" ON listings;

-- Politici RLS pentru listings - CORECTE
CREATE POLICY "Toată lumea poate vedea anunțurile active" ON listings
  FOR SELECT USING (status = 'active');

CREATE POLICY "Utilizatorii autentificați pot crea anunțuri" ON listings
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL AND 
    seller_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Utilizatorii pot actualiza propriile anunțuri" ON listings
  FOR UPDATE USING (
    auth.uid() IS NOT NULL AND 
    seller_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Utilizatorii pot șterge propriile anunțuri" ON listings
  FOR DELETE USING (
    auth.uid() IS NOT NULL AND 
    seller_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  );

-- Creează tabela favorites dacă nu există
CREATE TABLE IF NOT EXISTS favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  listing_id uuid REFERENCES listings(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, listing_id)
);

-- Enable RLS pentru favorites
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Politici pentru favorites
DROP POLICY IF EXISTS "Utilizatorii pot vedea propriile favorite" ON favorites;
DROP POLICY IF EXISTS "Utilizatorii pot adăuga favorite" ON favorites;
DROP POLICY IF EXISTS "Utilizatorii pot șterge propriile favorite" ON favorites;

CREATE POLICY "Utilizatorii pot vedea propriile favorite" ON favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Utilizatorii pot adăuga favorite" ON favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Utilizatorii pot șterge propriile favorite" ON favorites
  FOR DELETE USING (auth.uid() = user_id);

-- Creează tabela messages dacă nu există
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  listing_id uuid REFERENCES listings(id) ON DELETE CASCADE,
  subject text,
  content text NOT NULL,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS pentru messages
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Politici pentru messages
DROP POLICY IF EXISTS "Utilizatorii pot vedea mesajele lor" ON messages;
DROP POLICY IF EXISTS "Utilizatorii pot trimite mesaje" ON messages;

CREATE POLICY "Utilizatorii pot vedea mesajele lor" ON messages
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Utilizatorii pot trimite mesaje" ON messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Creează tabela reviews dacă nu există
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reviewer_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  reviewed_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  listing_id uuid REFERENCES listings(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(reviewer_id, reviewed_id, listing_id)
);

-- Enable RLS pentru reviews
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Politici pentru reviews
DROP POLICY IF EXISTS "Recenziile sunt vizibile pentru toți" ON reviews;
DROP POLICY IF EXISTS "Utilizatorii pot lăsa recenzii" ON reviews;

CREATE POLICY "Recenziile sunt vizibile pentru toți" ON reviews
  FOR SELECT USING (true);

CREATE POLICY "Utilizatorii pot lăsa recenzii" ON reviews
  FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

-- Trigger pentru actualizarea automată a updated_at pentru listings
DROP TRIGGER IF EXISTS update_listings_updated_at ON listings;
CREATE TRIGGER update_listings_updated_at BEFORE UPDATE ON listings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Indexuri pentru performanță
CREATE INDEX IF NOT EXISTS idx_listings_seller_id ON listings(seller_id);
CREATE INDEX IF NOT EXISTS idx_listings_category ON listings(category);
CREATE INDEX IF NOT EXISTS idx_listings_brand ON listings(brand);
CREATE INDEX IF NOT EXISTS idx_listings_price ON listings(price);
CREATE INDEX IF NOT EXISTS idx_listings_year ON listings(year);
CREATE INDEX IF NOT EXISTS idx_listings_location ON listings(location);
CREATE INDEX IF NOT EXISTS idx_listings_status ON listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_created_at ON listings(created_at);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_listing_id ON favorites(listing_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
```

### **Pasul 3: Verifică tabelele**

1. Mergi la **Table Editor** în Supabase
2. Verifică că există tabelele:
   - ✅ `profiles`
   - ✅ `listings` 
   - ✅ `favorites`
   - ✅ `messages`
   - ✅ `reviews`

### **Pasul 4: Configurează Storage (opțional)**

1. Mergi la **Storage** în Supabase
2. Creează bucket-urile:
   - `listing-images`
   - `profile-images`

## ✅ **După rularea migrațiilor:**

1. **Înregistrarea** va funcționa corect
2. **Crearea anunțurilor** va funcționa fără erori RLS
3. **Validările** vor preveni datele invalide
4. **Dropdown-ul cu orașe** va funcționa pentru locație

## 🔍 **Pentru debugging:**

- Verifică **Logs & Analytics** în Supabase pentru erori
- Testează pas cu pas: înregistrare → login → creare anunț
- Verifică că profilul se creează automat la înregistrare

**Acum aplicația va funcționa complet!** 🎉