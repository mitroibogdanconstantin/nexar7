import React, { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
	Share2,
	MapPin,
	Calendar,
	Gauge,
	Fuel,
	Settings,
	Phone,
	Mail,
	ChevronLeft,
	ChevronRight,
	Check,
	Car,
	Zap,
	Cog,
	Palette,
	Award,
	User,
	ExternalLink,
	Building,
	AlertTriangle,
	RefreshCw,
	Store,
	Clock,
} from "lucide-react";
import { listings, supabase } from "../lib/supabase";
import NetworkErrorHandler from "../components/NetworkErrorHandler";

const ListingDetailPage = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const touchStartX = useRef<number | null>(null);
	const touchEndX = useRef<number | null>(null);
	const [listing, setListing] = useState<any>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [networkError, setNetworkError] = useState<any>(null);

	// Scroll to top when component mounts
	useEffect(() => {
		window.scrollTo(0, 0);

		if (id) {
			loadListing(id);
		}
	}, [id]);

	const loadListing = async (listingId: string) => {
		try {
			setIsLoading(true);
			setError(null);
			setNetworkError(null);

			console.log("🔄 Loading listing details for ID:", listingId);

			const { data, error } = await listings.getById(listingId);

			if (error) {
				console.error("❌ Error loading listing:", error);
				if (error.message?.includes('fetch') || error.message?.includes('network')) {
					setNetworkError(error);
				} else {
					setError("Nu s-a putut încărca anunțul");
				}
				return;
			}

			if (!data) {
				console.error("❌ Listing not found");
				setError("Anunțul nu a fost găsit");
				return;
			}

			console.log("✅ Listing loaded successfully:", data);

			// Obținem detalii despre vânzător
			const { data: sellerData, error: sellerError } = await supabase
				.from("profiles")
				.select("*")
				.eq("id", data.seller_id)
				.single();

			if (sellerError) {
				console.error("❌ Error loading seller profile:", sellerError);
			}

			// Formatăm datele pentru afișare
			const formattedListing = {
				id: data.id,
				title: data.title,
				price: `€${data.price.toLocaleString()}`,
				year: data.year,
				mileage: `${data.mileage.toLocaleString()} km`,
				location: data.location,
				images:
					data.images && data.images.length > 0
						? data.images
						: [
								"https://images.pexels.com/photos/2116475/pexels-photo-2116475.jpeg",
						  ],
				seller: {
					id: data.seller_id,
					name: data.seller_name,
					verified: sellerData?.verified || false,
					phone: sellerData?.phone || "0790 454 647",
					email: sellerData?.email || "contact@nexar.ro",
					avatar:
						sellerData?.avatar_url ||
						"https://images.pexels.com/photos/2116475/pexels-photo-2116475.jpeg",
					type: data.seller_type,
				},
				category: data.category,
				brand: data.brand,
				model: data.model,
				engine: `${data.engine_capacity}cc`,
				fuel: data.fuel_type,
				transmission: data.transmission,
				color: data.color,
				condition: data.condition,
				features: data.features || [
					"ABS",
					"Control tracțiune",
					"Suspensie reglabilă",
					"Frâne Brembo",
				],
				description: data.description || "Descriere indisponibilă",
				posted: formatDate(data.created_at),
				views: data.views_count || 0,
				featured: data.featured || false,
				availability: data.availability || "pe_stoc",
			};

			setListing(formattedListing);
		} catch (err: any) {
			console.error("💥 Error in loadListing:", err);
			if (err.message?.includes('fetch') || err.message?.includes('network')) {
				setNetworkError(err);
			} else {
				setError("A apărut o eroare la încărcarea anunțului");
			}
		} finally {
			setIsLoading(false);
		}
	};

	// Format date for display
	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		const now = new Date();
		const diffTime = Math.abs(now.getTime() - date.getTime());
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

		if (diffDays === 0) return "Astăzi";
		if (diffDays === 1) return "Ieri";
		if (diffDays < 7) return `Acum ${diffDays} zile`;
		if (diffDays < 30) return `Acum ${Math.floor(diffDays / 7)} săptămâni`;
		if (diffDays < 365) return `Acum ${Math.floor(diffDays / 30)} luni`;
		return `Acum ${Math.floor(diffDays / 365)} ani`;
	};

	// Handle touch events for mobile swipe
	const handleTouchStart = (e: React.TouchEvent) => {
		touchStartX.current = e.targetTouches[0].clientX;
	};

	const handleTouchMove = (e: React.TouchEvent) => {
		touchEndX.current = e.targetTouches[0].clientX;
	};

	const handleTouchEnd = () => {
		if (!touchStartX.current || !touchEndX.current || !listing) return;

		const distance = touchStartX.current - touchEndX.current;
		const isLeftSwipe = distance > 50;
		const isRightSwipe = distance < -50;

		if (isLeftSwipe && currentImageIndex < listing.images.length - 1) {
			setCurrentImageIndex((prev) => prev + 1);
		}
		if (isRightSwipe && currentImageIndex > 0) {
			setCurrentImageIndex((prev) => prev - 1);
		}

		// Reset touch coordinates
		touchStartX.current = null;
		touchEndX.current = null;
	};

	const nextImage = () => {
		if (!listing) return;
		setCurrentImageIndex((prev) =>
			prev === listing.images.length - 1 ? 0 : prev + 1,
		);
	};

	const prevImage = () => {
		if (!listing) return;
		setCurrentImageIndex((prev) =>
			prev === 0 ? listing.images.length - 1 : prev - 1,
		);
	};

	const openGoogleMaps = () => {
		if (!listing) return;

		// Folosim locația (orașul)
		const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
			listing.location + ", Romania",
		)}`;
		window.open(url, "_blank");
	};

	const handleSellerClick = () => {
		if (!listing) return;
		navigate(`/profil/${listing.seller.id}`);
	};

	// Loading state
	if (isLoading) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="bg-white p-8 rounded-2xl shadow-lg text-center">
					<div className="w-16 h-16 border-4 border-nexar-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
					<p className="text-gray-600">Se încarcă anunțul...</p>
				</div>
			</div>
		);
	}

	// Network error state
	if (networkError) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
				<NetworkErrorHandler 
					error={networkError} 
					onRetry={() => id && loadListing(id)} 
				/>
			</div>
		);
	}

	// Error state
	if (error || !listing) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md">
					<AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
					<h2 className="text-2xl font-bold text-gray-900 mb-2">
						{error || "Anunț negăsit"}
					</h2>
					<p className="text-gray-600 mb-6">
						{error || "Anunțul căutat nu există sau a fost șters."}
					</p>
					<div className="flex flex-col sm:flex-row gap-4">
						<Link
							to="/"
							className="bg-nexar-accent text-white px-6 py-3 rounded-lg font-semibold hover:bg-nexar-gold transition-colors"
						>
							Vezi toate anunțurile
						</Link>
					</div>
				</div>
			</div>
		);
	}

	const technicalSpecs = [
		{
			icon: Calendar,
			label: "Categorie",
			value: listing.category,
			color: "text-blue-600",
		},
		{
			icon: Cog,
			label: "Transmisie",
			value: listing.transmission,
			color: "text-green-600",
		},
		{
			icon: Palette,
			label: "Culoare",
			value: listing.color,
			color: "text-purple-600",
		},
		{
			icon: Award,
			label: "Stare",
			value: listing.condition,
			color: "text-emerald-600",
		},
		{
			icon: MapPin,
			label: "Locație",
			value: listing.location,
			color: "text-red-600",
		},
	];

	return (
		<div className="min-h-screen bg-gray-50 py-4 sm:py-8">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
					{/* Main Content */}
					<div className="lg:col-span-2 space-y-6 sm:space-y-8">
						{/* Image Gallery - Mobile Optimized */}
						<div className="bg-white rounded-2xl shadow-lg overflow-hidden">
							<div
								className="relative"
								onTouchStart={handleTouchStart}
								onTouchMove={handleTouchMove}
								onTouchEnd={handleTouchEnd}
							>
								<img
									src={
										listing.imagesThumbs?.[currentImageIndex] ||
										listing.images[currentImageIndex]
									}
									alt={listing.title}
									className="w-full h-64 sm:h-96 object-cover"
									onError={(e) => {
										const target = e.currentTarget;
										target.src =
											"https://images.pexels.com/photos/2116475/pexels-photo-2116475.jpeg";
									}}
								/>

								{listing.featured && (
									<div className="absolute top-3 sm:top-4 left-3 sm:left-4">
										<span className="bg-nexar-accent text-white px-3 sm:px-4 py-1 sm:py-2 rounded-full font-semibold text-sm">
											Premium
										</span>
									</div>
								)}

								<div className="absolute top-3 sm:top-4 right-3 sm:right-4 flex space-x-2">
									<button className="bg-white/90 backdrop-blur-sm rounded-full p-2 sm:p-3 hover:bg-white transition-colors">
										<Share2 className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
									</button>
								</div>

								<button
									onClick={prevImage}
									className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors"
								>
									<ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" />
								</button>

								<button
									onClick={nextImage}
									className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors"
								>
									<ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" />
								</button>

								<div className="absolute bottom-3 sm:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
									{listing.images.map((_: any, index: number) => (
										<button
											key={index}
											onClick={() => setCurrentImageIndex(index)}
											className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-colors ${
												index === currentImageIndex ? "bg-white" : "bg-white/50"
											}`}
										/>
									))}
								</div>
							</div>

							{/* Thumbnail Gallery - Hidden on mobile */}
							<div className="p-4 hidden sm:block">
								<div className="flex space-x-2 overflow-x-auto">
									{listing.images.map((image: string, index: number) => (
										<button
											key={index}
											onClick={() => setCurrentImageIndex(index)}
											className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-colors ${
												index === currentImageIndex
													? "border-nexar-accent"
													: "border-gray-200"
											}`}
										>
											<img
												src={image}
												alt={`${listing.brand} ${listing.model} ${index + 1}`}
												className="w-full h-full object-cover"
												onError={(e) => {
													// Fallback la imagine placeholder dacă imaginea nu se încarcă
													const target = e.currentTarget as HTMLImageElement;
													target.src =
														"https://images.pexels.com/photos/2116475/pexels-photo-2116475.jpeg";
												}}
											/>
										</button>
									))}
								</div>
							</div>
						</div>

						{/* Details - Mobile Optimized */}
						<div className="bg-white rounded-2xl shadow-lg p-4 sm:p-8">
							<div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 sm:mb-6">
								<div className="mb-4 sm:mb-0">
									<h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
										{listing.title}
									</h1>
									<h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
										{listing.brand} {listing.model}
									</h2>
									<div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-gray-600 text-sm">
										<span className="flex items-center space-x-1">
											<Calendar className="h-4 w-4" />
											<span>Publicat {listing.posted}</span>
										</span>
										<span>{listing.views} vizualizări</span>
									</div>
								</div>
								<div className="text-left sm:text-right">
									<div className="text-3xl sm:text-4xl font-bold text-nexar-accent mb-2">
										{listing.price}
									</div>
								</div>
							</div>

							{/* EVIDENȚIERE DEALER MULT MAI PRONUNȚATĂ */}
							{listing.seller.type === "dealer" && (
								<div className="mb-6 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-4 rounded-xl shadow-lg border border-emerald-400 flex items-center justify-between">
									<div className="flex items-center space-x-3">
										<Building className="h-6 w-6" />
										<div>
											<div className="font-bold text-lg">DEALER VERIFICAT</div>
											<button
												onClick={handleSellerClick}
												className="text-white underline hover:text-emerald-100 transition-colors text-sm"
											>
												Vândut de {listing.seller.name}
											</button>
										</div>
									</div>
									<div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
								</div>
							)}

							{/* Availability Badge - Only for dealers */}
							{listing.seller.type === "dealer" && (
								<div className="mb-4 flex justify-start">
									<div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg ${
										listing.availability === "pe_stoc" 
											? "bg-green-100 text-green-800 border border-green-200" 
											: "bg-blue-100 text-blue-800 border border-blue-200"
									}`}>
										{listing.availability === "pe_stoc" ? (
											<>
												<Store className="h-4 w-4" />
												<span className="font-medium">Pe stoc</span>
											</>
										) : (
											<>
												<Clock className="h-4 w-4" />
												<span className="font-medium">La comandă</span>
											</>
										)}
									</div>
								</div>
							)}

							{/* Specifications - Mobile Optimized */}
							<div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
								<div className="text-center p-3 sm:p-4 bg-gray-50 rounded-xl">
									<Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-nexar-accent mx-auto mb-2" />
									<div className="font-semibold text-gray-900 text-sm sm:text-base">
										{listing.year}
									</div>
									<div className="text-xs sm:text-sm text-gray-600">
										An fabricație
									</div>
								</div>
								<div className="text-center p-3 sm:p-4 bg-gray-50 rounded-xl">
									<Gauge className="h-6 w-6 sm:h-8 sm:w-8 text-nexar-accent mx-auto mb-2" />
									<div className="font-semibold text-gray-900 text-sm sm:text-base">
										{listing.mileage}
									</div>
									<div className="text-xs sm:text-sm text-gray-600">
										Kilometraj
									</div>
								</div>
								<div className="text-center p-3 sm:p-4 bg-gray-50 rounded-xl">
									<Settings className="h-6 w-6 sm:h-8 sm:w-8 text-nexar-accent mx-auto mb-2" />
									<div className="font-semibold text-gray-900 text-sm sm:text-base">
										{listing.engine}
									</div>
									<div className="text-xs sm:text-sm text-gray-600">
										Capacitate motor
									</div>
								</div>
								<div className="text-center p-3 sm:p-4 bg-gray-50 rounded-xl">
									<Fuel className="h-6 w-6 sm:h-8 sm:w-8 text-nexar-accent mx-auto mb-2" />
									<div className="font-semibold text-gray-900 text-sm sm:text-base">
										{listing.fuel}
									</div>
									<div className="text-xs sm:text-sm text-gray-600">
										Combustibil
									</div>
								</div>
							</div>

							{/* Modern Technical Details & Features - Mobile Optimized */}
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
								{/* Technical Details */}
								<div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-4 sm:p-6">
									<h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center space-x-2">
										<Car className="h-5 w-5 sm:h-6 sm:w-6 text-nexar-accent" />
										<span>Detalii Tehnice</span>
									</h3>

									<div className="space-y-3 sm:space-y-4">
										{technicalSpecs.map((spec, index) => (
											<div
												key={index}
												className="flex items-center justify-between p-2 sm:p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
											>
												<div className="flex items-center space-x-2 sm:space-x-3">
													<div
														className={`p-1.5 sm:p-2 rounded-lg bg-gray-50 ${spec.color}`}
													>
														<spec.icon className="h-4 w-4 sm:h-5 sm:w-5" />
													</div>
													<span className="font-medium text-gray-700 text-sm sm:text-base">
														{spec.label}
													</span>
												</div>
												<span className="font-bold text-gray-900 text-sm sm:text-base">
													{spec.value}
												</span>
											</div>
										))}
									</div>
								</div>

								{/* Features */}
								<div className="bg-gradient-to-br from-nexar-accent/5 to-nexar-gold/5 rounded-2xl p-4 sm:p-6">
									<h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center space-x-2">
										<Settings className="h-5 w-5 sm:h-6 sm:w-6 text-nexar-accent" />
										<span>Dotări</span>
									</h3>

									<div className="grid grid-cols-1 gap-2 sm:gap-3">
										{listing.features.map((feature: string, index: number) => (
											<div
												key={index}
												className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"
											>
												<div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-nexar-accent/10 rounded-full flex items-center justify-center">
													<Check className="h-3 w-3 sm:h-4 sm:w-4 text-nexar-accent" />
												</div>
												<span className="font-medium text-gray-800 text-sm sm:text-base">
													{feature}
												</span>
											</div>
										))}
									</div>
								</div>
							</div>

							{/* Description - Mobile Optimized */}
							<div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 sm:p-6">
								<h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center space-x-2">
									<Settings className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
									<span>Descriere Detaliată</span>
								</h3>
								<div className="prose max-w-none text-gray-700 leading-relaxed text-sm sm:text-base">
									<div className="whitespace-pre-wrap break-words">
										{listing.description}
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Sidebar - Mobile Optimized */}
					<div className="space-y-4 sm:space-y-6">
						{/* Seller Info */}
						<div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
							<div className="flex items-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
								<img
									loading="lazy"
									src={listing.seller.avatar}
									alt={listing.seller.name}
									className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover"
									onError={(e) => {
										// Fallback la imagine placeholder dacă imaginea nu se încarcă
										const target = e.currentTarget as HTMLImageElement;
										target.src =
											"https://images.pexels.com/photos/2116475/pexels-photo-2116475.jpeg";
									}}
								/>
								<div>
									<div className="flex items-center space-x-2">
										<button
											onClick={handleSellerClick}
											className="text-base sm:text-lg font-semibold text-nexar-accent hover:text-nexar-gold transition-colors"
										>
											{listing.seller.name}
										</button>
									</div>
								</div>
							</div>

							{/* EVIDENȚIERE DEALER MULT MAI PRONUNȚATĂ - PENTRU MOBILE */}
							{listing.seller.type === "dealer" && (
								<div className="mb-4 p-3 bg-emerald-100 text-emerald-800 rounded-lg flex items-center justify-between lg:hidden">
									<div className="flex items-center space-x-2">
										<Building className="h-5 w-5" />
										<span className="font-bold">DEALER VERIFICAT</span>
									</div>
									<div className="w-2 h-2 bg-emerald-600 rounded-full animate-pulse"></div>
								</div>
							)}

							<div className="space-y-2 sm:space-y-3">
								<a
									href={`tel:${listing.seller.phone}`}
									className="w-full bg-nexar-accent text-white py-2.5 sm:py-3 rounded-xl font-semibold hover:bg-nexar-gold transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base"
								>
									<Phone className="h-4 w-4 sm:h-5 sm:w-5" />
									<span>Sună Acum</span>
								</a>

								<button
									onClick={openGoogleMaps}
									className="w-full border-2 border-gray-900 text-gray-900 py-2.5 sm:py-3 rounded-xl font-semibold hover:bg-gray-900 hover:text-white transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base"
								>
									<ExternalLink className="h-4 w-4 sm:h-5 sm:w-5" />
									<span>Vezi pe Hartă</span>
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ListingDetailPage;