/*
  # Reparare Politici Admin și Rezolvare Recursivitate

  1. Probleme rezolvate:
    - Recursivitate infinită în politicile RLS
    - Verificare admin bazată pe email în loc de is_admin
    - Lipsă coloană is_admin în profiles
    - Probleme cu crearea profilurilor

  2. Soluție:
    - Dezactivare temporară RLS
    - Ștergere politici problematice
    - Creare politici simple, fără recursiune
    - Adăugare coloană is_admin
    - Actualizare funcție handle_new_user
*/

-- Pasul 1: Dezactivăm temporar RLS
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE listings DISABLE ROW LEVEL SECURITY;

-- Pasul 2: Ștergem politicile existente
DO $$
DECLARE
    r RECORD;
BEGIN
    -- Șterge politicile pentru profiles
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'profiles' AND schemaname = 'public') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.profiles';
    END LOOP;
    
    -- Șterge politicile pentru listings
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'listings' AND schemaname = 'public') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.listings';
    END LOOP;
END $$;

-- Pasul 3: Adăugăm coloana is_admin dacă nu există
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'is_admin'
  ) THEN
    ALTER TABLE profiles ADD COLUMN is_admin boolean DEFAULT false;
  END IF;
END $$;

-- Pasul 4: Actualizăm profilurile admin
UPDATE profiles SET is_admin = true WHERE email = 'admin@nexar.ro';

-- Pasul 5: Reactivăm RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

-- Pasul 6: Creăm politici simple pentru profiles
CREATE POLICY "Toată lumea poate vedea profilurile" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Utilizatorii pot actualiza propriul profil" ON profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Utilizatorii pot insera propriul profil" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Pasul 7: Creăm politici simple pentru listings
CREATE POLICY "Toată lumea poate vedea anunțurile active" ON listings
  FOR SELECT USING (status = 'active');

CREATE POLICY "Utilizatorii autentificați pot crea anunțuri" ON listings
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Utilizatorii pot actualiza propriile anunțuri" ON listings
  FOR UPDATE USING (
    auth.uid() IS NOT NULL AND 
    seller_id IN (
      SELECT id FROM profiles 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Utilizatorii pot șterge propriile anunțuri" ON listings
  FOR DELETE USING (
    auth.uid() IS NOT NULL AND 
    seller_id IN (
      SELECT id FROM profiles 
      WHERE user_id = auth.uid()
    )
  );

-- Pasul 8: Creăm politici pentru admin bazate pe is_admin
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

-- Pasul 9: Actualizăm funcția handle_new_user
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
    RAISE WARNING 'Failed to create profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Pasul 10: Recreăm trigger-ul
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Pasul 11: Reparăm profilurile existente
DO $$
DECLARE
    u RECORD;
BEGIN
    FOR u IN (
        SELECT id, email FROM auth.users
        WHERE id NOT IN (SELECT user_id FROM profiles WHERE user_id IS NOT NULL)
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
    END LOOP;
END $$;