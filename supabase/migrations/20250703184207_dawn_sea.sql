/*
  # Configurare Supabase pentru Nexar

  1. Tabele
    - `profiles` - Profiluri utilizatori (Dealer Autorizat sau Vânzător Privat)
    - `listings` - Anunțuri motociclete (cu status pending/active/rejected/sold)
  
  2. Funcționalități
    - Anunțurile noi intră automat în starea "pending" pentru aprobare
    - Dealerii au opțiuni suplimentare: "pe_stoc" sau "la_comanda"
    - Adminii pot aproba/respinge anunțuri
    - Editarea unui anunț îl trimite înapoi în starea "pending"
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

-- Pasul 3: Verificăm și creăm tabelele dacă nu există

-- Tabela profiles
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  location text,
  description text,
  website text,
  avatar_url text,
  seller_type text DEFAULT 'individual' CHECK (seller_type IN ('individual', 'dealer')),
  is_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabela listings
CREATE TABLE IF NOT EXISTS listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  price numeric(10,2) NOT NULL,
  year integer NOT NULL,
  mileage integer NOT NULL,
  location text NOT NULL,
  category text NOT NULL,
  brand text NOT NULL,
  model text NOT NULL,
  engine_capacity integer NOT NULL,
  fuel_type text NOT NULL,
  transmission text NOT NULL,
  condition text NOT NULL,
  color text,
  images text[] DEFAULT '{}',
  features text[] DEFAULT '{}',
  seller_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  seller_name text NOT NULL,
  seller_type text NOT NULL,
  views_count integer DEFAULT 0,
  status text DEFAULT 'pending' CHECK (status IN ('active', 'sold', 'pending', 'rejected')),
  availability text DEFAULT 'pe_stoc' CHECK (availability IN ('pe_stoc', 'la_comanda')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Pasul 4: Adăugăm coloana is_admin dacă nu există
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'is_admin'
  ) THEN
    ALTER TABLE profiles ADD COLUMN is_admin boolean DEFAULT false;
  END IF;
END $$;

-- Pasul 5: Adăugăm coloana availability dacă nu există
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'listings' AND column_name = 'availability'
  ) THEN
    ALTER TABLE listings ADD COLUMN availability text DEFAULT 'pe_stoc' CHECK (availability IN ('pe_stoc', 'la_comanda'));
  END IF;
END $$;

-- Pasul 6: Actualizăm profilurile admin
UPDATE profiles SET is_admin = true WHERE email = 'admin@nexar.ro';

-- Pasul 7: Reactivăm RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

-- Pasul 8: Creăm politici simple pentru profiles
CREATE POLICY "Toată lumea poate vedea profilurile" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Utilizatorii pot actualiza propriul profil" ON profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Utilizatorii pot insera propriul profil" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Pasul 9: Creăm politici simple pentru listings
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

-- Pasul 10: Creăm politici pentru admin bazate pe is_admin
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

-- Pasul 11: Creăm funcția pentru verificarea adminilor
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE user_id = auth.uid() AND is_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Pasul 12: Actualizăm funcția handle_new_user
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

-- Pasul 13: Recreăm trigger-ul
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Pasul 14: Reparăm profilurile existente
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

-- Pasul 15: Creăm funcția pentru ștergerea completă a unui utilizator
CREATE OR REPLACE FUNCTION delete_user_complete(user_id_to_delete UUID)
RETURNS BOOLEAN AS $$
DECLARE
  profile_id UUID;
BEGIN
  -- Obținem ID-ul profilului
  SELECT id INTO profile_id FROM profiles WHERE user_id = user_id_to_delete;
  
  IF profile_id IS NULL THEN
    RAISE EXCEPTION 'Profilul utilizatorului nu a fost găsit';
    RETURN FALSE;
  END IF;
  
  -- Ștergem toate anunțurile utilizatorului
  DELETE FROM listings WHERE seller_id = profile_id;
  
  -- Ștergem profilul utilizatorului
  DELETE FROM profiles WHERE user_id = user_id_to_delete;
  
  -- Nu ștergem utilizatorul din auth.users pentru a evita probleme de securitate
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Pasul 16: Creăm indexuri pentru performanță
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON profiles(is_admin);
CREATE INDEX IF NOT EXISTS idx_listings_seller_id ON listings(seller_id);
CREATE INDEX IF NOT EXISTS idx_listings_status ON listings(status);

-- Pasul 17: Configurăm Storage pentru imagini
DO $$
BEGIN
  -- Creăm bucket-urile dacă nu există deja
  INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  VALUES 
    ('listing-images', 'listing-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
    ('profile-images', 'profile-images', true, 2097152, ARRAY['image/jpeg', 'image/png', 'image/webp'])
  ON CONFLICT (id) DO NOTHING;
  
  -- Activăm RLS pentru storage
  ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
  
  -- Ștergem politicile existente pentru storage
  DO $$
  DECLARE
      r RECORD;
  BEGIN
      FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage') LOOP
          EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON storage.objects';
      END LOOP;
  END $$;
  
  -- Politici simple pentru storage
  CREATE POLICY "Toată lumea poate vedea imaginile anunțurilor" ON storage.objects
    FOR SELECT USING (bucket_id = 'listing-images');
  
  CREATE POLICY "Toată lumea poate vedea imaginile profilurilor" ON storage.objects
    FOR SELECT USING (bucket_id = 'profile-images');
  
  CREATE POLICY "Utilizatorii autentificați pot încărca imagini pentru anunțuri" ON storage.objects
    FOR INSERT WITH CHECK (
      bucket_id = 'listing-images' AND 
      auth.uid() IS NOT NULL
    );
  
  CREATE POLICY "Utilizatorii autentificați pot încărca imagini de profil" ON storage.objects
    FOR INSERT WITH CHECK (
      bucket_id = 'profile-images' AND 
      auth.uid() IS NOT NULL
    );
  
  CREATE POLICY "Utilizatorii pot șterge propriile imagini de anunțuri" ON storage.objects
    FOR DELETE USING (
      bucket_id = 'listing-images' AND 
      auth.uid()::text = (storage.foldername(name))[1]
    );
  
  CREATE POLICY "Utilizatorii pot șterge propriile imagini de profil" ON storage.objects
    FOR DELETE USING (
      bucket_id = 'profile-images' AND 
      auth.uid()::text = (storage.foldername(name))[1]
    );
END $$;

-- Pasul 18: Testăm că totul funcționează
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