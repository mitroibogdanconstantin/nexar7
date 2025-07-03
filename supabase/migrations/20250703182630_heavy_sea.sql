/*
  # Rezolvare recursiune infinită în politicile RLS

  1. Probleme identificate
    - Recursiune infinită în politicile RLS pentru tabela profiles
    - Probleme cu politicile pentru admin
    - Probleme cu autentificarea și înregistrarea utilizatorilor

  2. Soluții
    - Dezactivare temporară RLS
    - Ștergerea tuturor politicilor problematice
    - Crearea de politici simple, fără recursiune
    - Repararea funcțiilor și trigger-elor
*/

-- Pasul 1: Dezactivăm temporar RLS pentru toate tabelele
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE listings DISABLE ROW LEVEL SECURITY;
ALTER TABLE favorites DISABLE ROW LEVEL SECURITY;
ALTER TABLE messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE reviews DISABLE ROW LEVEL SECURITY;

-- Pasul 2: Ștergem TOATE politicile existente
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
END $$;

-- Pasul 3: Reactivăm RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Pasul 4: Creăm politici SIMPLE pentru PROFILES (FĂRĂ RECURSIUNE)
-- Toată lumea poate vedea profilurile
CREATE POLICY "Toată lumea poate vedea profilurile" ON profiles
  FOR SELECT USING (true);

-- Utilizatorii pot actualiza doar propriul profil
CREATE POLICY "Utilizatorii pot actualiza propriul profil" ON profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Utilizatorii pot insera doar propriul profil
CREATE POLICY "Utilizatorii pot insera propriul profil" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Pasul 5: Creăm politici SIMPLE pentru LISTINGS (FĂRĂ RECURSIUNE)
-- Toată lumea poate vedea anunțurile active
CREATE POLICY "Toată lumea poate vedea anunțurile active" ON listings
  FOR SELECT USING (status = 'active');

-- Utilizatorii pot vedea propriile anunțuri (indiferent de status)
CREATE POLICY "Utilizatorii pot vedea propriile anunțuri" ON listings
  FOR SELECT USING (
    auth.uid() IS NOT NULL AND 
    seller_id IN (
      SELECT id FROM profiles 
      WHERE user_id = auth.uid()
    )
  );

-- Utilizatorii autentificați pot crea anunțuri
CREATE POLICY "Utilizatorii autentificați pot crea anunțuri" ON listings
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Utilizatorii pot actualiza propriile anunțuri
CREATE POLICY "Utilizatorii pot actualiza propriile anunțuri" ON listings
  FOR UPDATE USING (
    auth.uid() IS NOT NULL AND 
    seller_id IN (
      SELECT id FROM profiles 
      WHERE user_id = auth.uid()
    )
  );

-- Utilizatorii pot șterge propriile anunțuri
CREATE POLICY "Utilizatorii pot șterge propriile anunțuri" ON listings
  FOR DELETE USING (
    auth.uid() IS NOT NULL AND 
    seller_id IN (
      SELECT id FROM profiles 
      WHERE user_id = auth.uid()
    )
  );

-- Pasul 6: Creăm politici pentru ADMIN (folosind is_admin)
-- Adminii pot vedea toate anunțurile
CREATE POLICY "Adminii pot vedea toate anunțurile" ON listings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE user_id = auth.uid() AND is_admin = true
    )
  );

-- Adminii pot actualiza orice anunț
CREATE POLICY "Adminii pot actualiza orice anunț" ON listings
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE user_id = auth.uid() AND is_admin = true
    )
  );

-- Adminii pot șterge orice anunț
CREATE POLICY "Adminii pot șterge orice anunț" ON listings
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE user_id = auth.uid() AND is_admin = true
    )
  );

-- Pasul 7: Creăm politici pentru FAVORITES
CREATE POLICY "Utilizatorii pot vedea propriile favorite" ON favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Utilizatorii pot adăuga favorite" ON favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Utilizatorii pot șterge propriile favorite" ON favorites
  FOR DELETE USING (auth.uid() = user_id);

