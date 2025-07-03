import React, { useState, useMemo, useRef, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
	Search,
	Filter,
	MapPin,
	Calendar,
	Gauge,
	ChevronLeft,
	ChevronRight,
	Settings,
	Fuel,
	X,
	SlidersHorizontal,
	Building,
	RefreshCw,
	Users,
	Check,
	User,
} from "lucide-react";
import { listings, romanianCities, supabase } from "../lib/supabase"; // Make sure 'listings' is properly defined in supabase.ts to fetch all listings

const HomePage = () => {
	const [searchParams] = useSearchParams();
	// On desktop, show filters by default. On mobile, hide them by default
	const [showFilters, setShowFilters] = useState(window.innerWidth >= 1024);
	const [currentPage, setCurrentPage] = useState(1);
	const [searchQuery, setSearchQuery] = useState("");
	const [filters, setFilters] = useState({
		priceMin: "",
		priceMax: "",
		category: searchParams.get("categorie") || "",
		brand: "",
		yearMin: "",
		yearMax: "",
		location: "",
	});
	const [allListings, setAllListings] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState(true); // Good, you have an isLoading state
	const [error, setError] = useState<string | null>(null); // Good, you have an error state
	const [userScrolled, setUserScrolled] = useState(false);
	const navigate = useNavigate();
	const itemsPerPage = 10; // Show 10 listings per page

	// Load real listings from Supabase
	useEffect(() => {
		loadListings();
	}, [filters, searchQuery, currentPage]); // Dependencies are good here, triggering reload on filter/search/page change

	// Update filters when URL params change
	useEffect(() => {
		const categoryFromUrl = searchParams.get("categorie");
		if (categoryFromUrl) {
			setFilters((prev) => ({ ...prev, category: categoryFromUrl }));
		}
	}, [searchParams]);

	// Track scroll position to prevent auto-hiding filters on mobile
	useEffect(() => {
		const handleScroll = () => {
			setUserScrolled(true);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	// *** This is the core function to focus on ***
	const loadListings = async () => {
		try {
			setIsLoading(true); // Set loading to true at the start
			setError(null); // Clear any previous errors

			console.log("🔄 Loading listings from Supabase...");

			// Ensure 'listings' is correctly defined in your supabase.ts
			// For example, if it's a direct Supabase table:
			// const { data, error: supabaseError } = await supabase.from("listings").select("*");
			// Or if 'listings' is a custom function that already wraps Supabase:
			const { data, error: supabaseError } = await listings.getAll(); // Renamed 'error' to 'supabaseError' to avoid conflict with component's 'error' state

			if (supabaseError) {
				// Check for Supabase-specific errors
				console.error("❌ Error loading listings:", supabaseError);
				setError("Nu s-au putut încărca anunțurile: " + supabaseError.message); // Provide more specific error message
				setAllListings([]); // Clear listings on error
				return;
			}

			console.log("✅ Loaded listings:", data?.length || 0);

			const formattedListings = (data || []).map((listing: any) => ({
				id: listing.id,
				title: listing.title,
				price: listing.price,
				year: listing.year,
				mileage: listing.mileage,
				location: listing.location,
				images: listing.images || [],
				category: listing.category,
				brand: listing.brand,
				model: listing.model,
				seller: listing.seller_name,
				sellerId: listing.seller_id,
				sellerType: listing.seller_type,
				featured: listing.featured || false,
			}));

			setAllListings(formattedListings);
		} catch (err: any) {
			// Catch any unexpected errors during the process
			console.error("💥 Error in loadListings (catch block):", err);
			setError(
				"A apărut o eroare neașteptată la încărcarea anunțurilor: " +
					err.message,
			);
			setAllListings([]); // Clear listings on error
		} finally {
			setIsLoading(false); // Always set loading to false when done (success or error)
		}
	};

	// ... rest of your code ...

	// Update showFilters state when window is resized
	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth >= 1024) {
				setShowFilters(true);
			}
			// Don't auto-hide on mobile when resizing
		};

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	// Filtrare și căutare
	const filteredListings = useMemo(() => {
		return allListings.filter((listing) => {
			// Căutare în text
			const searchLower = searchQuery.toLowerCase();
			const matchesSearch =
				!searchQuery ||
				listing.title.toLowerCase().includes(searchLower) ||
				listing.brand.toLowerCase().includes(searchLower) ||
				listing.model.toLowerCase().includes(searchLower) ||
				listing.category.toLowerCase().includes(searchLower) ||
				listing.location.toLowerCase().includes(searchLower) ||
				listing.seller.toLowerCase().includes(searchLower);

			// Filtre
			const matchesPrice =
				(!filters.priceMin || listing.price >= parseInt(filters.priceMin)) &&
				(!filters.priceMax || listing.price <= parseInt(filters.priceMax));

			const matchesCategory =
				!filters.category ||
				listing.category.toLowerCase() === filters.category.toLowerCase();

			const matchesBrand =
				!filters.brand ||
				listing.brand.toLowerCase() === filters.brand.toLowerCase();

			const matchesYear =
				(!filters.yearMin || listing.year >= parseInt(filters.yearMin)) &&
				(!filters.yearMax || listing.year <= parseInt(filters.yearMax));

			const matchesLocation =
				!filters.location ||
				listing.location.toLowerCase().includes(filters.location.toLowerCase());

			return (
				matchesSearch &&
				matchesPrice &&
				matchesCategory &&
				matchesBrand &&
				matchesYear &&
				matchesLocation
			);
		});
	}, [searchQuery, filters, allListings]);

	// Calculate pagination
	const totalPages = Math.ceil(filteredListings.length / itemsPerPage);
	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;
	const currentListings = filteredListings.slice(startIndex, endIndex);

	const handleFilterChange = (key: string, value: string) => {
		setFilters((prev) => ({ ...prev, [key]: value }));
		setCurrentPage(1); // Reset to first page when filtering
	};

	const clearFilters = () => {
		setFilters({
			priceMin: "",
			priceMax: "",
			category: "",
			brand: "",
			yearMin: "",
			yearMax: "",
			location: "",
		});
		setSearchQuery("");
		setCurrentPage(1);
		// Clear URL params
		navigate("/", { replace: true });
	};

	// Funcție pentru a merge la o pagină și a face scroll la top
	const goToPage = (page: number) => {
		setCurrentPage(page);
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	const categories = [
		{
			name: "Sport",
			image: "https://images.pexels.com/photos/595807/pexels-photo-595807.jpeg",
		},
		{
			name: "Touring",
			image:
				"https://images.pexels.com/photos/2519374/pexels-photo-2519374.jpeg",
		},
		{
			name: "Cruiser",
			image:
				"https://images.pexels.com/photos/1413412/pexels-photo-1413412.jpeg",
		},
		{
			name: "Adventure",
			image:
				"https://www.advpulse.com/wp-content/uploads/2016/04/Honda-XRE-300-a-561x373.jpg",
		},
		{
			name: "Naked",
			image:
				"https://images.pexels.com/photos/1715193/pexels-photo-1715193.jpeg",
		},
		{
			name: "Enduro",
			image:
				"https://images.pexels.com/photos/2611690/pexels-photo-2611690.jpeg",
		},
		{
			name: "Scooter",
			image:
				"data:image/jpeg;base64,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",
		},
		{
			name: "Chopper",
			image:
				"https://images.pexels.com/photos/2393821/pexels-photo-2393821.jpeg",
		},
	];

	const ListingRow = ({ listing }: { listing: any }) => {
		const [currentImageIndex, setCurrentImageIndex] = useState(0);
		const touchStartX = useRef<number>(0);
		const touchEndX = useRef<number>(0);
		const imageContainerRef = useRef<HTMLDivElement>(null);
		const [sellerAvatar, setSellerAvatar] = useState<string | null>(null);

		useEffect(() => {
			// Fetch seller profile to get avatar
			const fetchSellerProfile = async () => {
				try {
					const { data, error } = await supabase
						.from("profiles")
						.select("avatar_url")
						.eq("id", listing.sellerId)
						.single();

					if (!error && data) {
						setSellerAvatar(data.avatar_url);
					}
				} catch (err) {
					console.error("Error fetching seller avatar:", err);
				}
			};

			fetchSellerProfile();
		}, [listing.sellerId]);

		// Handle touch events for mobile swipe
		const handleTouchStart = (e: React.TouchEvent) => {
			touchStartX.current = e.targetTouches[0].clientX;
		};

		const handleTouchMove = (e: React.TouchEvent) => {
			touchEndX.current = e.targetTouches[0].clientX;
		};

		const handleTouchEnd = (e: React.TouchEvent) => {
			e.preventDefault();
			e.stopPropagation();

			if (!touchStartX.current || !touchEndX.current) return;

			const distance = touchStartX.current - touchEndX.current;
			const isLeftSwipe = distance > 50;
			const isRightSwipe = distance < -50;

			if (isLeftSwipe && currentImageIndex < listing.images.length - 1) {
				setCurrentImageIndex((prev) => prev + 1);
			}
			if (isRightSwipe && currentImageIndex > 0) {
				setCurrentImageIndex((prev) => prev - 1);
			}
		};

		const nextImage = (e: React.MouseEvent) => {
			e.preventDefault();
			e.stopPropagation();
			setCurrentImageIndex((prev) =>
				prev === listing.images.length - 1 ? 0 : prev + 1,
			);
		};

		const prevImage = (e: React.MouseEvent) => {
			e.preventDefault();
			e.stopPropagation();
			setCurrentImageIndex((prev) =>
				prev === 0 ? listing.images.length - 1 : prev - 1,
			);
		};

		const handleSellerClick = (e: React.MouseEvent) => {
			e.preventDefault();
			e.stopPropagation();
			// Navigate to seller profile
			navigate(`/profil/${listing.sellerId}`);
		};

		// Funcție pentru a obține imaginea corectă
		const getListingImage = () => {
			if (
				listing.images &&
				listing.images.length > 0 &&
				listing.images[currentImageIndex]
			) {
				return listing.images[currentImageIndex];
			}
			// Fallback la imagine placeholder
			return "https://images.pexels.com/photos/2116475/pexels-photo-2116475.jpeg";
		};

		return (
			<Link
				to={`/anunt/${listing.id}`}
				className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 group border border-gray-100 block"
			>
				<div className="flex flex-col sm:flex-row">
					<div
						ref={imageContainerRef}
						className="relative w-full sm:w-64 flex-shrink-0"
						onTouchStart={handleTouchStart}
						onTouchMove={handleTouchMove}
						onTouchEnd={handleTouchEnd}
					>
						<img
							loading="lazy"
							src={getListingImage()}
							alt={listing.title}
							className="w-full h-48 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
							onError={(e) => {
								// Fallback la imagine placeholder dacă imaginea nu se încarcă
								const target = e.currentTarget as HTMLImageElement;
								target.src =
									"https://images.pexels.com/photos/2116475/pexels-photo-2116475.jpeg";
							}}
						/>

						{/* Navigation Arrows - Only show if multiple images */}
						{listing.images && listing.images.length > 1 && (
							<>
								<button
									onClick={prevImage}
									className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-1.5 hover:bg-white transition-colors opacity-0 group-hover:opacity-100 hidden sm:block"
								>
									<ChevronLeft className="h-4 w-4 text-gray-600" />
								</button>

								<button
									onClick={nextImage}
									className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-1.5 hover:bg-white transition-colors opacity-0 group-hover:opacity-100 hidden sm:block"
								>
									<ChevronRight className="h-4 w-4 text-gray-600" />
								</button>

								{/* Image indicators */}
								<div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
									{listing.images.map((_: any, index: number) => (
										<div
											key={index}
											className={`w-1.5 h-1.5 rounded-full transition-colors ${
												index === currentImageIndex ? "bg-white" : "bg-white/50"
											}`}
										/>
									))}
								</div>
							</>
						)}

						<div className="absolute top-3 left-3">
							<span className="bg-nexar-accent text-white px-3 py-1 rounded-full text-xs font-semibold">
								{listing.category}
							</span>
						</div>
					</div>

					<div className="flex-1 p-4 sm:p-6">
						<div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3">
							<div>
								<h3 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-nexar-accent transition-colors mb-2">
									{listing.title}
								</h3>
								<div className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
									€{listing.price.toLocaleString()}
								</div>

								{/* EVIDENȚIERE DEALER MULT MAI PRONUNȚATĂ */}
								<div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
									<div className="flex items-center space-x-2 text-sm text-gray-600">
										<div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden border border-gray-200">
											{sellerAvatar ? (
												<img
													loading="lazy"
													src={sellerAvatar}
													alt={listing.seller}
													className="w-full h-full object-cover"
													onError={(e) => {
														const target = e.currentTarget as HTMLImageElement;
														target.style.display = "none";
														const parent = target.parentElement;
														if (parent) {
															parent.innerHTML = `<div class="w-full h-full bg-nexar-accent flex items-center justify-center text-white text-xs font-bold">${listing.seller
																.charAt(0)
																.toUpperCase()}</div>`;
														}
													}}
												/>
											) : (
												<div className="w-full h-full bg-nexar-accent flex items-center justify-center text-white text-xs font-bold">
													{listing.seller.charAt(0).toUpperCase()}
												</div>
											)}
										</div>
										<button
											onClick={handleSellerClick}
											className="font-semibold text-nexar-accent hover:text-nexar-gold transition-colors underline"
										>
											{listing.seller}
										</button>
									</div>

									{/* BADGE DEALER MULT MAI VIZIBIL */}
									{listing.sellerType === "dealer" ? (
										<div className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-3 py-1.5 rounded-full shadow-md border border-emerald-400">
											<Building className="h-3 w-3" />
											<span className="font-bold text-xs tracking-wide">
												DEALER PREMIUM
											</span>
											<div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
										</div>
									) : (
										<div className="inline-flex items-center space-x-2 bg-gradient-to-r from-slate-500 to-slate-600 text-white px-3 py-1.5 rounded-full shadow-md">
											<User className="h-3 w-3" />
											<span className="font-semibold text-xs">PRIVAT</span>
										</div>
									)}
								</div>
							</div>
						</div>

						<div className="grid grid-cols-3 gap-3 sm:gap-6 mb-4">
							<div className="flex items-center space-x-2 text-gray-600">
								<Calendar className="h-4 w-4" />
								<span className="text-sm font-medium">{listing.year}</span>
							</div>
							<div className="flex items-center space-x-2 text-gray-600">
								<Gauge className="h-4 w-4" />
								<span className="text-sm font-medium">
									{listing.mileage.toLocaleString()} km
								</span>
							</div>
							<div className="flex items-center space-x-2 text-gray-600">
								<MapPin className="h-4 w-4" />
								<span className="text-sm font-medium">{listing.location}</span>
							</div>
						</div>

						<div className="bg-nexar-accent text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-nexar-gold transition-colors inline-flex items-center space-x-2">
							<span>Vezi Detalii</span>
							<ChevronRight className="h-4 w-4" />
						</div>
					</div>
				</div>
			</Link>
		);
	};

	return (
		<div className="animate-fade-in">
			{/* Hero Section - ULTRA MINIMALIST */}
			<section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden">
				<div className="absolute inset-0 bg-black opacity-40"></div>
				<div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
					<div className="text-center text-white">
						<h1 className="text-2xl sm:text-3xl font-bold mb-6 leading-tight">
							Cumpără și Vinde Motociclete
							<span className="block text-nexar-accent text-xl sm:text-2xl">
								GRATUIT
							</span>
						</h1>

						{/* Hero Search */}
						<div className="max-w-md mx-auto mb-6">
							<div className="relative backdrop-blur-md bg-white/10 rounded-xl p-1 border border-white/20">
								<input
									type="text"
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									placeholder="Caută după marcă, model sau tip..."
									className="w-full pl-4 pr-16 py-2.5 text-sm rounded-lg border-0 bg-white/90 backdrop-blur-sm focus:ring-2 focus:ring-nexar-accent shadow-lg text-gray-900 placeholder-gray-600"
								/>
								<button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-nexar-accent text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-nexar-gold transition-colors text-xs shadow-lg">
									Caută
								</button>
							</div>
						</div>

						<div className="flex flex-col sm:flex-row gap-3 justify-center">
							<Link
								to="/adauga-anunt"
								className="bg-white/90 backdrop-blur-sm text-gray-900 px-5 py-2.5 rounded-lg font-semibold hover:bg-white transition-all duration-200 transform hover:scale-105 shadow-lg border border-white/30 text-sm"
							>
								Vinde Motocicleta Ta
							</Link>
						</div>
					</div>
				</div>
			</section>

			{/* Featured Listings with Filters */}
			<section className="py-8 sm:py-16 bg-gray-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					{/* Mobile-friendly layout */}
					<div className="block lg:hidden mb-6">
						<button
							onClick={() => setShowFilters(!showFilters)}
							className="w-full flex items-center justify-center space-x-2 bg-white text-gray-700 px-4 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors border border-gray-200 mb-4"
						>
							<SlidersHorizontal className="h-4 w-4" />
							<span>{showFilters ? "Ascunde" : "Arată"} Filtrele</span>
						</button>

						{showFilters && (
							<div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
								<div className="flex items-center justify-between mb-6">
									<h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
										<Filter className="h-5 w-5" />
										<span>Filtrează Rezultatele</span>
									</h3>
									<button
										onClick={() => setShowFilters(false)}
										className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
									>
										<X className="h-4 w-4" />
									</button>
								</div>

								<div className="space-y-6">
									{/* Price Range */}
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-3">
											Preț (EUR)
										</label>
										<div className="grid grid-cols-2 gap-2">
											<input
												type="number"
												placeholder="Min"
												value={filters.priceMin}
												onChange={(e) =>
													handleFilterChange("priceMin", e.target.value)
												}
												className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-nexar-accent focus:border-transparent"
											/>
											<input
												type="number"
												placeholder="Max"
												value={filters.priceMax}
												onChange={(e) =>
													handleFilterChange("priceMax", e.target.value)
												}
												className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-nexar-accent focus:border-transparent"
											/>
										</div>
									</div>

									{/* Category */}
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-3">
											Categorie
										</label>
										<select
											value={filters.category}
											onChange={(e) =>
												handleFilterChange("category", e.target.value)
											}
											className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-nexar-accent focus:border-transparent"
										>
											<option value="">Toate categoriile</option>
											<option value="sport">Sport</option>
											<option value="touring">Touring</option>
											<option value="cruiser">Cruiser</option>
											<option value="adventure">Adventure</option>
											<option value="naked">Naked</option>
											<option value="scooter">Scooter</option>
											<option value="enduro">Enduro</option>
											<option value="chopper">Chopper</option>
										</select>
									</div>

									{/* Brand */}
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-3">
											Marcă
										</label>
										<select
											value={filters.brand}
											onChange={(e) =>
												handleFilterChange("brand", e.target.value)
											}
											className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-nexar-accent focus:border-transparent"
										>
											<option value="">Toate mărcile</option>
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
										</select>
									</div>

									{/* Year Range */}
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-3">
											An fabricație
										</label>
										<div className="grid grid-cols-2 gap-2">
											<input
												type="number"
												placeholder="De la"
												value={filters.yearMin}
												onChange={(e) =>
													handleFilterChange("yearMin", e.target.value)
												}
												className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-nexar-accent focus:border-transparent"
											/>
											<input
												type="number"
												placeholder="Până la"
												value={filters.yearMax}
												onChange={(e) =>
													handleFilterChange("yearMax", e.target.value)
												}
												className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-nexar-accent focus:border-transparent"
											/>
										</div>
									</div>

									{/* Location */}
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-3">
											Locația
										</label>
										<select
											value={filters.location}
											onChange={(e) =>
												handleFilterChange("location", e.target.value)
											}
											className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-nexar-accent focus:border-transparent"
										>
											<option value="">Toate locațiile</option>
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
											{romanianCities.map(
												(city) =>
													!city.startsWith("București") &&
													city !== "Râmnicu Vâlcea" &&
													city !== "Rm. Vâlcea" && (
														<option key={city} value={city}>
															{city}
														</option>
													),
											)}
										</select>
									</div>

									{/* Clear Filters */}
									<button
										onClick={clearFilters}
										className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
									>
										<X className="h-4 w-4" />
										<span>Șterge Filtrele</span>
									</button>
								</div>
							</div>
						)}
					</div>

					{/* Desktop layout */}
					<div className="hidden lg:flex gap-6">
						{/* Filters Sidebar */}
						<div
							className={`${
								showFilters ? "w-80" : "w-0"
							} transition-all duration-300 overflow-hidden`}
						>
							<div className="bg-white rounded-xl shadow-sm p-6 sticky top-24 border border-gray-100">
								<div className="flex items-center justify-between mb-6">
									<h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
										<Filter className="h-5 w-5" />
										<span>Filtrează Rezultatele</span>
									</h3>
									<button
										onClick={() => setShowFilters(false)}
										className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
									>
										<X className="h-4 w-4" />
									</button>
								</div>

								<div className="space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
									{/* Price Range */}
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-3">
											Preț (EUR)
										</label>
										<div className="grid grid-cols-2 gap-2">
											<input
												type="number"
												placeholder="Min"
												value={filters.priceMin}
												onChange={(e) =>
													handleFilterChange("priceMin", e.target.value)
												}
												className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-nexar-accent focus:border-transparent"
											/>
											<input
												type="number"
												placeholder="Max"
												value={filters.priceMax}
												onChange={(e) =>
													handleFilterChange("priceMax", e.target.value)
												}
												className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-nexar-accent focus:border-transparent"
											/>
										</div>
									</div>

									{/* Category */}
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-3">
											Categorie
										</label>
										<select
											value={filters.category}
											onChange={(e) =>
												handleFilterChange("category", e.target.value)
											}
											className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-nexar-accent focus:border-transparent"
										>
											<option value="">Toate categoriile</option>
											<option value="sport">Sport</option>
											<option value="touring">Touring</option>
											<option value="cruiser">Cruiser</option>
											<option value="adventure">Adventure</option>
											<option value="naked">Naked</option>
											<option value="scooter">Scooter</option>
											<option value="enduro">Enduro</option>
											<option value="chopper">Chopper</option>
										</select>
									</div>

									{/* Brand */}
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-3">
											Marcă
										</label>
										<select
											value={filters.brand}
											onChange={(e) =>
												handleFilterChange("brand", e.target.value)
											}
											className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-nexar-accent focus:border-transparent"
										>
											<option value="">Toate mărcile</option>
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
										</select>
									</div>

									{/* Year Range */}
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-3">
											An fabricație
										</label>
										<div className="grid grid-cols-2 gap-2">
											<input
												type="number"
												placeholder="De la"
												value={filters.yearMin}
												onChange={(e) =>
													handleFilterChange("yearMin", e.target.value)
												}
												className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-nexar-accent focus:border-transparent"
											/>
											<input
												type="number"
												placeholder="Până la"
												value={filters.yearMax}
												onChange={(e) =>
													handleFilterChange("yearMax", e.target.value)
												}
												className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-nexar-accent focus:border-transparent"
											/>
										</div>
									</div>

									{/* Location */}
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-3">
											Locația
										</label>
										<select
											value={filters.location}
											onChange={(e) =>
												handleFilterChange("location", e.target.value)
											}
											className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-nexar-accent focus:border-transparent"
										>
											<option value="">Toate locațiile</option>
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
											{romanianCities.map(
												(city) =>
													!city.startsWith("București") &&
													city !== "Râmnicu Vâlcea" &&
													city !== "Rm. Vâlcea" && (
														<option key={city} value={city}>
															{city}
														</option>
													),
											)}
										</select>
									</div>

									{/* Clear Filters */}
									<button
										onClick={clearFilters}
										className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
									>
										<X className="h-4 w-4" />
										<span>Șterge Filtrele</span>
									</button>
								</div>
							</div>
						</div>

						{/* Main Content */}
						<div className="flex-1">
							{/* Toggle Filters Button */}
							<div className="mb-6 flex justify-between items-center">
								<button
									onClick={() => setShowFilters(!showFilters)}
									className="flex items-center space-x-2 bg-white text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-50 transition-colors border border-gray-200"
								>
									<SlidersHorizontal className="h-4 w-4" />
									<span>{showFilters ? "Ascunde" : "Arată"} Filtrele</span>
								</button>

								<p className="text-gray-600">
									{filteredListings.length} rezultate găsite
									{searchQuery && (
										<span className="ml-2 text-nexar-accent">
											pentru "{searchQuery}"
										</span>
									)}
								</p>
							</div>

							{/* Loading State */}
							{isLoading && (
								<div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
									<div className="w-16 h-16 border-4 border-nexar-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
									<h3 className="text-xl font-semibold text-gray-900 mb-2">
										Se încarcă anunțurile...
									</h3>
									<p className="text-gray-600">Te rugăm să aștepți</p>
								</div>
							)}

							{/* Error State */}
							{error && !isLoading && (
								<div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
									<div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
										<X className="h-8 w-8 text-red-500" />
									</div>
									<h3 className="text-xl font-semibold text-gray-900 mb-2">
										Eroare la încărcare
									</h3>
									<p className="text-gray-600 mb-6">{error}</p>
									<div className="flex flex-col sm:flex-row gap-4 justify-center">
										<button
											onClick={loadListings}
											className="bg-nexar-accent text-white px-6 py-3 rounded-lg font-semibold hover:bg-nexar-gold transition-colors flex items-center justify-center space-x-2"
										>
											<RefreshCw className="h-5 w-5" />
											<span>Încearcă din nou</span>
										</button>
									</div>
								</div>
							)}

							{/* No Results */}
							{!isLoading && !error && filteredListings.length === 0 && (
								<div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
									<Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
									<h3 className="text-xl font-semibold text-gray-900 mb-2">
										Nu am găsit rezultate
									</h3>
									<p className="text-gray-600 mb-6">
										{allListings.length === 0
											? "Nu există anunțuri publicate încă. Fii primul care adaugă un anunț!"
											: "Încearcă să modifici criteriile de căutare sau filtrele pentru a găsi mai multe rezultate."}
									</p>
									{allListings.length === 0 ? (
										<Link
											to="/adauga-anunt"
											className="bg-nexar-accent text-white px-6 py-3 rounded-lg font-semibold hover:bg-nexar-gold transition-colors"
										>
											Adaugă primul anunț
										</Link>
									) : (
										<button
											onClick={clearFilters}
											className="bg-nexar-accent text-white px-6 py-3 rounded-lg font-semibold hover:bg-nexar-gold transition-colors"
										>
											Șterge Toate Filtrele
										</button>
									)}
								</div>
							)}

							{/* Listings */}
							{!isLoading && !error && filteredListings.length > 0 && (
								<div className="space-y-4">
									{currentListings.map((listing) => (
										<ListingRow key={listing.id} listing={listing} />
									))}
								</div>
							)}
						</div>
					</div>

					{/* Mobile Listings - Show directly after filters button */}
					<div className="block lg:hidden">
						{/* Loading State */}
						{isLoading && (
							<div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100">
								<div className="w-12 h-12 border-4 border-nexar-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
								<p className="text-gray-600">Se încarcă anunțurile...</p>
							</div>
						)}

						{/* Error State */}
						{error && !isLoading && (
							<div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100">
								<div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
									<X className="h-6 w-6 text-red-500" />
								</div>
								<h3 className="text-lg font-semibold text-gray-900 mb-2">
									Eroare la încărcare
								</h3>
								<p className="text-gray-600 mb-6 text-sm">{error}</p>
								<div className="flex flex-col gap-3">
									<button
										onClick={loadListings}
										className="bg-nexar-accent text-white px-6 py-3 rounded-lg font-semibold hover:bg-nexar-gold transition-colors flex items-center justify-center space-x-2"
									>
										<RefreshCw className="h-5 w-5" />
										<span>Încearcă din nou</span>
									</button>
								</div>
							</div>
						)}

						{/* No Results */}
						{!isLoading && !error && filteredListings.length === 0 && (
							<div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100">
								<Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
								<h3 className="text-lg font-semibold text-gray-900 mb-2">
									Nu am găsit rezultate
								</h3>
								<p className="text-gray-600 mb-6 text-sm">
									{allListings.length === 0
										? "Nu există anunțuri publicate încă. Fii primul care adaugă un anunț!"
										: "Încearcă să modifici criteriile de căutare sau filtrele pentru a găsi mai multe rezultate."}
								</p>
								{allListings.length === 0 ? (
									<Link
										to="/adauga-anunt"
										className="bg-nexar-accent text-white px-6 py-3 rounded-lg font-semibold hover:bg-nexar-gold transition-colors"
									>
										Adaugă primul anunț
									</Link>
								) : (
									<button
										onClick={clearFilters}
										className="bg-nexar-accent text-white px-6 py-3 rounded-lg font-semibold hover:bg-nexar-gold transition-colors"
									>
										Șterge Toate Filtrele
									</button>
								)}
							</div>
						)}

						{/* Mobile Listings */}
						{!isLoading && !error && filteredListings.length > 0 && (
							<div className="space-y-4">
								{currentListings.map((listing) => (
									<ListingRow key={listing.id} listing={listing} />
								))}
							</div>
						)}
					</div>

					{/* Pagination - Show on all devices */}
					{!isLoading &&
						!error &&
						filteredListings.length > 0 &&
						totalPages > 1 && (
							<div className="mt-8 flex justify-center">
								<div className="flex items-center space-x-2">
									<button
										onClick={() => goToPage(Math.max(1, currentPage - 1))}
										disabled={currentPage === 1}
										className="flex items-center space-x-1 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
									>
										<ChevronLeft className="h-4 w-4" />
										<span className="hidden sm:inline">Anterior</span>
									</button>

									{/* Page numbers */}
									{[...Array(totalPages)].map((_, index) => {
										const page = index + 1;
										// Show only a few pages around current page on mobile
										const showPage =
											totalPages <= 5 ||
											page === 1 ||
											page === totalPages ||
											(page >= currentPage - 1 && page <= currentPage + 1);

										if (!showPage) {
											// Show ellipsis
											if (
												page === currentPage - 2 ||
												page === currentPage + 2
											) {
												return (
													<span key={page} className="px-2 py-2 text-gray-400">
														...
													</span>
												);
											}
											return null;
										}

										return (
											<button
												key={page}
												onClick={() => goToPage(page)}
												className={`px-3 py-2 rounded-lg transition-colors ${
													currentPage === page
														? "bg-nexar-accent text-white"
														: "border border-gray-200 hover:bg-gray-50"
												}`}
											>
												{page}
											</button>
										);
									})}

									<button
										onClick={() =>
											goToPage(Math.min(totalPages, currentPage + 1))
										}
										disabled={currentPage === totalPages}
										className="flex items-center space-x-1 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
									>
										<span className="hidden sm:inline">Următorul</span>
										<ChevronRight className="h-4 w-4" />
									</button>
								</div>
							</div>
						)}
				</div>
			</section>

			{/* Categories */}
			<section className="py-16 bg-white">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-10">
						<h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
							Categorii Populare
						</h2>
						<p className="text-lg text-gray-600">
							Găsește exact tipul de motocicletă pe care îl cauți
						</p>
					</div>

					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
						{categories.map((category, index) => (
							<Link
								key={index}
								to={`/?categorie=${category.name.toLowerCase()}`}
								className="group relative overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105 border border-gray-200"
								onClick={() => {
									setFilters((prev) => ({
										...prev,
										category: category.name.toLowerCase(),
									}));
									window.scrollTo(0, 0);
								}}
							>
								<img
									loading="lazy"
									src={category.image}
									alt={category.name}
									className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-300"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
								<div className="absolute bottom-0 left-0 right-0 p-3 text-white">
									<h3 className="font-bold mb-1">{category.name}</h3>
								</div>
							</Link>
						))}
					</div>
				</div>
			</section>

			{/* Why Choose Us */}
			<section className="py-16 bg-gray-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-10">
						<h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
							De Ce Să Alegi Nexar?
						</h2>
						<p className="text-lg text-gray-600 max-w-xl mx-auto">
							Oferim cea mai sigură și eficientă platformă pentru cumpărarea și
							vânzarea motocicletelor
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						<div className="bg-white p-6 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow border border-gray-200">
							<div className="inline-flex items-center justify-center w-12 h-12 bg-nexar-accent/10 rounded-lg mb-4">
								<Check className="h-6 w-6 text-nexar-accent" />
							</div>
							<h3 className="text-lg font-bold text-gray-900 mb-3">
								Siguranță Garantată
							</h3>
							<p className="text-gray-600 leading-relaxed text-sm">
								Toate anunțurile sunt verificate manual. Sistem de rating și
								recenzii pentru fiecare vânzător.
							</p>
						</div>

						<div className="bg-white p-6 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow border border-gray-200">
							<div className="inline-flex items-center justify-center w-12 h-12 bg-nexar-accent/10 rounded-lg mb-4">
								<Check className="h-6 w-6 text-nexar-accent" />
							</div>
							<h3 className="text-lg font-bold text-gray-900 mb-3">
								Proces Simplificat
							</h3>
							<p className="text-gray-600 leading-relaxed text-sm">
								Interfață intuitivă și proces de listare simplu. Publică anunțul
								tău în doar câteva minute.
							</p>
						</div>

						<div className="bg-white p-6 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow border border-gray-200">
							<div className="inline-flex items-center justify-center w-12 h-12 bg-nexar-accent/10 rounded-lg mb-4">
								<Users className="h-6 w-6 text-nexar-accent" />
							</div>
							<h3 className="text-lg font-bold text-gray-900 mb-3">
								Comunitate Activă
							</h3>
							<p className="text-gray-600 leading-relaxed text-sm">
								Peste 15,000 de pasionați de motociclete. Găsește sfaturi și
								recomandări de la experți.
							</p>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
};

export default HomePage;
