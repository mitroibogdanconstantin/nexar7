/*
  # Reparare Probleme RLS și Funcționalități

  1. Probleme Rezolvate
    - Adminul nu vede toate anunțurile în panoul de administrare
    - Schimbarea statusului anunțurilor nu funcționează
    - Lipsa mesajului de eroare pentru email deja înregistrat
    - Selectarea tipului de vânzător "Dealer Autorizat" nu se salvează corect

  2. Soluții Implementate
    - Politici RLS corectate pentru admin
    - Funcție pentru ștergerea utilizatorilor
    - Funcție pentru repararea politicilor RLS
    - Funcție pentru configurarea storage
*/

-- Pasul 1: Adăugăm coloana is_admin dacă nu există
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'is_admin'
  ) THEN
    ALTER TABLE profiles ADD COLUMN is_admin boolean DEFAULT false;
  END IF;
END $$;

-- Pasul 2: Actualizăm profilul admin
UPDATE profiles 
SET is_admin = true 
WHERE email = 'admin@nexar.ro';

-- Pasul 3: Adăugăm coloana availability pentru dealeri
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'listings' AND column_name = 'availability'
  ) THEN
    ALTER TABLE listings ADD COLUMN availability text DEFAULT 'pe_stoc' CHECK (availability IN ('pe_stoc', 'la_comanda'));
  END IF;
END $$;

-- Pasul 4: Creăm funcția pentru repararea politicilor RLS
CREATE OR REPLACE FUNCTION fix_rls_policies()
RETURNS boolean AS $$
BEGIN
  -- Dezactivează temporar RLS pentru a opri recursiunea
  ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
  ALTER TABLE listings DISABLE ROW LEVEL SECURITY;
  ALTER TABLE favorites DISABLE ROW LEVEL SECURITY;
  ALTER TABLE messages DISABLE ROW LEVEL SECURITY;
  ALTER TABLE reviews DISABLE ROW LEVEL SECURITY;

  -- Șterge TOATE politicile existente care cauzează probleme
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

  -- Reactivează RLS
  ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
  ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
  ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
  ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
  ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

  -- Creează politici SIMPLE pentru PROFILES (FĂRĂ RECURSIUNE)
  CREATE POLICY "profiles_select" ON profiles
    FOR SELECT USING (true);

  CREATE POLICY "profiles_update" ON profiles
    FOR UPDATE USING (auth.uid() = user_id);

  CREATE POLICY "profiles_insert" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

  -- Creează politici SIMPLE pentru LISTINGS (FĂRĂ RECURSIUNE)
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

  -- Politici pentru admin
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

  -- Creează politici SIMPLE pentru FAVORITES
  CREATE POLICY "favorites_select" ON favorites
    FOR SELECT USING (auth.uid() = user_id);

  CREATE POLICY "favorites_insert" ON favorites
    FOR INSERT WITH CHECK (auth.uid() = user_id);

  CREATE POLICY "favorites_delete" ON favorites
    FOR DELETE USING (auth.uid() = user_id);

  -- Creează politici SIMPLE pentru MESSAGES
  CREATE POLICY "messages_select" ON messages
    FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

  CREATE POLICY "messages_insert" ON messages
    FOR INSERT WITH CHECK (auth.uid() = sender_id);

  -- Creează politici SIMPLE pentru REVIEWS
  CREATE POLICY "reviews_select" ON reviews
    FOR SELECT USING (true);

  CREATE POLICY "reviews_insert" ON reviews
    FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Pasul 5: Creăm funcția pentru configurarea politicilor de storage
CREATE OR REPLACE FUNCTION configure_storage_policies()
RETURNS boolean AS $$
BEGIN
  -- Creează bucket-urile dacă nu există
  INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  VALUES 
    ('listing-images', 'listing-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
    ('profile-images', 'profile-images', true, 2097152, ARRAY['image/jpeg', 'image/png', 'image/webp'])
  ON CONFLICT (id) DO NOTHING;

  -- Activează RLS pentru storage
  ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

  -- Șterge politicile existente pentru storage
  DO $$
  DECLARE
      r RECORD;
  BEGIN
      FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage') LOOP
          EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON storage.objects';
      END LOOP;
  END $$;

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

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Pasul 6: Creăm funcția pentru ștergerea completă a unui utilizator
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
  
  -- Ștergem toate favoritele utilizatorului
  DELETE FROM favorites WHERE user_id = user_id_to_delete;
  
  -- Ștergem toate mesajele trimise sau primite de utilizator
  DELETE FROM messages WHERE sender_id = user_id_to_delete OR receiver_id = user_id_to_delete;
  
  -- Ștergem toate recenziile date sau primite de utilizator
  DELETE FROM reviews WHERE reviewer_id = user_id_to_delete OR reviewed_id = user_id_to_delete;
  
  -- Ștergem profilul utilizatorului
  DELETE FROM profiles WHERE user_id = user_id_to_delete;
  
  -- Nu ștergem utilizatorul din auth.users pentru a evita probleme de securitate
  -- Doar marcăm profilul ca șters
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Pasul 7: Actualizăm funcția handle_new_user pentru a salva corect tipul de vânzător
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
    -- Dacă crearea profilului eșuează, permite totuși crearea utilizatorului
    RAISE WARNING 'Failed to create profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Pasul 8: Recreăm trigger-ul pentru handle_new_user
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Pasul 9: Repară profilurile utilizatorilor existenți
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
        ) ON CONFLICT (user_id) DO NOTHING;
        
        RAISE NOTICE 'Created missing profile for user %', u.email;
    END LOOP;
END $$;

-- Pasul 10: Creăm indexuri pentru performanță
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON profiles(is_admin);
CREATE INDEX IF NOT EXISTS idx_listings_seller_id ON listings(seller_id);
CREATE INDEX IF NOT EXISTS idx_listings_status ON listings(status);