import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import HomePage from "./HomePage";
import {
	Eye,
	EyeOff,
	Mail,
	Lock,
	User,
	Phone,
	MapPin,
	Building,
	AlertTriangle,
	CheckCircle,
	ChevronDown,
} from "lucide-react";
import { auth, supabase, romanianCities } from "../lib/supabase";

const AuthPage = () => {
	const [isLogin, setIsLogin] = useState(true);
	const [isResetPassword, setIsResetPassword] = useState(false);
	const [isPasswordReset, setIsPasswordReset] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const [successMessage, setSuccessMessage] = useState("");
	const navigate = useNavigate();
	const location = useLocation();
	const successMessageRef = useRef<HTMLDivElement>(null);

	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
		phone: "",
		location: "",
		sellerType: "individual",
		agreeToTerms: false,
	});
	const [validationErrors, setValidationErrors] = useState<
		Record<string, string>
	>({});
	const [isValidating, setIsValidating] = useState(false);
	const [showLocationDropdown, setShowLocationDropdown] = useState(false);
	const [filteredCities, setFilteredCities] = useState<string[]>([]);

	useEffect(() => {
		// Verificăm dacă utilizatorul este deja autentificat
		const checkAuth = async () => {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (user) {
				navigate("/");
			}
		};

		checkAuth();

		// Verificăm dacă suntem pe pagina de confirmare email sau resetare parolă
		const hash = location.hash;
		if (hash.includes("#access_token=") || hash.includes("type=recovery")) {
			handleAuthRedirect();
		}
	}, [navigate, location]);

	// Funcție pentru a gestiona redirecturile de autentificare
	const handleAuthRedirect = async () => {
		try {
			const { data, error } = await supabase.auth.getSession();

			if (error) {
				console.error("Error handling auth redirect:", error);
				setError(
					"A apărut o eroare la procesarea link-ului. Te rugăm să încerci din nou.",
				);
				return;
			}

			if (data?.session) {
				// Verificăm dacă este confirmare email sau resetare parolă
				const hash = location.hash;

				if (hash.includes("type=recovery")) {
					// Este resetare parolă
					setIsPasswordReset(true);
					setIsLogin(false);
					setIsResetPassword(false);
					setSuccessMessage("Poți seta acum o nouă parolă pentru contul tău.");
				} else {
					// Este confirmare email sau login normal
					navigate("/auth/confirm");
				}
			}
		} catch (err) {
			console.error("Error in handleAuthRedirect:", err);
			setError(
				"A apărut o eroare la procesarea link-ului. Te rugăm să încerci din nou.",
			);
		}
	};

	// Scroll la mesajul de succes când apare
	useEffect(() => {
		if (successMessage && successMessageRef.current) {
			successMessageRef.current.scrollIntoView({
				behavior: "smooth",
				block: "center",
			});
		}
	}, [successMessage]);

	// Funcții de validare
	const validateName = (name: string): string => {
		if (!name.trim()) return "Numele este obligatoriu";
		if (name.trim().length < 2)
			return "Numele trebuie să aibă cel puțin 2 caractere";
		if (name.trim().length > 50)
			return "Numele nu poate depăși 50 de caractere";
		if (!/^[a-zA-ZăâîșțĂÂÎȘȚ\s\-\.]+$/.test(name.trim())) {
			return "Numele poate conține doar litere, spații, cratimă și punct";
		}
		return "";
	};

	// VALIDARE EMAIL REPARATĂ - acceptă toate email-urile valide
	const validateEmail = (email: string): string => {
		if (!email.trim()) return "Email-ul este obligatoriu";

		// Regex mai permisiv pentru email-uri valide
		const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

		if (!emailRegex.test(email.trim())) {
			return "Email-ul nu este valid";
		}

		// Verificări suplimentare pentru email-uri comune
		const emailLower = email.trim().toLowerCase();

		// Verifică că nu începe sau se termină cu punct
		if (emailLower.startsWith(".") || emailLower.endsWith(".")) {
			return "Email-ul nu poate începe sau se termina cu punct";
		}

		// Verifică că nu are puncte consecutive
		if (emailLower.includes("..")) {
			return "Email-ul nu poate conține puncte consecutive";
		}

		// Verifică că domeniul nu este gol
		const parts = emailLower.split("@");
		if (parts.length !== 2 || parts[0].length === 0 || parts[1].length === 0) {
			return "Email-ul nu este valid";
		}

		return "";
	};

	const validatePhone = (phone: string): string => {
		if (!phone.trim()) return "Numărul de telefon este obligatoriu";

		// Curățăm numărul de telefon
		const cleanPhone = phone.replace(/[\s\-\(\)]/g, "");

		// Verificăm formatul românesc
		const phoneRegex = /^(\+4|0)[0-9]{9}$/;
		if (!phoneRegex.test(cleanPhone)) {
			return "Numărul de telefon nu este valid (ex: 0790454647 sau +40790454647)";
		}

		// Verificăm prefixele valide pentru România
		const validPrefixes = [
			"072",
			"073",
			"074",
			"075",
			"076",
			"077",
			"078",
			"079",
		];

		let isValidPrefix = false;
		if (cleanPhone.startsWith("+4")) {
			const withoutCountry = cleanPhone.substring(2);
			isValidPrefix = validPrefixes.some((prefix) =>
				withoutCountry.startsWith(prefix.substring(1)),
			);
		} else if (cleanPhone.startsWith("0")) {
			isValidPrefix = validPrefixes.some((prefix) =>
				cleanPhone.startsWith(prefix),
			);
		}

		if (!isValidPrefix) {
			return "Prefixul nu este valid pentru România (ex: 072, 073, 074, 075, 076, 077, 078, 079)";
		}

		return "";
	};

	const validateLocation = (location: string): string => {
		if (!location.trim()) return "Locația este obligatorie";

		// Verificăm dacă locația este în lista orașelor românești
		const isValidCity = romanianCities.some(
			(city) => city.toLowerCase() === location.trim().toLowerCase(),
		);

		if (!isValidCity) {
			return "Te rugăm să selectezi un oraș din lista disponibilă";
		}

		return "";
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

	// Funcție pentru filtrarea orașelor
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

	const validateForm = async (): Promise<boolean> => {
		const errors: Record<string, string> = {};

		if (isPasswordReset) {
			// Validare pentru resetarea parolei
			const passwordError = validatePassword(formData.password);
			if (passwordError) errors.password = passwordError;

			if (formData.password !== formData.confirmPassword) {
				errors.confirmPassword = "Parolele nu coincid";
			}
		} else if (isResetPassword) {
			// Validare pentru cererea de resetare a parolei
			const emailError = validateEmail(formData.email);
			if (emailError) errors.email = emailError;
		} else if (isLogin) {
			// Validare pentru login
			const emailError = validateEmail(formData.email);
			if (emailError) errors.email = emailError;

			if (!formData.password) errors.password = "Parola este obligatorie";
		} else {
			// Validare pentru înregistrare
			const nameError = validateName(formData.name);
			if (nameError) errors.name = nameError;

			const emailError = validateEmail(formData.email);
			if (emailError) errors.email = emailError;

			// NU MAI VERIFICĂM DACĂ EMAIL-UL EXISTĂ - lăsăm Supabase să gestioneze asta

			const phoneError = validatePhone(formData.phone);
			if (phoneError) errors.phone = phoneError;

			const locationError = validateLocation(formData.location);
			if (locationError) errors.location = locationError;

			const passwordError = validatePassword(formData.password);
			if (passwordError) errors.password = passwordError;

			if (formData.password !== formData.confirmPassword) {
				errors.confirmPassword = "Parolele nu coincid";
			}

			if (!formData.agreeToTerms) {
				errors.agreeToTerms = "Trebuie să accepți termenii și condițiile";
			}
		}

		setValidationErrors(errors);
		return Object.keys(errors).length === 0;
	};

	const handleInputChange = (field: string, value: string | boolean) => {
		setFormData((prev) => ({ ...prev, [field]: value }));

		// Curățăm eroarea pentru câmpul modificat
		if (validationErrors[field]) {
			setValidationErrors((prev) => ({ ...prev, [field]: "" }));
		}

		// Curățăm eroarea generală
		if (error) setError("");
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (isPasswordReset) {
			await handleSetNewPassword();
			return;
		}

		if (isResetPassword) {
			await handleResetPassword();
			return;
		}

		console.log("🚀 Starting authentication process...");
		console.log("📧 Email being used:", formData.email.trim());

		// Validăm formularul
		const isValid = await validateForm();
		if (!isValid) {
			console.log("❌ Form validation failed:", validationErrors);
			return;
		}

		setIsLoading(true);
		setError("");
		setSuccessMessage("");

		try {
			if (isLogin) {
				// Login
				console.log("🔐 Attempting login...");
				const { data, error } = await auth.signIn(
					formData.email.trim(),
					formData.password,
				);

				if (error) {
					console.error("❌ Login error:", error);

					const errorMessage = (error as { message: string }).message;

					if (errorMessage.includes("Invalid login credentials")) {
						setError("Email sau parolă incorectă");
					} else if (errorMessage.includes("Email not confirmed")) {
						setError(
							"Te rugăm să-ți confirmi email-ul înainte de a te conecta",
						);
					} else if (errorMessage.includes("Too many requests")) {
						setError("Prea multe încercări. Te rugăm să aștepți câteva minute");
					} else {
						setError(errorMessage);
					}
				} else if (data?.user) {
					console.log("✅ Login successful for:", data.user.email);
					navigate("/"); // redirecționează către ruta cu HomePage
				}
			} else {
				// Register
				console.log("📝 Attempting registration...");
				const { data, error } = await auth.signUp(
					formData.email.trim(),
					formData.password,
					{
						name: formData.name.trim(),
						phone: formData.phone.replace(/[\s\-\(\)]/g, ""),
						location: formData.location.trim(),
						sellerType: formData.sellerType,
					},
				);

				if (error) {
					console.error("❌ Registration error:", error);

					const errorMessage = (error as { message: string }).message;

					if (
						errorMessage.includes("already registered") ||
						errorMessage.includes("User already registered")
					) {
						setError(
							"Acest email este deja înregistrat. Încearcă să te conectezi în schimb.",
						);
					} else if (errorMessage.includes("Password should be at least")) {
						setError("Parola trebuie să aibă cel puțin 6 caractere");
					} else if (
						errorMessage.includes("Unable to validate email") ||
						errorMessage.includes("invalid")
					) {
						setError(
							"Email-ul introdus nu este valid. Te rugăm să verifici formatul.",
						);
					} else if (errorMessage.includes("signup_disabled")) {
						setError(
							"Înregistrarea este temporar dezactivată. Te rugăm să încerci mai târziu.",
						);
					} else {
						setError(`Eroare la înregistrare: ${errorMessage}`);
					}
				} else if (data?.user) {
					console.log("✅ Registration successful for:", data.user.email);

					if (!data.session) {
						setSuccessMessage(
							"Cont creat cu succes! Verifică-ți email-ul pentru a confirma contul înainte de a te conecta.",
						);

						// Resetăm formularul
						setFormData({
							name: "",
							email: "",
							password: "",
							confirmPassword: "",
							phone: "",
							location: "",
							sellerType: "individual",
							agreeToTerms: false,
						});
					} else {
						setSuccessMessage("Cont creat cu succes! Ești acum conectat.");

						// Redirecționăm către pagina principală după 2 secunde
						setTimeout(() => {
							navigate("/");
						}, 288888000);
					}
				}
			}
		} catch (err: any) {
			console.error("💥 Authentication error:", err);
			setError("A apărut o eroare neașteptată. Te rugăm să încerci din nou.");
		} finally {
			setIsLoading(false);
		}
	};

	const handleResetPassword = async () => {
		const emailError = validateEmail(formData.email);
		if (emailError) {
			setError("Introdu o adresă de email validă pentru a reseta parola");
			return;
		}

		setIsLoading(true);

		try {
			const { error } = await auth.resetPassword(formData.email.trim());

			if (error) {
				const errorMessage = (error as { message: string }).message;
				setError(errorMessage);
			} else {
				setSuccessMessage(
					"Un email pentru resetarea parolei a fost trimis. Verifică-ți căsuța de email.",
				);
			}
		} catch (err) {
			console.error("Password reset error:", err);
			setError("A apărut o eroare. Te rugăm să încerci din nou.");
		} finally {
			setIsLoading(false);
		}
	};

	const handleSetNewPassword = async () => {
		// Validare
		const passwordError = validatePassword(formData.password);
		if (passwordError) {
			setValidationErrors({ password: passwordError });
			return;
		}

		if (formData.password !== formData.confirmPassword) {
			setValidationErrors({ confirmPassword: "Parolele nu coincid" });
			return;
		}

		setIsLoading(true);

		try {
			const { error } = await auth.updatePassword(formData.password);

			if (error) {
				console.error("Error setting new password:", error);
				const errorMessage = (error as { message: string }).message;
				setError(`Eroare la setarea noii parole: ${errorMessage}`);
			} else {
				setSuccessMessage(
					"Parola a fost actualizată cu succes! Te poți conecta acum cu noile credențiale.",
				);

				// Resetăm starea și redirecționăm către login după 3 secunde
				setTimeout(() => {
					setIsPasswordReset(false);
					setIsLogin(true);
					setFormData({
						...formData,
						password: "",
						confirmPassword: "",
					});
				}, 3000);
			}
		} catch (err) {
			console.error("Error setting new password:", err);
			setError(
				"A apărut o eroare la setarea noii parole. Te rugăm să încerci din nou.",
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full space-y-6 sm:space-y-8">
				<div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
					{/* Header cu logo mai mare */}
					<div className="text-center mb-6 sm:mb-8">
						<div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-6">
							<img
								loading="lazy"
								src="/Nexar - logo_black & red.png"
								alt="Nexar Logo"
								className="h-20 sm:h-24 md:h-28 w-auto"
								onError={(e) => {
									const target = e.currentTarget as HTMLImageElement;
									if (target.src.includes("Nexar - logo_black & red.png")) {
										target.src = "/nexar-logo.png";
									} else if (target.src.includes("nexar-logo.png")) {
										target.src = "/image.png";
									} else {
										target.style.display = "none";
										const textLogo = target.nextElementSibling as HTMLElement;
										if (textLogo) {
											textLogo.style.display = "block";
										}
									}
								}}
							/>
							{/* Fallback text logo */}
							<div className="hidden text-4xl sm:text-5xl font-bold text-nexar-accent">
								NEXAR
							</div>
						</div>
						<h2 className="text-xl sm:text-2xl font-bold text-gray-900">
							{isPasswordReset
								? "Setează o nouă parolă"
								: isResetPassword
								? "Resetare Parolă"
								: isLogin
								? "Conectează-te"
								: "Creează Cont"}
						</h2>
						<p className="text-gray-600 mt-2 text-sm sm:text-base">
							{isPasswordReset
								? "Introdu noua parolă pentru contul tău"
								: isResetPassword
								? "Introdu adresa de email pentru a primi un link de resetare a parolei"
								: isLogin
								? "Bun venit înapoi! Conectează-te la contul tău."
								: "Alătură-te comunității și începe să vinzi sau să cumperi motociclete."}
						</p>
					</div>

					{/* Success Message */}
					{successMessage && (
						<div
							ref={successMessageRef}
							className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4"
						>
							<p className="text-green-700 flex items-center">
								<CheckCircle className="h-5 w-5 mr-2" />
								{successMessage}
							</p>
						</div>
					)}

					{/* Error Message */}
					{error && (
						<div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
							<p className="text-red-700 flex items-center">
								<AlertTriangle className="h-5 w-5 mr-2" />
								{error}
							</p>
						</div>
					)}

					{/* Toggle Buttons */}
					{!isResetPassword && !isPasswordReset && (
						<div className="flex bg-gray-50 rounded-xl p-1 mb-6 sm:mb-8">
							<button
								onClick={() => {
									setIsLogin(true);
									setIsResetPassword(false);
									setValidationErrors({});
									setError("");
									setSuccessMessage("");
								}}
								className={`flex-1 py-2.5 sm:py-3 px-4 rounded-lg font-semibold transition-colors text-sm sm:text-base ${
									isLogin
										? "bg-white text-gray-900 shadow-sm"
										: "text-gray-600 hover:text-gray-900"
								}`}
							>
								Conectare
							</button>
							<button
								onClick={() => {
									setIsLogin(false);
									setIsResetPassword(false);
									setValidationErrors({});
									setError("");
									setSuccessMessage("");
								}}
								className={`flex-1 py-2.5 sm:py-3 px-4 rounded-lg font-semibold transition-colors text-sm sm:text-base ${
									!isLogin
										? "bg-white text-gray-900 shadow-sm"
										: "text-gray-600 hover:text-gray-900"
								}`}
							>
								Înregistrare
							</button>
						</div>
					)}

					{/* Form */}
					<form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
						{!isLogin && !isResetPassword && !isPasswordReset && (
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Nume complet *
								</label>
								<div className="relative">
									<input
										type="text"
										value={formData.name}
										onChange={(e) => handleInputChange("name", e.target.value)}
										className={`w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 border rounded-xl focus:ring-2 focus:ring-nexar-accent focus:border-transparent transition-colors text-sm sm:text-base ${
											validationErrors.name
												? "border-red-500"
												: "border-gray-300"
										}`}
										placeholder="Bogdan Popescu"
										required={!isLogin && !isResetPassword && !isPasswordReset}
									/>
									<User className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
								</div>
								{validationErrors.name && (
									<p className="mt-1 text-sm text-red-600 flex items-center">
										<AlertTriangle className="h-4 w-4 mr-1" />
										{validationErrors.name}
									</p>
								)}
							</div>
						)}

						{!isPasswordReset && (
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Email *
								</label>
								<div className="relative">
									<input
										type="email"
										value={formData.email}
										onChange={(e) => handleInputChange("email", e.target.value)}
										className={`w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 border rounded-xl focus:ring-2 focus:ring-nexar-accent focus:border-transparent transition-colors text-sm sm:text-base ${
											validationErrors.email
												? "border-red-500"
												: "border-gray-300"
										}`}
										placeholder="bogdan@exemplu.com"
										required
									/>
									<Mail className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
									{isValidating && (
										<div className="absolute right-3 top-1/2 transform -translate-y-1/2">
											<div className="w-4 h-4 border-2 border-nexar-accent border-t-transparent rounded-full animate-spin"></div>
										</div>
									)}
								</div>
								{validationErrors.email && (
									<p className="mt-1 text-sm text-red-600 flex items-center">
										<AlertTriangle className="h-4 w-4 mr-1" />
										{validationErrors.email}
									</p>
								)}
							</div>
						)}

						{!isLogin && !isResetPassword && !isPasswordReset && (
							<>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Telefon *
									</label>
									<div className="relative">
										<input
											type="tel"
											value={formData.phone}
											onChange={(e) =>
												handleInputChange("phone", e.target.value)
											}
											className={`w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 border rounded-xl focus:ring-2 focus:ring-nexar-accent focus:border-transparent transition-colors text-sm sm:text-base ${
												validationErrors.phone
													? "border-red-500"
													: "border-gray-300"
											}`}
											placeholder="0790 45 46 47"
											required={
												!isLogin && !isResetPassword && !isPasswordReset
											}
										/>
										<Phone className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
									</div>
									{validationErrors.phone && (
										<p className="mt-1 text-sm text-red-600 flex items-center">
											<AlertTriangle className="h-4 w-4 mr-1" />
											{validationErrors.phone}
										</p>
									)}
								</div>

								<div className="relative">
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Locația *
									</label>
									<div className="relative">
										<input
											type="text"
											value={formData.location}
											onChange={(e) => handleLocationChange(e.target.value)}
											onFocus={() => {
												if (formData.location.length > 0) {
													const filtered = romanianCities
														.filter((city) =>
															city
																.toLowerCase()
																.includes(formData.location.toLowerCase()),
														)
														.slice(0, 10);
													setFilteredCities(filtered);
													setShowLocationDropdown(true);
												}
											}}
											onBlur={() => {
												// Delay pentru a permite click-ul pe opțiuni
												setTimeout(() => setShowLocationDropdown(false), 200);
											}}
											className={`w-full pl-10 sm:pl-12 pr-10 py-2.5 sm:py-3 border rounded-xl focus:ring-2 focus:ring-nexar-accent focus:border-transparent transition-colors text-sm sm:text-base ${
												validationErrors.location
													? "border-red-500"
													: "border-gray-300"
											}`}
											placeholder="Începe să scrii orașul..."
											required={
												!isLogin && !isResetPassword && !isPasswordReset
											}
											autoComplete="off"
										/>
										<MapPin className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
										<ChevronDown className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />

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
									{validationErrors.location && (
										<p className="mt-1 text-sm text-red-600 flex items-center">
											<AlertTriangle className="h-4 w-4 mr-1" />
											{validationErrors.location}
										</p>
									)}
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Tip Vânzător *
									</label>
									<div className="relative">
										<select
											value={formData.sellerType}
											onChange={(e) =>
												handleInputChange("sellerType", e.target.value)
											}
											className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-nexar-accent focus:border-transparent transition-colors appearance-none text-sm sm:text-base"
											required={
												!isLogin && !isResetPassword && !isPasswordReset
											}
										>
											<option value="individual">Vânzător Privat</option>
											<option value="dealer">Dealer Autorizat</option>
										</select>
										<Building className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
									</div>
								</div>
							</>
						)}

						{!isResetPassword && (
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Parolă *
								</label>
								<div className="relative">
									<input
										type={showPassword ? "text" : "password"}
										value={formData.password}
										onChange={(e) =>
											handleInputChange("password", e.target.value)
										}
										className={`w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-2.5 sm:py-3 border rounded-xl focus:ring-2 focus:ring-nexar-accent focus:border-transparent transition-colors text-sm sm:text-base ${
											validationErrors.password
												? "border-red-500"
												: "border-gray-300"
										}`}
										placeholder="••••••••"
										required
									/>
									<Lock className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
									<button
										type="button"
										onClick={() => setShowPassword(!showPassword)}
										className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
									>
										{showPassword ? (
											<EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
										) : (
											<Eye className="h-4 w-4 sm:h-5 sm:w-5" />
										)}
									</button>
								</div>
								{validationErrors.password && (
									<p className="mt-1 text-sm text-red-600 flex items-center">
										<AlertTriangle className="h-4 w-4 mr-1" />
										{validationErrors.password}
									</p>
								)}
							</div>
						)}

						{((!isLogin && !isResetPassword) || isPasswordReset) && (
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Confirmă parola *
								</label>
								<div className="relative">
									<input
										type="password"
										value={formData.confirmPassword}
										onChange={(e) =>
											handleInputChange("confirmPassword", e.target.value)
										}
										className={`w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 border rounded-xl focus:ring-2 focus:ring-nexar-accent focus:border-transparent transition-colors text-sm sm:text-base ${
											validationErrors.confirmPassword
												? "border-red-500"
												: "border-gray-300"
										}`}
										placeholder="••••••••"
										required={(!isLogin && !isResetPassword) || isPasswordReset}
									/>
									<Lock className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
								</div>
								{validationErrors.confirmPassword && (
									<p className="mt-1 text-sm text-red-600 flex items-center">
										<AlertTriangle className="h-4 w-4 mr-1" />
										{validationErrors.confirmPassword}
									</p>
								)}
							</div>
						)}

						{isLogin && !isResetPassword && !isPasswordReset && (
							<div className="flex items-center justify-between">
								<label className="flex items-center">
									<input
										type="checkbox"
										className="rounded border-gray-300 text-nexar-accent focus:ring-nexar-accent"
									/>
									<span className="ml-2 text-sm text-gray-600">
										Ține-mă conectat
									</span>
								</label>
								<button
									type="button"
									onClick={() => {
										setIsResetPassword(true);
										setError("");
										setSuccessMessage("");
									}}
									className="text-sm text-nexar-accent hover:text-nexar-gold transition-colors"
								>
									Ai uitat parola?
								</button>
							</div>
						)}

						{!isLogin && !isResetPassword && !isPasswordReset && (
							<div className="flex items-start space-x-3">
								<input
									type="checkbox"
									checked={formData.agreeToTerms}
									onChange={(e) =>
										handleInputChange("agreeToTerms", e.target.checked)
									}
									className="mt-1 rounded border-gray-300 text-nexar-accent focus:ring-nexar-accent"
									required={!isLogin && !isResetPassword && !isPasswordReset}
								/>
								<span className="text-sm text-gray-600">
									Sunt de acord cu{" "}
									<Link
										to="/termeni"
										target="_blank"
										className="text-nexar-accent hover:text-nexar-gold transition-colors"
									>
										Termenii și Condițiile
									</Link>{" "}
									și{" "}
									<Link
										to="/confidentialitate"
										target="_blank"
										className="text-nexar-accent hover:text-nexar-gold transition-colors"
									>
										Politica de Confidențialitate
									</Link>
								</span>
								{validationErrors.agreeToTerms && (
									<p className="text-sm text-red-600 flex items-center">
										<AlertTriangle className="h-4 w-4 mr-1" />
										{validationErrors.agreeToTerms}
									</p>
								)}
							</div>
						)}

						<button
							type="submit"
							disabled={isLoading || isValidating}
							className="w-full bg-nexar-accent text-white py-2.5 sm:py-3 rounded-xl font-semibold hover:bg-nexar-gold transition-colors transform hover:scale-105 duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
						>
							{isLoading
								? "Se procesează..."
								: isPasswordReset
								? "Setează noua parolă"
								: isResetPassword
								? "Trimite link de resetare"
								: isLogin
								? "Conectează-te"
								: "Creează Cont"}
						</button>
					</form>

					{/* Footer */}
					<div className="mt-6 sm:mt-8 text-center">
						{isResetPassword || isPasswordReset ? (
							<p className="text-sm text-gray-600">
								Ți-ai amintit parola?{" "}
								<button
									onClick={() => {
										setIsResetPassword(false);
										setIsPasswordReset(false);
										setIsLogin(true);
										setError("");
										setSuccessMessage("");
									}}
									className="text-nexar-accent hover:text-nexar-gold font-semibold transition-colors"
								>
									Înapoi la conectare
								</button>
							</p>
						) : (
							<p className="text-sm text-gray-600">
								{isLogin ? "Nu ai cont?" : "Ai deja cont?"}{" "}
								<button
									onClick={() => {
										setIsLogin(!isLogin);
										setValidationErrors({});
										setError("");
										setSuccessMessage("");
									}}
									className="text-nexar-accent hover:text-nexar-gold font-semibold transition-colors"
								>
									{isLogin ? "Înregistrează-te aici" : "Conectează-te aici"}
								</button>
							</p>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default AuthPage;
