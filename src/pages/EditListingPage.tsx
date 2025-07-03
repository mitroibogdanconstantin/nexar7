import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { X, Plus, Check, AlertTriangle, Camera, ArrowLeft, ChevronDown, Trash2, Store, Clock } from 'lucide-react';
import { listings, isAuthenticated, supabase, romanianCities, admin } from '../lib/supabase';
import SuccessModal from '../components/SuccessModal';
import FixSupabaseButton from '../components/FixSupabaseButton';
import NetworkErrorHandler from '../components/NetworkErrorHandler';

const EditListingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [originalListing, setOriginalListing] = useState<any>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [images, setImages] = useState<string[]>([]);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [imagesToRemove, setImagesToRemove] = useState<string[]>([]);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [filteredCities, setFilteredCities] = useState<string[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [networkError, setNetworkError] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    description: '',
    mileage: '',
    year: '',
    location: '',
    condition: '',
    category: '',
    brand: '',
    model: '',
    engine_capacity: '',
    fuel_type: '',
    transmission: '',
    color: '',
    features: [] as string[],
    phone: '',
    email: '',
    status: '',
    availability: 'pe_stoc'
  });

  const availabilityOptions = [
    { value: "pe_stoc", label: "Pe stoc", icon: Store },
    { value: "la_comanda", label: "La comandă", icon: Clock },
  ];

  useEffect(() => {
    loadListing();
  }, [id]);

  const loadListing = async () => {
    try {
      setIsLoading(true);
      setNetworkError(null);
      
      // Verificăm dacă utilizatorul este admin
      const isAdminUser = await admin.isAdmin();
      setIsAdmin(isAdminUser);
      
      const isLoggedIn = await isAuthenticated();
      if (!isLoggedIn) {
        navigate('/auth');
        return;
      }

      if (!id) {
        navigate('/profil');
        return;
      }

      const { data: listingData, error } = await supabase
        .from('listings')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error("Error loading listing:", error);
        if (error.message?.includes('fetch') || error.message?.includes('network')) {
          setNetworkError(error);
        } else {
          alert('Anunțul nu a fost găsit');
          navigate('/profil');
        }
        return;
      }

      if (!listingData) {
        alert('Anunțul nu a fost găsit');
        navigate('/profil');
        return;
      }

      // Verifică proprietatea doar dacă utilizatorul nu este admin
      if (!isAdminUser) {
        const { data: { user } } = await supabase.auth.getUser();
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user?.id)
          .single();

        if (!profile || profile.id !== listingData.seller_id) {
          alert('Nu poți edita acest anunț');
          navigate('/profil');
          return;
        }
      }

      setOriginalListing(listingData);
      setImages(listingData.images || []);
      
      // Mapăm valorile din baza de date la valorile din formular
      const mappedCondition = mapDatabaseValueToDisplay('condition', listingData.condition);
      const mappedFuelType = mapDatabaseValueToDisplay('fuel_type', listingData.fuel_type);
      const mappedTransmission = mapDatabaseValueToDisplay('transmission', listingData.transmission);
      const mappedCategory = mapDatabaseValueToDisplay('category', listingData.category);
      
      setFormData({
        title: listingData.title || '',
        price: listingData.price?.toString() || '',
        description: listingData.description || '',
        mileage: listingData.mileage?.toString() || '',
        year: listingData.year?.toString() || '',
        location: listingData.location || '',
        condition: mappedCondition,
        category: mappedCategory,
        brand: listingData.brand || '',
        model: listingData.model || '',
        engine_capacity: listingData.engine_capacity?.toString() || '',
        fuel_type: mappedFuelType,
        transmission: mappedTransmission,
        color: listingData.color || '',
        features: listingData.features || [],
        phone: '',
        email: '',
        status: listingData.status || 'pending',
        availability: listingData.availability || 'pe_stoc'
      });

    } catch (err: any) {
      console.error('Error:', err);
      if (err.message?.includes('fetch') || err.message?.includes('network')) {
        setNetworkError(err);
      } else {
        navigate('/profil');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Mapare pentru valorile din baza de date la valorile de afișare
  const mapDatabaseValueToDisplay = (field: string, value: string): string => {
    if (!value) return '';
    
    switch (field) {
      case 'category':
        return value.charAt(0).toUpperCase() + value.slice(1);
      
      case 'fuel_type':
        const fuelMap: Record<string, string> = {
          'benzina': 'Benzină',
          'electric': 'Electric',
          'hibrid': 'Hibrid'
        };
        return fuelMap[value] || value;
      
      case 'transmission':
        const transmissionMap: Record<string, string> = {
          'manuala': 'Manual',
          'automata': 'Automat',
          'semi-automata': 'Semi-automat'
        };
        return transmissionMap[value] || value;
      
      case 'condition':
        const conditionMap: Record<string, string> = {
          'noua': 'Nouă',
          'excelenta': 'Excelentă',
          'foarte_buna': 'Foarte bună',
          'buna': 'Bună',
          'satisfacatoare': 'Satisfăcătoare'
        };
        return conditionMap[value] || value;
      
      default:
        return value;
    }
  };

  // Mapare pentru valorile din formular la valorile din baza de date
  const mapValueForDatabase = (field: string, value: string): string => {
    switch (field) {
      case 'category':
        return value.toLowerCase();
      
      case 'fuel_type':
        const fuelMap: Record<string, string> = {
          'Benzină': 'benzina',
          'Electric': 'electric',
          'Hibrid': 'hibrid'
        };
        return fuelMap[value] || value.toLowerCase();
      
      case 'transmission':
        const transmissionMap: Record<string, string> = {
          'Manual': 'manuala',
          'Automat': 'automata',
          'Semi-automat': 'semi-automata'
        };
        return transmissionMap[value] || value.toLowerCase();
      
      case 'condition':
        const conditionMap: Record<string, string> = {
          'Nouă': 'noua',
          'Excelentă': 'excelenta',
          'Foarte bună': 'foarte_buna',
          'Bună': 'buna',
          'Satisfăcătoare': 'satisfacatoare'
        };
        return conditionMap[value] || value.toLowerCase();
      
      default:
        return value;
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFeatureToggle = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const handleLocationChange = (value: string) => {
    handleInputChange('location', value);
    
    if (value.length > 0) {
      const filtered = romanianCities.filter(city =>
        city.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 10); // Limităm la 10 rezultate
      setFilteredCities(filtered);
      setShowLocationDropdown(true);
    } else {
      setFilteredCities([]);
      setShowLocationDropdown(false);
    }
  };

  const selectCity = (city: string) => {
    handleInputChange('location', city);
    setShowLocationDropdown(false);
    setFilteredCities([]);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && (images.length + newImageFiles.length) < 5) {
      const newFiles = Array.from(files).slice(0, 5 - images.length - newImageFiles.length);
      
      // Verificăm fiecare fișier
      for (const file of newFiles) {
        // Validare dimensiune (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          setErrors(prev => ({ ...prev, images: 'Fișierul nu poate depăși 5MB' }));
          return;
        }
        
        // Validare tip fișier
        if (!file.type.startsWith('image/')) {
          setErrors(prev => ({ ...prev, images: 'Doar fișiere imagine sunt permise' }));
          return;
        }
      }
      
      // Adăugăm fișierele valide
      setNewImageFiles(prev => [...prev, ...newFiles]);
      
      // Generăm URL-uri pentru previzualizare
      newFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            // Adăugăm la previzualizări, dar nu la imaginile originale
            const previewUrl = e.target.result as string;
            setImages(prev => [...prev, previewUrl]);
            
            // Clear image errors when successfully adding
            setErrors(prev => ({ ...prev, images: '' }));
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    const imageToRemove = images[index];
    
    // Verificăm dacă este o imagine existentă sau una nouă
    if (originalListing && originalListing.images && originalListing.images.includes(imageToRemove)) {
      // Este o imagine existentă, o marcăm pentru ștergere
      setImagesToRemove(prev => [...prev, imageToRemove]);
    } else {
      // Este o imagine nouă, o eliminăm din fișierele noi
      const previewIndex = images.indexOf(imageToRemove);
      const fileIndex = previewIndex - (originalListing?.images?.length || 0);
      
      if (fileIndex >= 0) {
        setNewImageFiles(prev => prev.filter((_, i) => i !== fileIndex));
      }
    }
    
    // Eliminăm din previzualizări
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) newErrors.title = 'Titlul este obligatoriu';
    if (formData.title.length > 100) newErrors.title = 'Titlul nu poate depăși 100 de caractere';
    
    if (!formData.price) newErrors.price = 'Prețul este obligatoriu';
    
    // Descrierea nu mai este obligatorie
    if (formData.description.length > 2000) {
      newErrors.description = 'Descrierea nu poate depăși 2000 de caractere';
    }
    
    if (!formData.category) newErrors.category = 'Categoria este obligatorie';
    if (!formData.brand) newErrors.brand = 'Marca este obligatorie';
    if (!formData.model.trim()) newErrors.model = 'Modelul este obligatoriu';
    
    if (!formData.year) {
      newErrors.year = 'Anul este obligatoriu';
    } else {
      const year = parseInt(formData.year);
      const currentYear = new Date().getFullYear();
      if (year < 1990 || year > currentYear + 1) {
        newErrors.year = `Anul trebuie să fie între 1990 și ${currentYear + 1}`;
      }
    }
    
    if (!formData.mileage) {
      newErrors.mileage = 'Kilometrajul este obligatoriu';
    } else {
      const mileage = parseInt(formData.mileage);
      if (mileage < 0 || mileage > 500000) {
        newErrors.mileage = 'Kilometrajul trebuie să fie între 0 și 500,000 km';
      }
    }
    
    if (!formData.engine_capacity) {
      newErrors.engine_capacity = 'Capacitatea motorului este obligatorie';
    } else {
      const engine = parseInt(formData.engine_capacity);
      if (engine < 50 || engine > 3000) {
        newErrors.engine_capacity = 'Capacitatea motorului trebuie să fie între 50 și 3000 cc';
      }
    }
    
    if (!formData.fuel_type) newErrors.fuel_type = 'Tipul de combustibil este obligatoriu';
    if (!formData.transmission) newErrors.transmission = 'Transmisia este obligatorie';
    if (!formData.color.trim()) newErrors.color = 'Culoarea este obligatorie';
    if (!formData.condition) newErrors.condition = 'Starea este obligatorie';
    if (!formData.location.trim()) {
      newErrors.location = 'Locația este obligatorie';
    } else if (!romanianCities.includes(formData.location.trim())) {
      newErrors.location = 'Te rugăm să selectezi un oraș din lista disponibilă';
    }
    
    if (images.length === 0) {
      newErrors.images = 'Trebuie să adaugi cel puțin o fotografie';
    }
    
    // Verifică disponibilitatea pentru dealeri
    if (originalListing?.seller_type === "dealer" && !formData.availability) {
      newErrors.availability = "Disponibilitatea este obligatorie pentru dealeri";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Pregătim datele pentru actualizare
      const updateData = {
        title: formData.title.trim(),
        price: parseFloat(formData.price),
        description: formData.description.trim() || '', // Descriere poate fi goală
        mileage: parseInt(formData.mileage),
        year: parseInt(formData.year),
        location: formData.location.trim(),
        category: mapValueForDatabase('category', formData.category),
        brand: formData.brand,
        model: formData.model.trim(),
        engine_capacity: parseInt(formData.engine_capacity),
        fuel_type: mapValueForDatabase('fuel_type', formData.fuel_type),
        transmission: mapValueForDatabase('transmission', formData.transmission),
        condition: mapValueForDatabase('condition', formData.condition),
        color: formData.color.trim(),
        features: formData.features,
        updated_at: new Date().toISOString(),
        // Dacă este admin, păstrăm statusul selectat, altfel setăm la pending
        status: isAdmin ? formData.status : 'pending',
        // Adăugăm disponibilitatea doar pentru dealeri
        availability: originalListing.seller_type === 'dealer' ? formData.availability : 'pe_stoc'
      };
      
      // Actualizăm anunțul
      const { data, error } = await listings.update(
        id!, 
        updateData, 
        newImageFiles.length > 0 ? newImageFiles : undefined,
        imagesToRemove.length > 0 ? imagesToRemove : undefined
      );
      
      if (error) {
        throw error;
      }
      
      setShowSuccessModal(true);
      
    } catch (error: any) {
      console.error('Error updating listing:', error);
      alert('Eroare la actualizarea anunțului: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-nexar-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (networkError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <NetworkErrorHandler 
          error={networkError} 
          onRetry={loadListing} 
        />
      </div>
    );
  }

  if (errors.general) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Eroare la încărcare
          </h2>
          <p className="text-gray-600 mb-6">
            {errors.general}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => window.location.reload()}
              className="bg-nexar-accent text-white px-6 py-3 rounded-lg font-semibold hover:bg-nexar-gold transition-colors"
            >
              Reîncarcă pagina
            </button>
            <FixSupabaseButton buttonText="Repară Conexiunea" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <button
            onClick={() => isAdmin ? navigate('/admin') : navigate('/profil')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>{isAdmin ? 'Înapoi la Admin Panel' : 'Înapoi la profil'}</span>
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Editează Anunțul</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informații de bază */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Informații de bază</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titlu anunț *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-nexar-accent focus:border-transparent ${
                      errors.title ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="ex: Yamaha YZF-R1 2023"
                    maxLength={100}
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      {errors.title}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    {formData.title.length}/100 caractere
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categorie *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-nexar-accent focus:border-transparent ${
                      errors.category ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Selectează categoria</option>
                    <option value="Sport">Sport</option>
                    <option value="Touring">Touring</option>
                    <option value="Cruiser">Cruiser</option>
                    <option value="Adventure">Adventure</option>
                    <option value="Naked">Naked</option>
                    <option value="Scooter">Scooter</option>
                    <option value="Enduro">Enduro</option>
                    <option value="Chopper">Chopper</option>
                  </select>
                  {errors.category && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      {errors.category}
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Marcă *
                  </label>
                  <select
                    value={formData.brand}
                    onChange={(e) => handleInputChange('brand', e.target.value)}
                    className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-nexar-accent focus:border-transparent ${
                      errors.brand ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Selectează marca</option>
                    <option value="Yamaha">Yamaha</option>
                    <option value="Honda">Honda</option>
                    <option value="BMW">BMW</option>
                    <option value="Ducati">Ducati</option>
                    <option value="KTM">KTM</option>
                    <option value="Suzuki">Suzuki</option>
                    <option value="Harley-Davidson">Harley-Davidson</option>
                    <option value="Kawasaki">Kawasaki</option>
                    <option value="Triumph">Triumph</option>
                    <option value="Aprilia">Aprilia</option>
                    <option value="MV Agusta">MV Agusta</option>
                    <option value="Benelli">Benelli</option>
                    <option value="Moto Guzzi">Moto Guzzi</option>
                    <option value="Indian">Indian</option>
                    <option value="Zero">Zero</option>
                    <option value="Energica">Energica</option>
                    <option value="Husqvarna">Husqvarna</option>
                    <option value="Beta">Beta</option>
                    <option value="Sherco">Sherco</option>
                    <option value="GasGas">GasGas</option>
                  </select>
                  {errors.brand && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      {errors.brand}
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Model *
                  </label>
                  <input
                    type="text"
                    value={formData.model}
                    onChange={(e) => handleInputChange('model', e.target.value)}
                    className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-nexar-accent focus:border-transparent ${
                      errors.model ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="ex: YZF-R1"
                  />
                  {errors.model && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      {errors.model}
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    An fabricație *
                  </label>
                  <input
                    type="number"
                    value={formData.year}
                    onChange={(e) => handleInputChange('year', e.target.value)}
                    className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-nexar-accent focus:border-transparent ${
                      errors.year ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="2023"
                    min="1990"
                    max="2025"
                  />
                  {errors.year && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      {errors.year}
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kilometraj *
                  </label>
                  <input
                    type="number"
                    value={formData.mileage}
                    onChange={(e) => handleInputChange('mileage', e.target.value)}
                    className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-nexar-accent focus:border-transparent ${
                      errors.mileage ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="25000"
                    min="0"
                    max="500000"
                  />
                  {errors.mileage && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      {errors.mileage}
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Capacitate motor (cc) *
                  </label>
                  <input
                    type="number"
                    value={formData.engine_capacity}
                    onChange={(e) => handleInputChange('engine_capacity', e.target.value)}
                    className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-nexar-accent focus:border-transparent ${
                      errors.engine_capacity ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="998"
                    min="50"
                    max="3000"
                  />
                  {errors.engine_capacity && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      {errors.engine_capacity}
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Combustibil *
                  </label>
                  <select
                    value={formData.fuel_type}
                    onChange={(e) => handleInputChange('fuel_type', e.target.value)}
                    className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-nexar-accent focus:border-transparent ${
                      errors.fuel_type ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Selectează combustibilul</option>
                    <option value="Benzină">Benzină</option>
                    <option value="Electric">Electric</option>
                    <option value="Hibrid">Hibrid</option>
                  </select>
                  {errors.fuel_type && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      {errors.fuel_type}
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Transmisie *
                  </label>
                  <select
                    value={formData.transmission}
                    onChange={(e) => handleInputChange('transmission', e.target.value)}
                    className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-nexar-accent focus:border-transparent ${
                      errors.transmission ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Selectează transmisia</option>
                    <option value="Manual">Manual</option>
                    <option value="Automat">Automat</option>
                    <option value="Semi-automat">Semi-automat</option>
                  </select>
                  {errors.transmission && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      {errors.transmission}
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Culoare *
                  </label>
                  <input
                    type="text"
                    value={formData.color}
                    onChange={(e) => handleInputChange('color', e.target.value)}
                    className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-nexar-accent focus:border-transparent ${
                      errors.color ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="ex: Albastru Racing"
                  />
                  {errors.color && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      {errors.color}
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Starea *
                  </label>
                  <select
                    value={formData.condition}
                    onChange={(e) => handleInputChange('condition', e.target.value)}
                    className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-nexar-accent focus:border-transparent ${
                      errors.condition ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Selectează starea</option>
                    <option value="Nouă">Nouă</option>
                    <option value="Excelentă">Excelentă</option>
                    <option value="Foarte bună">Foarte bună</option>
                    <option value="Bună">Bună</option>
                    <option value="Satisfăcătoare">Satisfăcătoare</option>
                  </select>
                  {errors.condition && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      {errors.condition}
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Locația *
                  </label>
                  <select
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-nexar-accent focus:border-transparent ${
                      errors.location ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Selectează orașul</option>
                    <option value="București S1">București S1</option>
                    <option value="București S2">București S2</option>
                    <option value="București S3">București S3</option>
                    <option value="București S4">București S4</option>
                    <option value="București S5">București S5</option>
                    <option value="București S6">București S6</option>
                    <option value="Cluj-Napoca">Cluj-Napoca</option>
                    <option value="Timișoara">Timișoara</option>
                    <option value="Iași">Iași</option>
                    <option value="Constanța">Constanța</option>
                    <option value="Brașov">Brașov</option>
                    <option value="Craiova">Craiova</option>
                    <option value="Galați">Galați</option>
                    <option value="Oradea">Oradea</option>
                    <option value="Ploiești">Ploiești</option>
                    <option value="Sibiu">Sibiu</option>
                    <option value="Bacău">Bacău</option>
                    <option value="Râmnicu Vâlcea">Râmnicu Vâlcea</option>
                    {romanianCities.map(city => (
                      !city.startsWith("București") && 
                      city !== "Râmnicu Vâlcea" && 
                      city !== "Rm. Vâlcea" && (
                        <option key={city} value={city}>{city}</option>
                      )
                    ))}
                  </select>
                  {errors.location && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      {errors.location}
                    </p>
                  )}
                </div>

                {/* Availability field - only for dealers */}
                {originalListing?.seller_type === "dealer" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Disponibilitate *
                    </label>
                    <div className="flex space-x-4">
                      {availabilityOptions.map((option) => (
                        <label 
                          key={option.value} 
                          className={`flex items-center space-x-2 border rounded-lg px-4 py-3 cursor-pointer transition-colors ${
                            formData.availability === option.value 
                              ? 'border-nexar-accent bg-nexar-accent/5' 
                              : 'border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <input
                            type="radio"
                            name="availability"
                            value={option.value}
                            checked={formData.availability === option.value}
                            onChange={(e) => handleInputChange("availability", e.target.value)}
                            className="sr-only"
                          />
                          <option.icon className={`h-5 w-5 ${formData.availability === option.value ? 'text-nexar-accent' : 'text-gray-400'}`} />
                          <span className={formData.availability === option.value ? 'font-medium' : ''}>
                            {option.label}
                          </span>
                        </label>
                      ))}
                    </div>
                    {errors.availability && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        {errors.availability}
                      </p>
                    )}
                  </div>
                )}

                {/* Status field - only for admin */}
                {isAdmin && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status *
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-nexar-accent focus:border-transparent"
                    >
                      <option value="active">Activ</option>
                      <option value="pending">În așteptare</option>
                      <option value="rejected">Respins</option>
                      <option value="sold">Vândut</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
            
            {/* Fotografii */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Fotografii</h2>
              
              {errors.images && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-600 flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    {errors.images}
                  </p>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg"
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        target.src = "https://images.pexels.com/photos/2116475/pexels-photo-2116475.jpeg";
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    {index === 0 && (
                      <div className="absolute bottom-2 left-2 bg-gray-900 text-white px-2 py-1 rounded text-xs font-semibold">
                        Foto principală
                      </div>
                    )}
                  </div>
                ))}
                
                {images.length < 5 && (
                  <label className="border-2 border-dashed border-gray-300 rounded-lg h-48 flex flex-col items-center justify-center cursor-pointer hover:border-gray-900 transition-colors">
                    <Camera className="h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-gray-600">Adaugă fotografie</span>
                    <span className="text-sm text-gray-400">({images.length}/5)</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">Sfaturi pentru fotografii de calitate:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Fotografiază în lumină naturală</li>
                  <li>• Include imagini din toate unghiurile</li>
                  <li>• Arată detaliile importante și eventualele defecte</li>
                  <li>• Prima fotografie va fi cea principală</li>
                  <li>• Limită de 5MB per imagine</li>
                  <li>• Maxim 5 imagini per anunț</li>
                </ul>
              </div>
            </div>
            
            {/* Preț și descriere */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Preț și descriere</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preț (EUR) *
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-nexar-accent focus:border-transparent text-2xl font-bold ${
                    errors.price ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="18500"
                  min="100"
                  max="1000000"
                />
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    {errors.price}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descriere detaliată
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={8}
                  className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-nexar-accent focus:border-transparent ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Descrie motocicleta în detaliu: starea tehnică, istoricul, modificările, etc."
                />
                <div className="flex justify-between items-center mt-1">
                  {errors.description ? (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      {errors.description}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-500">
                      Maxim 2000 caractere
                    </p>
                  )}
                  <span className={`text-sm ${
                    formData.description.length > 2000 ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {formData.description.length}/2000
                  </span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Dotări și caracteristici
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {['ABS', 'Control tracțiune', 'Suspensie reglabilă', 'Frâne Brembo',
                    'Quickshifter', 'Sistem de navigație', 'Încălzire mânere', 'LED complet',
                    'Bluetooth', 'USB', 'Geantă laterală', 'Parbriz reglabil',
                    'Scaun încălzit', 'Tempomat', 'Sistem anti-furt', 'Jante aliaj'].map(feature => (
                    <label key={feature} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.features.includes(feature)}
                        onChange={() => handleFeatureToggle(feature)}
                        className="rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                      />
                      <span className="text-sm">{feature}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => isAdmin ? navigate('/admin') : navigate('/profil')}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
              >
                Anulează
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-nexar-accent text-white rounded-lg font-semibold hover:bg-nexar-gold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Se salvează...</span>
                  </>
                ) : (
                  <>
                    <span>Salvează Modificările</span>
                    <Check className="h-5 w-5" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        onGoHome={() => isAdmin ? navigate('/admin') : navigate('/profil')}
        onViewListing={() => navigate(`/anunt/${id}`)}
        title="Succes!"
        message={isAdmin 
          ? "Anunțul a fost actualizat cu succes!" 
          : "Anunțul a fost actualizat cu succes și a fost trimis spre aprobare. Va fi vizibil după ce va fi aprobat de administratori."}
        showViewButton={true}
      />
    </div>
  );
};

export default EditListingPage;