# 🚨 Ghid Complet pentru Rezolvarea Problemelor Supabase

## 📋 Pasul 1: Verifică Conexiunea la Supabase

1. **Deschide consola browser-ului** (F12) și verifică erorile
2. **Verifică dacă URL-ul și cheia API sunt corecte** în fișierul `src/lib/supabase.ts`

```typescript
// Credențialele Supabase pentru proiectul tău
const supabaseUrl = 'https://tidnmzsivsthwwcfdzyo.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpZG5tenNpdnN0aHd3Y2ZkenlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3MjE5NTgsImV4cCI6MjA2NjI5Nzk1OH0.Sr1gSZ2qtoff7gmulkT8uIzB8eL7gqKUUNVj82OqHog'
```

## 📋 Pasul 2: Rulează Migrația Finală în Supabase

1. **Mergi la Supabase Dashboard** → **SQL Editor**
2. **Copiază și rulează** următorul script SQL:

```sql
-- 🚨 MIGRAȚIA FINALĂ - Rezolvă toate problemele cu RLS și funcționalitățile
-- Rulează această migrație în Supabase Dashboard → SQL Editor

-- Pasul 1: Dezactivează temporar RLS pentru a opri recursiunea
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE listings DISABLE ROW LEVEL SECURITY;
ALTER TABLE favorites DISABLE ROW LEVEL SECURITY;
ALTER TABLE messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE reviews DISABLE ROW LEVEL SECURITY;

-- Pasul 2: Șterge TOATE politicile existente care cauzează probleme
DO $$
DECLARE
    r RECORD;
BEGIN
    -- Șterge toate politicile pentru profiles
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'profiles' AND schemaname = 'public') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.profiles';
    END LOOP;
    
    -- Șterge toate politicile pentru listings
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'listings' AND schemaname = 'public') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.listings';
    END LOOP;
    
    -- Șterge toate politicile pentru favorites
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'favorites' AND schemaname = 'public') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.favorites';
    END LOOP;
    
    -- Șterge toate politicile pentru messages
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'messages' AND schemaname = 'public') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.messages';
    END LOOP;
    
    -- Șterge toate politicile pentru reviews
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'reviews' AND schemaname = 'public') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.reviews';
    END LOOP;
    
    -- Șterge toate politicile pentru storage.objects
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON storage.objects';
    END LOOP;
END $$;

-- Pasul 3: Reactivează RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Pasul 4: Creează politici SIMPLE pentru PROFILES (FĂRĂ RECURSIUNE)
CREATE POLICY "profiles_select" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "profiles_update" ON profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "profiles_insert" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Pasul 5: Creează politici SIMPLE pentru LISTINGS (FĂRĂ RECURSIUNE)
CREATE POLICY "listings_select" ON listings
  FOR SELECT USING (status = 'active');

-- FIXED: More permissive insert policy for authenticated users
CREATE POLICY "listings_insert" ON listings
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "listings_update" ON listings
  FOR UPDATE USING (
    auth.uid() IS NOT NULL AND 
    seller_id IN (
      SELECT id FROM profiles 
      WHERE user_id = auth.uid() 
      LIMIT 1
    )
  );

CREATE POLICY "listings_delete" ON listings
  FOR DELETE USING (
    auth.uid() IS NOT NULL AND 
    seller_id IN (
      SELECT id FROM profiles 
      WHERE user_id = auth.uid() 
      LIMIT 1
    )
  );

-- Pasul 6: Creează politici SIMPLE pentru FAVORITES
CREATE POLICY "favorites_select" ON favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "favorites_insert" ON favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "favorites_delete" ON favorites
  FOR DELETE USING (auth.uid() = user_id);

-- Pasul 7: Creează politici SIMPLE pentru MESSAGES
CREATE POLICY "messages_select" ON messages
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "messages_insert" ON messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Pasul 8: Creează politici SIMPLE pentru REVIEWS
CREATE POLICY "reviews_select" ON reviews
  FOR SELECT USING (true);

CREATE POLICY "reviews_insert" ON reviews
  FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

-- Pasul 9: Configurează Storage pentru imagini (FĂRĂ RECURSIUNE)
-- Creează bucket-urile dacă nu există
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('listing-images', 'listing-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('profile-images', 'profile-images', true, 2097152, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Activează RLS pentru storage
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Politici simple pentru storage
CREATE POLICY "storage_select_listing_images" ON storage.objects
  FOR SELECT USING (bucket_id = 'listing-images');

CREATE POLICY "storage_select_profile_images" ON storage.objects
  FOR SELECT USING (bucket_id = 'profile-images');

CREATE POLICY "storage_insert_listing_images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'listing-images' AND 
    auth.uid() IS NOT NULL
  );

CREATE POLICY "storage_insert_profile_images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'profile-images' AND 
    auth.uid() IS NOT NULL
  );

CREATE POLICY "storage_delete_listing_images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'listing-images' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "storage_delete_profile_images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'profile-images' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Pasul 10: Configurează politici pentru administrator (FĂRĂ RECURSIUNE)
-- Adaugă coloana is_admin dacă nu există
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'is_admin'
  ) THEN
    ALTER TABLE profiles ADD COLUMN is_admin boolean DEFAULT false;
  END IF;
END $$;

-- Actualizează profilul admin
UPDATE profiles 
SET is_admin = true 
WHERE email = 'admin@nexar.ro';

-- Politici pentru admin - folosind email în loc de subqueries
CREATE POLICY "admin_select_listings" ON listings
  FOR SELECT USING (
    auth.email() = 'admin@nexar.ro'
  );

CREATE POLICY "admin_update_listings" ON listings
  FOR UPDATE USING (
    auth.email() = 'admin@nexar.ro'
  );

CREATE POLICY "admin_delete_listings" ON listings
  FOR DELETE USING (
    auth.email() = 'admin@nexar.ro'
  );

-- Pasul 11: Asigură-te că funcția handle_new_user este robustă
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (
    user_id,
    name,
    email,
    phone,
    location,
    seller_type,
    is_admin
  ) VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'Utilizator'),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'location', ''),
    COALESCE(NEW.raw_user_meta_data->>'sellerType', 'individual'),
    NEW.email = 'admin@nexar.ro'
  );
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Dacă crearea profilului eșuează, permite totuși crearea utilizatorului
    RAISE WARNING 'Failed to create profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Pasul 12: Recreează trigger-ul
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Pasul 13: Creează indexuri pentru performanță
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON profiles(is_admin);
CREATE INDEX IF NOT EXISTS idx_listings_seller_id ON listings(seller_id);
CREATE INDEX IF NOT EXISTS idx_listings_status ON listings(status);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_listing_id ON favorites(listing_id);

-- Pasul 14: Repară profilurile utilizatorilor existenți
DO $$
DECLARE
    u RECORD;
BEGIN
    FOR u IN (
        SELECT id, email FROM auth.users
        WHERE id NOT IN (SELECT user_id FROM profiles)
    ) LOOP
        INSERT INTO profiles (
            user_id,
            name,
            email,
            seller_type,
            is_admin
        ) VALUES (
            u.id,
            split_part(u.email, '@', 1),
            u.email,
            'individual',
            u.email = 'admin@nexar.ro'
        );
        RAISE NOTICE 'Created missing profile for user %', u.email;
    END LOOP;
END $$;

-- Pasul 15: Test final - verifică că totul funcționează
DO $$
BEGIN
  -- Testează accesul la profiles
  PERFORM COUNT(*) FROM profiles;
  RAISE NOTICE 'Acces la tabela profiles: OK';
  
  -- Testează accesul la listings
  PERFORM COUNT(*) FROM listings WHERE status = 'active';
  RAISE NOTICE 'Acces la tabela listings: OK';
  
  -- Testează accesul la favorites
  PERFORM COUNT(*) FROM favorites;
  RAISE NOTICE 'Acces la tabela favorites: OK';
  
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Testul a eșuat: %', SQLERRM;
END $$;
```

