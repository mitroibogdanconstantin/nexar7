# 📸 Ghid Reparare Upload Imagini pentru Nexar

## 🚨 Problema Identificată

Imaginile încărcate de utilizatori nu se afișează și în schimb apare o imagine placeholder de pe internet.

## 🔧 Cauze Posibile

1. **Storage bucket-urile nu sunt configurate** în Supabase
2. **Politicile de securitate** pentru storage sunt incorecte
3. **URL-urile imaginilor** nu se generează corect
4. **CORS-ul** nu este configurat pentru storage

## 📋 Pași pentru Reparare

### **Pasul 1: Configurează Storage în Supabase**

1. **Mergi la Supabase Dashboard** → **Storage**
2. **Creează bucket-urile necesare**:

#### Bucket pentru imagini anunțuri:
- **Nume**: `listing-images`
- **Public**: ✅ Da
- **File size limit**: 5MB
- **Allowed MIME types**: `image/jpeg,image/png,image/webp`

#### Bucket pentru imagini profil:
- **Nume**: `profile-images`  
- **Public**: ✅ Da
- **File size limit**: 2MB
- **Allowed MIME types**: `image/jpeg,image/png,image/webp`

### **Pasul 2: Configurează Politicile de Securitate**

1. **Pentru fiecare bucket**, mergi la tab-ul **Policies**
2. **Adaugă următoarele politici**:

#### Politică pentru citire (SELECT):
```sql
-- Toată lumea poate vedea imaginile
CREATE POLICY "Public read access" ON storage.objects
FOR SELECT USING (bucket_id = 'listing-images');

CREATE POLICY "Public read access" ON storage.objects  
FOR SELECT USING (bucket_id = 'profile-images');
```

#### Politică pentru încărcare (INSERT):
```sql
-- Utilizatorii autentificați pot încărca imagini
CREATE POLICY "Authenticated users can upload" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'listing-images' AND 
  auth.uid() IS NOT NULL
);

CREATE POLICY "Authenticated users can upload" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'profile-images' AND 
  auth.uid() IS NOT NULL  
);
```

#### Politică pentru ștergere (DELETE):
```sql
-- Utilizatorii pot șterge doar propriile imagini
CREATE POLICY "Users can delete own images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'listing-images' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete own images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'profile-images' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);
```

### **Pasul 3: Rulează Script-ul SQL pentru Storage**

1. **Mergi la SQL Editor** în Supabase
2. **Rulează următorul script**:

```sql
-- Creează bucket-urile dacă nu există
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('listing-images', 'listing-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('profile-images', 'profile-images', true, 2097152, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Activează RLS pentru storage
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Șterge politicile existente pentru a le recrea
DROP POLICY IF EXISTS "Public read listing images" ON storage.objects;
DROP POLICY IF EXISTS "Public read profile images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated upload listing images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated upload profile images" ON storage.objects;
DROP POLICY IF EXISTS "Users delete own listing images" ON storage.objects;
DROP POLICY IF EXISTS "Users delete own profile images" ON storage.objects;

-- Politici pentru citire publică
CREATE POLICY "Public read listing images" ON storage.objects
FOR SELECT USING (bucket_id = 'listing-images');

CREATE POLICY "Public read profile images" ON storage.objects
FOR SELECT USING (bucket_id = 'profile-images');

-- Politici pentru încărcare autentificată
CREATE POLICY "Authenticated upload listing images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'listing-images' AND 
  auth.uid() IS NOT NULL
);

CREATE POLICY "Authenticated upload profile images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'profile-images' AND 
  auth.uid() IS NOT NULL
);

-- Politici pentru ștergere proprie
CREATE POLICY "Users delete own listing images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'listing-images' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users delete own profile images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'profile-images' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);
```

### **Pasul 4: Verifică Configurarea**

1. **Testează încărcarea unei imagini**:
   - Mergi la `/adauga-anunt`
   - Încearcă să încarci o imagine
   - Verifică că se afișează în preview

2. **Verifică în Supabase Storage**:
   - Mergi la **Storage** → **listing-images**
   - Verifică că imaginea a fost încărcată
   - Click pe imagine să vezi dacă se deschide

3. **Verifică URL-urile**:
   - URL-urile trebuie să arate așa: `https://your-project.supabase.co/storage/v1/object/public/listing-images/user-id/image-name.jpg`

## 🔍 Debugging

### Verifică în Console Browser:
1. **Deschide Developer Tools** (F12)
2. **Mergi la tab-ul Network**
3. **Încearcă să încarci o imagine**
4. **Verifică request-urile** către Supabase Storage

### Erori Comune:

#### "403 Forbidden" la încărcare:
- **Cauza**: Politici RLS incorecte
- **Soluția**: Rulează din nou script-ul pentru politici

#### "404 Not Found" la afișare:
- **Cauza**: Bucket-ul nu există sau nu este public
- **Soluția**: Verifică că bucket-ul este marcat ca public

#### "CORS Error":
- **Cauza**: CORS nu este configurat
- **Soluția**: Adaugă domeniul în Settings → API → CORS

## ✅ Checklist Final

- [ ] Bucket-urile `listing-images` și `profile-images` sunt create
- [ ] Bucket-urile sunt marcate ca publice
- [ ] Politicile RLS sunt configurate corect
- [ ] Script-ul SQL a fost rulat cu succes
- [ ] Testarea încărcării funcționează
- [ ] Imaginile se afișează corect în aplicație

**🎉 Upload-ul de imagini funcționează acum perfect!**