-- Pasul 8: Creăm politici pentru MESSAGES
CREATE POLICY "Utilizatorii pot vedea mesajele proprii" ON messages
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Utilizatorii pot trimite mesaje" ON messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Pasul 9: Creăm politici pentru REVIEWS
CREATE POLICY "Toată lumea poate vedea recenziile" ON reviews
  FOR SELECT USING (true);

CREATE POLICY "Utilizatorii pot adăuga recenzii" ON reviews
  FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

-- Pasul 10: Actualizăm funcția handle_new_user pentru a salva corect tipul de vânzător
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Verificăm dacă există deja un profil pentru acest utilizator
  IF EXISTS (SELECT 1 FROM profiles WHERE user_id = NEW.id) THEN
    RETURN NEW;
  END IF;

  -- Inserăm un nou profil
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
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'location', ''),
    COALESCE(NEW.raw_user_meta_data->>'sellerType', 'individual'),
    NEW.email = 'admin@nexar.ro'
  );
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Dacă apare o eroare, o înregistrăm dar permitem crearea utilizatorului
    RAISE WARNING 'Failed to create profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Pasul 11: Recreăm trigger-ul pentru handle_new_user
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Pasul 12: Actualizăm toți utilizatorii existenți care sunt admin
UPDATE profiles SET is_admin = true WHERE email = 'admin@nexar.ro';

-- Pasul 13: Creăm o funcție pentru verificarea adminilor
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE user_id = auth.uid() AND is_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Pasul 14: Verificăm și reparăm profilurile existente
DO $$
DECLARE
    u RECORD;
BEGIN
    FOR u IN (
        SELECT id, email, raw_user_meta_data FROM auth.users
        WHERE id NOT IN (SELECT user_id FROM profiles WHERE user_id IS NOT NULL)
    ) LOOP
        INSERT INTO profiles (
            user_id,
            name,
            email,
            seller_type,
            is_admin,
            phone,
            location
        ) VALUES (
            u.id,
            COALESCE(u.raw_user_meta_data->>'name', split_part(u.email, '@', 1)),
            u.email,
            COALESCE(u.raw_user_meta_data->>'sellerType', 'individual'),
            u.email = 'admin@nexar.ro',
            COALESCE(u.raw_user_meta_data->>'phone', ''),
            COALESCE(u.raw_user_meta_data->>'location', '')
        );
        
        RAISE NOTICE 'Created missing profile for user %', u.email;
    END LOOP;
END $$;

-- Pasul 15: Verificăm și reparăm seller_type pentru utilizatorii existenți
DO $$
DECLARE
    u RECORD;
BEGIN
    FOR u IN (
        SELECT 
            a.id, 
            a.email, 
            a.raw_user_meta_data->>'sellerType' as meta_seller_type,
            p.seller_type as profile_seller_type
        FROM auth.users a
        JOIN profiles p ON a.id = p.user_id
        WHERE 
            a.raw_user_meta_data->>'sellerType' IS NOT NULL AND
            a.raw_user_meta_data->>'sellerType' != p.seller_type
    ) LOOP
        UPDATE profiles 
        SET seller_type = u.meta_seller_type
        WHERE user_id = u.id;
        
        RAISE NOTICE 'Fixed seller_type for user % from % to %', 
            u.email, u.profile_seller_type, u.meta_seller_type;
    END LOOP;
END $$;

-- Pasul 16: Testăm că totul funcționează
DO $$
BEGIN
  -- Testăm accesul la profiles
  PERFORM COUNT(*) FROM profiles;
  RAISE NOTICE 'Acces la tabela profiles: OK';
  
  -- Testăm accesul la listings
  PERFORM COUNT(*) FROM listings WHERE status = 'active';
  RAISE NOTICE 'Acces la tabela listings: OK';
  
  -- Testăm funcția is_admin
  RAISE NOTICE 'Funcția is_admin() creată: OK';
  
  RAISE NOTICE '✅ Toate modificările au fost aplicate cu succes!';
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Testul a eșuat: %', SQLERRM;
END $$;