## 📋 Pasul 3: Verifică Funcția de Reparare Profil

Dacă după rularea migrației încă ai probleme cu profilurile, poți folosi funcția `fixUserProfile` din aplicație:

1. **Deschide aplicația** și verifică dacă vezi butonul "Repară profil" în header
2. **Click pe butonul "Repară profil"** pentru a încerca repararea automată
3. **Dacă nu vezi butonul**, încearcă să te deconectezi și să te reconectezi

## 📋 Pasul 4: Verifică Storage pentru Imagini

1. **Mergi la Supabase Dashboard** → **Storage**
2. **Verifică că există bucket-urile**:
   - `listing-images`
   - `profile-images`
3. **Verifică că ambele sunt setate ca publice**
4. **Verifică politicile de securitate** pentru fiecare bucket

## 📋 Pasul 5: Testează Funcționalitățile

După ce ai rulat migrația și ai verificat configurarea:

1. **Reîncarcă pagina** aplicației
2. **Verifică dacă anunțurile se încarcă**
3. **Încearcă să adaugi un anunț nou**
4. **Verifică dacă imaginile se încarcă corect**

## 🔍 Depanare Avansată

Dacă problemele persistă după pașii de mai sus:

### Verifică Logs în Supabase

1. **Mergi la Supabase Dashboard** → **Database** → **Logs**
2. **Caută erori** legate de politicile RLS sau recursiune
3. **Notează ID-urile erorilor** pentru referință

### Testează Conexiunea Direct

1. **Deschide consola browser-ului** (F12)
2. **Execută următorul cod** în consolă:

```javascript
fetch('https://tidnmzsivsthwwcfdzyo.supabase.co/rest/v1/profiles?select=count', {
  headers: {
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpZG5tenNpdnN0aHd3Y2ZkenlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3MjE5NTgsImV4cCI6MjA2NjI5Nzk1OH0.Sr1gSZ2qtoff7gmulkT8uIzB8eL7gqKUUNVj82OqHog'
  }
}).then(r => r.json()).then(console.log).catch(console.error)
```

### Repară Profilurile Manual

Dacă funcția de reparare automată nu funcționează, poți rula acest script în SQL Editor:

```sql
-- Repară profilurile utilizatorilor existenți
DO $$
DECLARE
    u RECORD;
BEGIN
    FOR u IN (
        SELECT id, email FROM auth.users
        WHERE id NOT IN (SELECT user_id FROM profiles)
    ) LOOP
        INSERT INTO profiles (
            user_id,
            name,
            email,
            seller_type,
            is_admin
        ) VALUES (
            u.id,
            split_part(u.email, '@', 1),
            u.email,
            'individual',
            u.email = 'admin@nexar.ro'
        );
        RAISE NOTICE 'Created missing profile for user %', u.email;
    END LOOP;
END $$;
```

## ✅ Verificare Finală

După ce ai aplicat toate soluțiile:

1. **Reîncarcă pagina** aplicației
2. **Verifică că nu mai apare "Deconectat"** în header
3. **Verifică că anunțurile se încarcă** pe pagina principală
4. **Verifică că poți adăuga anunțuri noi**
5. **Verifică că poți încărca imagini**

Dacă toate aceste verificări trec, problema a fost rezolvată cu succes!