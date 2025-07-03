import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

import {
	User,
	Mail,
	Phone,
	MapPin,
	Edit,
	Camera,
	Package,
	Eye,
	MessageCircle,
	ChevronRight,
	Calendar,
	Building,
	Lock,
	AlertTriangle,
	CheckCircle,
	X,
	ChevronDown,
	RefreshCw,
	Clock,
	CheckCircle2,
} from "lucide-react";
import {
	supabase,
	auth,
	profiles,
	romanianCities,
	listings,
} from "../lib/supabase";
import FixSupabaseButton from "../components/FixSupabaseButton";

const ProfilePage = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [profile, setProfile] = useState<any>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isCurrentUser, setIsCurrentUser] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [editedProfile, setEditedProfile] = useState<any>({});
	const [activeTab, setActiveTab] = useState("listings");
	const [userListings, setUserListings] = useState<any[]>([]);
	const [pendingListings, setPendingListings] = useState<any[]>([]);
	const [isLoadingListings, setIsLoadingListings] = useState(false);
	const [avatarFile, setAvatarFile] = useState<File | null>(null);
	const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
	const [isChangingPassword, setIsChangingPassword] = useState(false);
	const [passwordData, setPasswordData] = useState({
		currentPassword: "",
		newPassword: "",
		confirmPassword: "",
	});
	const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>(
		{},
	);
	const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);
	const [showLocationDropdown, setShowLocationDropdown] = useState(false);
	const [filteredCities, setFilteredCities] = useState<string[]>([]);

	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		loadProfile();
	}, [id]);
	const loadProfile = async () => {
		try {
			setIsLoading(true); // 🔁 Începe încărcarea
			setError(null);

			const {
				data: { user: currentUser },
			} = await supabase.auth.getUser();

			const userIdToFetch = id || currentUser?.id;

			if (!userIdToFetch) {
				navigate("/auth");
				return;
			}

			setIsCurrentUser(Boolean(!id || (currentUser && id === currentUser.id)));

			const { data: profileData, error: profileError } = await supabase
				.from("profiles")
				.select("*")
				.eq(id ? "id" : "user_id", userIdToFetch)
				.single();

			if (profileError) {
				console.error("❌ Eroare la încărcarea profilului:", profileError);
				setError("Profilul nu a fost găsit.");
				return;
			}

			console.log("📥 Profil încărcat:", profileData);
			setProfile(profileData);
			setEditedProfile(profileData);

			await loadUserListings(profileData.id);
		} catch (err) {
			console.error("💥 Eroare la încărcarea profilului:", err);
			setError("A apărut o eroare la încărcarea profilului.");
		} finally {
			setIsLoading(false); // ✅ Asta lipsea! Setează false când s-a terminat.
			console.log("✅ Profilul a fost procesat complet.");
		}
	};

	const loadUserListings = async (profileId: string) => {
		try {
			setIsLoadingListings(true);

			const { data, error } = await supabase
				.from("listings")
				.select("*")
				.eq("seller_id", profileId)
				.order("created_at", { ascending: false });

			if (error) {
				console.error("Error loading user listings:", error);
				return;
			}

			// Separăm anunțurile active de cele în așteptare
			const active =
				data?.filter((listing) => listing.status === "active") || [];
			const pending =
				data?.filter((listing) => listing.status === "pending") || [];

			setUserListings(active);
			setPendingListings(pending);
		} catch (err) {
			console.error("Error loading user listings:", err);
		} finally {
			setIsLoadingListings(false);
		}
	};

	const handleEditProfile = () => {
		setIsEditing(true);
	};

	const handleCancelEdit = () => {
		setIsEditing(false);
		setEditedProfile(profile);
		setAvatarFile(null);
		setAvatarPreview(null);
	};

	const handleInputChange = (field: string, value: string) => {
		setEditedProfile((prev: any) => ({ ...prev, [field]: value }));
	};

	const handleLocationChange = (value: string) => {
		handleInputChange("location", value);

		if (value.length > 0) {
			const filtered = romanianCities
				.filter((city) => city.toLowerCase().includes(value.toLowerCase()))
				.slice(0, 10); // Limităm la 10 rezultate
			setFilteredCities(filtered);
			setShowLocationDropdown(true);
		} else {
			setFilteredCities([]);
			setShowLocationDropdown(false);
		}
	};

	const selectCity = (city: string) => {
		handleInputChange("location", city);
		setShowLocationDropdown(false);
		setFilteredCities([]);
	};

	const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			// Validare dimensiune și tip
			if (file.size > 2 * 1024 * 1024) {
				alert("Imaginea nu poate depăși 2MB");
				return;
			}

			if (!file.type.startsWith("image/")) {
				alert("Doar fișierele imagine sunt permise");
				return;
			}

			setAvatarFile(file);

			// Generăm URL pentru previzualizare
			const reader = new FileReader();
			reader.onload = (e) => {
				if (e.target?.result) {
					setAvatarPreview(e.target.result as string);
				}
			};
			reader.readAsDataURL(file);
		}
	};

	const handleSaveProfile = async () => {
		try {
			if (!profile || !isCurrentUser) return;

			setIsSubmitting(true);

			// Validare
			if (!editedProfile.name.trim()) {
				alert("Numele este obligatoriu");
				setIsSubmitting(false);
				return;
			}

			if (!editedProfile.email.trim()) {
				alert("Email-ul este obligatoriu");
				setIsSubmitting(false);
				return;
			}

			// Actualizăm profilul
			const { data, error } = await profiles.update(profile.user_id, {
				name: editedProfile.name.trim(),
				phone: editedProfile.phone?.trim() || "",
				location: editedProfile.location?.trim() || "",
				description: editedProfile.description?.trim() || "",
				website: editedProfile.website?.trim() || "",
			});

			if (error) {
				console.error("Error updating profile:", error);
				alert("Eroare la actualizarea profilului");
				setIsSubmitting(false);
				return;
			}

			// Încărcăm avatar-ul dacă există
			if (avatarFile) {
				const { data: avatarData, error: avatarError } =
					await profiles.uploadAvatar(profile.user_id, avatarFile);

				if (avatarError) {
					console.error("Error uploading avatar:", avatarError);
					alert("Eroare la încărcarea avatarului");
				} else if (
					avatarData &&
					avatarData.length > 0 &&
					avatarData[0].avatar_url
				) {
					setProfile((prev: any) => ({
						...prev,
						avatar_url: avatarData[0].avatar_url,
					}));
				} else {
					console.error("avatarData nu conține avatar_url:", avatarData);
					alert(
						"Avatarul a fost încărcat, dar nu s-a putut actualiza profilul.",
					);
				}
			}

			// Actualizăm profilul local
			if (data && data.length > 0) {
				setProfile(data[0]);
			} else {
				// Actualizăm cu datele editate dacă nu avem răspuns de la server
				setProfile({
					...profile,
					name: editedProfile.name.trim(),
					phone: editedProfile.phone?.trim() || "",
					location: editedProfile.location?.trim() || "",
					description: editedProfile.description?.trim() || "",
					website: editedProfile.website?.trim() || "",
				});
			}

			setIsEditing(false);

			// Resetăm starea
			setAvatarFile(null);
			setAvatarPreview(null);

			// Actualizăm și anunțurile cu noul nume
			await loadUserListings(profile.id);
			window.location.reload();
			window.scrollTo(0, 0);

			alert("Profilul a fost actualizat cu succes!");
		} catch (err) {
			console.error("Error saving profile:", err);
			alert("A apărut o eroare la salvarea profilului");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handlePasswordChange = (field: string, value: string) => {
		setPasswordData((prev) => ({ ...prev, [field]: value }));

		// Curățăm eroarea pentru câmpul modificat
		if (passwordErrors[field]) {
			setPasswordErrors((prev) => ({ ...prev, [field]: "" }));
		}
	};

	const validatePassword = (password: string): string => {
		if (!password) return "Parola este obligatorie";
		if (password.length < 8)
			return "Parola trebuie să aibă cel puțin 8 caractere";
		if (!/(?=.*[a-z])/.test(password))
			return "Parola trebuie să conțină cel puțin o literă mică";
		if (!/(?=.*[A-Z])/.test(password))
			return "Parola trebuie să conțină cel puțin o literă mare";
		if (!/(?=.*\d)/.test(password))
			return "Parola trebuie să conțină cel puțin o cifră";
		return "";
	};

	const handleSavePassword = async () => {
		try {
			// Validare
			const errors: Record<string, string> = {};

			const passwordError = validatePassword(passwordData.newPassword);
			if (passwordError) errors.newPassword = passwordError;

			if (passwordData.newPassword !== passwordData.confirmPassword) {
				errors.confirmPassword = "Parolele nu coincid";
			}

			if (Object.keys(errors).length > 0) {
				setPasswordErrors(errors);
				return;
			}

			// Actualizăm parola
			const { error } = await auth.updatePassword(passwordData.newPassword);

			if (error) {
				console.error("Error updating password:", error);
				alert(`Eroare la actualizarea parolei: ${error}`);
				return;
			}

			// Resetăm starea
			setPasswordData({
				currentPassword: "",
				newPassword: "",
				confirmPassword: "",
			});
			setPasswordChangeSuccess(true);

			// Ascundem mesajul de succes după 3 secunde
			setTimeout(() => {
				setPasswordChangeSuccess(false);
				setIsChangingPassword(false);
			}, 3000);
		} catch (err) {
			console.error("Error saving password:", err);
			alert("A apărut o eroare la salvarea parolei");
		}
	};

	const handleEditListing = (listingId: string) => {
		// Verificăm dacă anunțul aparține utilizatorului curent
		const listing =
			userListings.find((l) => l.id === listingId) ||
			pendingListings.find((l) => l.id === listingId);

		if (!listing) {
			alert("Anunțul nu a fost găsit");
			return;
		}

		// Verificăm dacă utilizatorul curent este proprietarul anunțului
		if (listing.seller_id !== profile.id) {
			alert("Nu poți edita un anunț care nu îți aparține");
			return;
		}

		// Navigăm la pagina de editare
		navigate(`/editeaza-anunt/${listingId}`);
	};

	const handleDeleteListing = async (listingId: string) => {
		if (!confirm("Ești sigur că vrei să ștergi acest anunț?")) return;

		try {
			// Verificăm dacă anunțul aparține utilizatorului curent
			const listing =
				userListings.find((l) => l.id === listingId) ||
				pendingListings.find((l) => l.id === listingId);

			if (!listing) {
				alert("Anunțul nu a fost găsit");
				return;
			}

			// Verificăm dacă utilizatorul curent este proprietarul anunțului
			if (listing.seller_id !== profile.id) {
				alert("Nu poți șterge un anunț care nu îți aparține");
				return;
			}

			const { error } = await supabase
				.from("listings")
				.delete()
				.eq("id", listingId);

			if (error) {
				console.error("Error deleting listing:", error);
				alert("Eroare la ștergerea anunțului");
				return;
			}

			// Actualizăm lista de anunțuri
			setUserListings((prev) =>
				prev.filter((listing) => listing.id !== listingId),
			);
			setPendingListings((prev) =>
				prev.filter((listing) => listing.id !== listingId),
			);

			alert("Anunțul a fost șters cu succes!");
		} catch (err) {
			console.error("Error deleting listing:", err);
			alert("A apărut o eroare la ștergerea anunțului");
		}
	};

	const handleViewListing = (listingId: string) => {
		navigate(`/anunt/${listingId}`);
	};

	// Loading state
	if (isLoading) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="bg-white p-8 rounded-2xl shadow-lg text-center">
					<div className="w-16 h-16 border-4 border-nexar-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
					<p className="text-gray-600">Se încarcă profilul...</p>
				</div>
			</div>
		);
	}

	// Error state
	if (error || !profile) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md">
					<AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
					<h2 className="text-2xl font-bold text-gray-900 mb-2">
						{error || "Profil negăsit"}
					</h2>
					<p className="text-gray-600 mb-6">
						{error || "Profilul căutat nu există sau a fost șters."}
					</p>
					<div className="flex flex-col sm:flex-row gap-4">
						<button
							onClick={() => navigate("/")}
							className="bg-nexar-accent text-white px-6 py-3 rounded-lg font-semibold hover:bg-nexar-gold transition-colors"
						>
							Înapoi la pagina principală
						</button>
						<FixSupabaseButton buttonText="Repară Conexiunea" />
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 py-8">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Sidebar - Profile Info */}
					<div className="lg:col-span-1">
						<div className="bg-white rounded-2xl shadow-lg overflow-hidden">
							{/* Profile Header */}
							<div className="relative">
								{/* Cover Image */}
								<div className="h-32 bg-gradient-to-r from-nexar-accent to-nexar-gold"></div>

								{/* Avatar */}
								<div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
									<div className="relative">
										<div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden bg-gray-200">
											<img
												width="96"
												height="96"
												src={
													avatarPreview ||
													profile.avatar_url ||
													`https://ui-avatars.com/api/?name=${encodeURIComponent(
														profile.name,
													)}&background=random`
												}
												alt={profile.name}
												className="w-full h-full object-cover"
												onError={(e) => {
													const target = e.currentTarget as HTMLImageElement;
													target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
														profile.name,
													)}&background=random`;
												}}
											/>
										</div>

										{isEditing && (
											<label className="absolute bottom-0 right-0 bg-nexar-accent text-white p-1 rounded-full cursor-pointer">
												<Camera className="h-4 w-4" />
												<input
													type="file"
													accept="image/*"
													className="hidden"
													onChange={handleAvatarChange}
												/>
											</label>
										)}
									</div>
								</div>
							</div>

							{/* Profile Details */}
							<div className="pt-16 px-6 pb-6">
								<div className="text-center mb-6">
									<h1 className="text-2xl font-bold text-gray-900 mb-1">
										{profile.name}
									</h1>

									<div className="mt-2">
										{profile.seller_type === "dealer" ? (
											<div className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-3 py-1.5 rounded-full shadow-md border border-emerald-400">
												<Building className="h-3 w-3" />
												<span className="font-bold text-xs tracking-wide">
													DEALER PREMIUM
												</span>
											</div>
										) : (
											<div className="inline-flex items-center space-x-2 bg-gradient-to-r from-slate-500 to-slate-600 text-white px-3 py-1.5 rounded-full shadow-md">
												<User className="h-3 w-3" />
												<span className="font-semibold text-xs">
													VÂNZĂTOR PRIVAT
												</span>
											</div>
										)}
									</div>
								</div>

								{isEditing ? (
									<div className="space-y-4">
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">
												Nume
											</label>
											<input
												type="text"
												value={editedProfile.name}
												onChange={(e) =>
													handleInputChange("name", e.target.value)
												}
												className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-nexar-accent focus:border-transparent"
											/>
										</div>

										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">
												Email
											</label>
											<input
												type="email"
												value={editedProfile.email}
												disabled
												className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50 cursor-not-allowed"
											/>
											<p className="text-xs text-gray-500 mt-1">
												Email-ul nu poate fi modificat
											</p>
										</div>

										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">
												Telefon
											</label>
											<input
												type="tel"
												value={editedProfile.phone || ""}
												onChange={(e) =>
													handleInputChange("phone", e.target.value)
												}
												className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-nexar-accent focus:border-transparent"
												placeholder="0790 45 46 47"
											/>
										</div>

										<div className="relative">
											<label className="block text-sm font-medium text-gray-700 mb-2">
												Locația
											</label>
											<div className="relative">
												<input
													type="text"
													value={editedProfile.location || ""}
													onChange={(e) => handleLocationChange(e.target.value)}
													onFocus={() => {
														if (editedProfile.location.length > 0) {
															const filtered = romanianCities
																.filter((city) =>
																	city
																		.toLowerCase()
																		.includes(
																			editedProfile.location.toLowerCase(),
																		),
																)
																.slice(0, 10);
															setFilteredCities(filtered);
															setShowLocationDropdown(true);
														}
													}}
													onBlur={() => {
														// Delay pentru a permite click-ul pe opțiuni
														setTimeout(
															() => setShowLocationDropdown(false),
															200,
														);
													}}
													className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-nexar-accent focus:border-transparent"
													placeholder="Începe să scrii orașul..."
													autoComplete="off"
												/>
												<ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />

												{/* Dropdown cu orașe */}
												{showLocationDropdown && filteredCities.length > 0 && (
													<div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
														{filteredCities.map((city, index) => (
															<button
																key={index}
																type="button"
																onClick={() => selectCity(city)}
																className="w-full text-left px-4 py-2 hover:bg-nexar-accent hover:text-white transition-colors text-sm border-b border-gray-100 last:border-b-0"
															>
																{city}
															</button>
														))}
													</div>
												)}
											</div>
										</div>

										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">
												Descriere
											</label>
											<textarea
												value={editedProfile.description || ""}
												onChange={(e) =>
													handleInputChange("description", e.target.value)
												}
												rows={4}
												className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-nexar-accent focus:border-transparent"
												placeholder="Descriere despre tine..."
											/>
										</div>

										{profile.seller_type === "dealer" && (
											<div>
												<label className="block text-sm font-medium text-gray-700 mb-2">
													Website
												</label>
												<input
													type="url"
													value={editedProfile.website || ""}
													onChange={(e) =>
														handleInputChange("website", e.target.value)
													}
													className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-nexar-accent focus:border-transparent"
													placeholder="https://www.exemplu.ro"
												/>
											</div>
										)}

										<div className="flex space-x-3 pt-4">
											<button
												onClick={handleSaveProfile}
												disabled={isSubmitting}
												className="flex-1 bg-nexar-accent text-white py-2 rounded-lg font-semibold hover:bg-nexar-gold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
											>
												{isSubmitting ? (
													<div className="flex items-center justify-center">
														<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
														<span>Se salvează...</span>
													</div>
												) : (
													"Salvează"
												)}
											</button>
											<button
												onClick={handleCancelEdit}
												className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
											>
												Anulează
											</button>
										</div>
									</div>
								) : (
									<div className="space-y-4">
										<div className="flex items-center space-x-3">
											<Mail className="h-5 w-5 text-gray-400" />
											<span className="text-gray-700">{profile.email}</span>
										</div>

										{profile.phone && (
											<div className="flex items-center space-x-3">
												<Phone className="h-5 w-5 text-gray-400" />
												<span className="text-gray-700">{profile.phone}</span>
											</div>
										)}

										{profile.location && (
											<div className="flex items-center space-x-3">
												<MapPin className="h-5 w-5 text-gray-400" />
												<span className="text-gray-700">
													{profile.location}
												</span>
											</div>
										)}

										{profile.description && (
											<div className="pt-2 text-gray-700">
												<p>{profile.description}</p>
											</div>
										)}

										{profile.website && (
											<div className="pt-2">
												<a
													href={profile.website}
													target="_blank"
													rel="noopener noreferrer"
													className="text-nexar-accent hover:text-nexar-gold transition-colors"
												>
													{profile.website}
												</a>
											</div>
										)}

										{isCurrentUser && (
											<div className="pt-4 space-y-3">
												<button
													onClick={handleEditProfile}
													className="w-full bg-nexar-accent text-white py-2 rounded-lg font-semibold hover:bg-nexar-gold transition-colors flex items-center justify-center space-x-2"
												>
													<Edit className="h-4 w-4" />
													<span>Editează Profilul</span>
												</button>

												<button
													onClick={() =>
														setIsChangingPassword(!isChangingPassword)
													}
													className="w-full bg-gray-800 text-white py-2 rounded-lg font-semibold hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2"
												>
													<Lock className="h-4 w-4" />
													<span>Schimbă Parola</span>
												</button>
											</div>
										)}

										{/* Password Change Form */}
										{isCurrentUser && isChangingPassword && (
											<div className="mt-4 pt-4 border-t border-gray-200 animate-slide-up">
												<h3 className="text-lg font-semibold text-gray-900 mb-4">
													Schimbă Parola
												</h3>

												{passwordChangeSuccess && (
													<div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-3">
														<p className="text-green-700 flex items-center text-sm">
															<CheckCircle className="h-4 w-4 mr-2" />
															Parola a fost schimbată cu succes!
														</p>
													</div>
												)}

												<div className="space-y-4">
													<div>
														<label className="block text-sm font-medium text-gray-700 mb-2">
															Parolă Nouă
														</label>
														<div className="relative">
															<input
																type="password"
																value={passwordData.newPassword}
																onChange={(e) =>
																	handlePasswordChange(
																		"newPassword",
																		e.target.value,
																	)
																}
																className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-nexar-accent focus:border-transparent ${
																	passwordErrors.newPassword
																		? "border-red-500"
																		: "border-gray-300"
																}`}
																placeholder="Minim 8 caractere"
															/>
															<Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
														</div>
														{passwordErrors.newPassword && (
															<p className="mt-1 text-sm text-red-600 flex items-center">
																<AlertTriangle className="h-4 w-4 mr-1" />
																{passwordErrors.newPassword}
															</p>
														)}
													</div>

													<div>
														<label className="block text-sm font-medium text-gray-700 mb-2">
															Confirmă Parola
														</label>
														<div className="relative">
															<input
																type="password"
																value={passwordData.confirmPassword}
																onChange={(e) =>
																	handlePasswordChange(
																		"confirmPassword",
																		e.target.value,
																	)
																}
																className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-nexar-accent focus:border-transparent ${
																	passwordErrors.confirmPassword
																		? "border-red-500"
																		: "border-gray-300"
																}`}
																placeholder="Repetă parola nouă"
															/>
															<Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
														</div>
														{passwordErrors.confirmPassword && (
															<p className="mt-1 text-sm text-red-600 flex items-center">
																<AlertTriangle className="h-4 w-4 mr-1" />
																{passwordErrors.confirmPassword}
															</p>
														)}
													</div>

													<div className="flex space-x-3 pt-2">
														<button
															onClick={handleSavePassword}
															className="flex-1 bg-nexar-accent text-white py-2 rounded-lg font-semibold hover:bg-nexar-gold transition-colors"
														>
															Salvează Parola
														</button>
														<button
															onClick={() => {
																setIsChangingPassword(false);
																setPasswordData({
																	currentPassword: "",
																	newPassword: "",
																	confirmPassword: "",
																});
																setPasswordErrors({});
															}}
															className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
														>
															Anulează
														</button>
													</div>
												</div>
											</div>
										)}
									</div>
								)}
							</div>
						</div>

						{/* Stats Card */}
						<div className="bg-white rounded-2xl shadow-lg p-6 mt-6">
							<h2 className="text-lg font-semibold text-gray-900 mb-4">
								Statistici
							</h2>

							<div className="grid grid-cols-2 gap-4">
								<div className="bg-gray-50 rounded-xl p-4 text-center">
									<div className="text-2xl font-bold text-nexar-accent">
										{userListings.length}
									</div>
									<div className="text-sm text-gray-600">Anunțuri Active</div>
								</div>

								{isCurrentUser && (
									<div className="bg-yellow-50 rounded-xl p-4 text-center">
										<div className="text-2xl font-bold text-yellow-600">
											{pendingListings.length}
										</div>
										<div className="text-sm text-gray-600">În Așteptare</div>
									</div>
								)}
							</div>
						</div>
					</div>

					{/* Main Content */}
					<div className="lg:col-span-2">
						{/* Tabs */}
						<div className="bg-white rounded-2xl shadow-lg overflow-hidden">
							<div className="flex border-b border-gray-200">
								<button
									onClick={() => setActiveTab("listings")}
									className={`flex-1 py-4 px-6 text-center font-semibold transition-colors ${
										activeTab === "listings"
											? "text-nexar-accent border-b-2 border-nexar-accent"
											: "text-gray-600 hover:text-gray-900"
									}`}
								>
									Anunțuri Active
								</button>

								{isCurrentUser && (
									<button
										onClick={() => setActiveTab("pending")}
										className={`flex-1 py-4 px-6 text-center font-semibold transition-colors ${
											activeTab === "pending"
												? "text-nexar-accent border-b-2 border-nexar-accent"
												: "text-gray-600 hover:text-gray-900"
										}`}
									>
										În Așteptare{" "}
										{pendingListings.length > 0 && (
											<span className="ml-2 bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-0.5 rounded-full">
												{pendingListings.length}
											</span>
										)}
									</button>
								)}
							</div>

							{/* Active Listings Tab */}
							{activeTab === "listings" && (
								<div className="p-6">
									<h2 className="text-xl font-semibold text-gray-900 mb-6">
										{isCurrentUser
											? "Anunțurile Mele"
											: `Anunțurile lui ${profile.name}`}
									</h2>

									{isLoadingListings ? (
										<div className="text-center py-8">
											<div className="w-12 h-12 border-4 border-nexar-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
											<p className="text-gray-600">Se încarcă anunțurile...</p>
										</div>
									) : userListings.length === 0 ? (
										<div className="text-center py-8 bg-gray-50 rounded-xl">
											<Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
											<h3 className="text-lg font-semibold text-gray-900 mb-2">
												{isCurrentUser
													? "Nu ai anunțuri active"
													: `${profile.name} nu are anunțuri active`}
											</h3>
											{isCurrentUser && (
												<button
													onClick={() => navigate("/adauga-anunt")}
													className="mt-4 bg-nexar-accent text-white px-6 py-2 rounded-lg font-semibold hover:bg-nexar-gold transition-colors"
												>
													Adaugă Anunț
												</button>
											)}
										</div>
									) : (
										<div className="space-y-4">
											{userListings.map((listing) => (
												<div
													key={listing.id}
													className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
													onClick={() => handleViewListing(listing.id)}
												>
													<div className="flex flex-col sm:flex-row">
														<div className="relative w-full sm:w-48 h-40 sm:h-auto">
															<img
																src={
																	listing.imagesThumbs &&
																	listing.imagesThumbs[0]
																		? listing.imagesThumbs[0]
																		: listing.images && listing.images[0]
																		? listing.images[0]
																		: "https://images.pexels.com/photos/2116475/pexels-photo-2116475.jpeg"
																}
																alt={listing.title}
																className="w-full h-full object-cover"
																onError={(e) => {
																	const target = e.currentTarget;
																	target.src =
																		"https://images.pexels.com/photos/2116475/pexels-photo-2116475.jpeg";
																}}
															/>

															<div className="absolute top-2 left-2">
																<span className="bg-nexar-accent text-white px-2 py-1 rounded-full text-xs font-semibold">
																	{listing.category}
																</span>
															</div>
														</div>

														<div className="flex-1 p-4">
															<div className="flex justify-between items-start">
																<div>
																	<h3 className="text-lg font-semibold text-gray-900 mb-2">
																		{listing.title}
																	</h3>
																	<div className="text-xl font-bold text-nexar-accent mb-2">
																		€{listing.price.toLocaleString()}
																	</div>
																</div>

																<div className="flex items-center space-x-1 bg-gray-50 rounded-lg px-2 py-1">
																	<Eye className="h-4 w-4 text-gray-500" />
																	<span className="text-xs font-medium">
																		{listing.views_count || 0}
																	</span>
																</div>
															</div>

															<div className="grid grid-cols-3 gap-2 mb-4 text-sm">
																<div className="flex items-center space-x-1 text-gray-600">
																	<Calendar className="h-4 w-4" />
																	<span>{listing.year}</span>
																</div>
																<div className="flex items-center space-x-1 text-gray-600">
																	<MapPin className="h-4 w-4" />
																	<span>{listing.location}</span>
																</div>
															</div>

															{isCurrentUser && (
																<div className="flex space-x-2">
																	<button
																		onClick={(e) => {
																			e.stopPropagation();
																			handleViewListing(listing.id);
																		}}
																		className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center space-x-1"
																	>
																		<Eye className="h-4 w-4" />
																		<span>Vezi</span>
																	</button>
																	<button
																		onClick={(e) => {
																			e.stopPropagation();
																			handleEditListing(listing.id);
																		}}
																		className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-medium hover:bg-blue-200 transition-colors flex items-center space-x-1"
																	>
																		<Edit className="h-4 w-4" />
																		<span>Editează</span>
																	</button>
																	<button
																		onClick={(e) => {
																			e.stopPropagation();
																			handleDeleteListing(listing.id);
																		}}
																		className="bg-red-100 text-red-700 px-4 py-2 rounded-lg font-medium hover:bg-red-200 transition-colors flex items-center space-x-1"
																	>
																		<X className="h-4 w-4" />
																		<span>Șterge</span>
																	</button>
																</div>
															)}
														</div>
													</div>
												</div>
											))}
										</div>
									)}
								</div>
							)}

							{/* Pending Listings Tab */}
							{activeTab === "pending" && isCurrentUser && (
								<div className="p-6">
									<h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
										<Clock className="h-5 w-5 mr-2 text-yellow-600" />
										Anunțuri în Așteptare
									</h2>

									<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
										<p className="text-yellow-700 flex items-start">
											<AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
											<span>
												Anunțurile tale sunt în curs de verificare de către
												administratori. Acest proces poate dura până la 24 de
												ore. Vei fi notificat când anunțurile tale vor fi
												aprobate.
											</span>
										</p>
									</div>

									{isLoadingListings ? (
										<div className="text-center py-8">
											<div className="w-12 h-12 border-4 border-nexar-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
											<p className="text-gray-600">Se încarcă anunțurile...</p>
										</div>
									) : pendingListings.length === 0 ? (
										<div className="text-center py-8 bg-gray-50 rounded-xl">
											<CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
											<h3 className="text-lg font-semibold text-gray-900 mb-2">
												Nu ai anunțuri în așteptare
											</h3>
											<p className="text-gray-600 mb-4">
												Toate anunțurile tale au fost procesate. Poți adăuga un
												anunț nou oricând.
											</p>
											<button
												onClick={() => navigate("/adauga-anunt")}
												className="bg-nexar-accent text-white px-6 py-2 rounded-lg font-semibold hover:bg-nexar-gold transition-colors"
											>
												Adaugă Anunț Nou
											</button>
										</div>
									) : (
										<div className="space-y-4">
											{pendingListings.map((listing) => (
												<div
													key={listing.id}
													className="bg-white border border-yellow-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
													onClick={() => handleViewListing(listing.id)}
												>
													<div className="flex flex-col sm:flex-row">
														<div className="relative w-full sm:w-48 h-40 sm:h-auto">
															<img
																src={
																	listing.images && listing.images[0]
																		? listing.images[0]
																		: "https://images.pexels.com/photos/2116475/pexels-photo-2116475.jpeg"
																}
																alt={listing.title}
																className="w-full h-full object-cover"
																onError={(e) => {
																	const target =
																		e.currentTarget as HTMLImageElement;
																	target.src =
																		"https://images.pexels.com/photos/2116475/pexels-photo-2116475.jpeg";
																}}
															/>
															<div className="absolute top-2 left-2">
																<span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
																	În așteptare
																</span>
															</div>
														</div>

														<div className="flex-1 p-4">
															<div className="flex justify-between items-start">
																<div>
																	<h3 className="text-lg font-semibold text-gray-900 mb-2">
																		{listing.title}
																	</h3>
																	<div className="text-xl font-bold text-nexar-accent mb-2">
																		€{listing.price.toLocaleString()}
																	</div>
																</div>

																<div className="flex items-center space-x-2 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-lg">
																	<Clock className="h-4 w-4" />
																	<span className="text-xs font-medium">
																		În așteptare
																	</span>
																</div>
															</div>

															<div className="grid grid-cols-3 gap-2 mb-4 text-sm">
																<div className="flex items-center space-x-1 text-gray-600">
																	<Calendar className="h-4 w-4" />
																	<span>{listing.year}</span>
																</div>
																<div className="flex items-center space-x-1 text-gray-600">
																	<MapPin className="h-4 w-4" />
																	<span>{listing.location}</span>
																</div>
															</div>

															<div className="flex space-x-2">
																<button
																	onClick={(e) => {
																		e.stopPropagation();
																		handleEditListing(listing.id);
																	}}
																	className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-medium hover:bg-blue-200 transition-colors flex items-center space-x-1"
																>
																	<Edit className="h-4 w-4" />
																	<span>Editează</span>
																</button>
																<button
																	onClick={(e) => {
																		e.stopPropagation();
																		handleDeleteListing(listing.id);
																	}}
																	className="bg-red-100 text-red-700 px-4 py-2 rounded-lg font-medium hover:bg-red-200 transition-colors flex items-center space-x-1"
																>
																	<X className="h-4 w-4" />
																	<span>Șterge</span>
																</button>
															</div>
														</div>
													</div>
												</div>
											))}
										</div>
									)}
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProfilePage;

export type User = {
	id: string;
	name: string;
	email: string;
	phone?: string;
	location?: string;
	avatar_url?: string;
	website?: string;
	seller_type?: string;
	description?: string;
	// ... alte proprietăți
};
