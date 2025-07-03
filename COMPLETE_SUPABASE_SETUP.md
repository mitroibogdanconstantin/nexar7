# 🚀 Setup Complet Supabase pentru Nexar

## 📋 **Pasul 1: Rulează TOATE migrațiile în ordine**

### **Mergi la Supabase Dashboard → SQL Editor și rulează în ordine:**

### **1. Prima migrație - Schema de bază:**
```sql
-- Conținutul din 20250618171235_throbbing_field.sql
-- (Rulează exact conținutul din fișierul din proiect)
```

### **2. A doua migrație - Fix profile creation:**
```sql
-- Conținutul din 20250624221303_sweet_waterfall.sql
-- (Rulează exact conținutul din fișierul din proiect)
```

### **3. A treia migrație - Adaugă coloane:**
```sql
-- Conținutul din 20250624230720_pale_scene.sql
-- (Rulează exact conținutul din fișierul din proiect)
```

### **4. A patra migrație - Profiles corect:**
```sql
-- Conținutul din 20250625120408_throbbing_island.sql
-- (Rulează exact conținutul din fișierul din proiect)
```

### **5. A cincea migrație - Toate tabelele cu RLS:**
```sql
-- Conținutul din 20250625120653_broad_dawn.sql
-- (Rulează exact conținutul din fișierul din proiect)
```

## 🔧 **Pasul 2: Configurează Storage**

1. **Mergi la Storage** în Supabase
2. **Creează bucket-urile:**
   - `listing-images` (pentru imaginile anunțurilor)
   - `profile-images` (pentru avatarele utilizatorilor)
3. **Setează politicile:**
   - **Public read** pentru ambele bucket-uri
   - **Authenticated write** pentru ambele bucket-uri

## ✅ **Pasul 3: Verifică configurarea**

### **Verifică tabelele în Table Editor:**
- ✅ `profiles` - cu coloanele: id, user_id, name, email, phone, location, description, website, etc.
- ✅ `listings` - cu coloanele: id, title, price, seller_id, etc.
- ✅ `favorites` - pentru anunțurile favorite
- ✅ `messages` - pentru mesajele între utilizatori
- ✅ `reviews` - pentru recenzii

### **Verifică politicile RLS:**
- ✅ Profiles: vizibile pentru toți, editabile doar de proprietar
- ✅ Listings: vizibile pentru toți, editabile doar de proprietar
- ✅ Favorites: vizibile și editabile doar de proprietar
- ✅ Messages: vizibile doar de expeditor și destinatar

## 🧪 **Pasul 4: Testează fluxul complet**

### **Test 1: Înregistrare utilizator**
1. Mergi la `/auth`
2. Completează formularul de înregistrare cu:
   - **Nume:** Minim 2 caractere, doar litere
   - **Email:** Format valid, unic
   - **Telefon:** Format românesc (ex: 0790454647)
   - **Locația:** Selectează din dropdown cu orașe românești
   - **Parolă:** Minim 8 caractere, cu majusculă, minusculă și cifră
3. **Rezultat așteptat:** Cont creat, profil generat automat

### **Test 2: Autentificare**
1. Conectează-te cu contul creat
2. **Rezultat așteptat:** Login reușit, redirect la homepage

### **Test 3: Creare anunț**
1. Mergi la `/adauga-anunt`
2. Completează toate câmpurile obligatorii
3. Adaugă cel puțin o imagine
4. **Rezultat așteptat:** Anunț creat cu succes

### **Test 4: Vizualizare anunțuri**
1. Mergi la `/anunturi`
2. **Rezultat așteptat:** Vezi anunțul creat

## 🚨 **Probleme comune și soluții:**

### **"relation profiles does not exist"**
- **Cauza:** Migrațiile nu au fost rulate
- **Soluția:** Rulează toate migrațiile în ordine

### **"new row violates row-level security policy"**
- **Cauza:** Politici RLS incorecte
- **Soluția:** Rulează migrația finală cu politicile corecte

### **"Invalid API key"**
- **Cauza:** Credențiale greșite în `.env`
- **Soluția:** Verifică URL-ul și anon key din Supabase Settings → API

## 📊 **Monitorizare și debugging:**

### **În Supabase Dashboard:**
1. **Logs & Analytics** - pentru erori în timp real
2. **Authentication → Users** - pentru utilizatorii înregistrați
3. **Table Editor** - pentru datele din tabele
4. **SQL Editor** - pentru query-uri de test

### **În aplicația Nexar:**
1. **Console browser** - pentru erori JavaScript
2. **Network tab** - pentru request-urile către Supabase
3. **Application tab** - pentru localStorage și session

## 🎯 **Rezultatul final:**

După rularea tuturor migrațiilor:
- ✅ **Înregistrarea** funcționează cu validări complete
- ✅ **Autentificarea** funcționează fără erori
- ✅ **Crearea anunțurilor** funcționează cu RLS corect
- ✅ **Dropdown orașele** funcționează pentru locație
- ✅ **Validările** previn datele invalide
- ✅ **Storage-ul** funcționează pentru imagini

**Aplicația va fi complet funcțională!** 🚀