import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";

// Credențialele Supabase pentru proiectul tău
const supabaseUrl = "https://tidnmzsivsthwwcfdzyo.supabase.co";
const supabaseAnonKey =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpZG5tenNpdnN0aHd3Y2ZkenlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3MjE5NTgsImV4cCI6MjA2NjI5Nzk1OH0.Sr1gSZ2qtoff7gmulkT8uIzB8eL7gqKUUNVj82OqHog";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
	auth: {
		autoRefreshToken: true,
		persistSession: true,
		detectSessionInUrl: true, // Activăm detectarea sesiunii în URL pentru confirmarea emailului
		flowType: "pkce",
	},
});

// Tipuri pentru baza de date
export interface Listing {
	id: string;
	title: string;
	price: number;
	year: number;
	mileage: number;
	location: string;
	category: string;
	brand: string;
	model: string;
	engine_capacity: number;
	fuel_type: string;
	transmission: string;
	condition: string;
	description: string;
	images: string[];
	seller_id: string;
	seller_name: string;
	seller_type: "individual" | "dealer";
	featured: boolean;
	created_at: string;
	updated_at: string;
	status: string;
	availability?: "pe_stoc" | "la_comanda";
}

export interface User {
	id: string;
	name: string;
	email: string;
	phone?: string;
	location?: string;
	avatar_url?: string;
	verified: boolean;
	created_at: string;
	suspended?: boolean;
}

// Lista orașelor din România - actualizată cu sectoarele Bucureștiului
export const romanianCities = [
	"București S1",
	"București S2",
	"București S3",
	"București S4",
	"București S5",
	"București S6",
	"Abrud",
	"Adjud",
	"Agnita",
	"Aiud",
	"Alba Iulia",
	"Aleșd",
	"Alexandria",
	"Amara",
	"Anina",
	"Arad",
	"Ardud",
	"Avrig",
	"Azuga",
	"Bacău",
	"Baia de Aramă",
	"Baia de Arieș",
	"Baia Mare",
	"Baia Sprie",
	"Băbeni",
	"Băicoi",
	"Băile Felix",
	"Băile Govora",
	"Băile Herculane",
	"Băile Olănești",
	"Băile Tușnad",
	"Bălan",
	"Bălcești",
	"Bălți",
	"Balș",
	"Băneasa",
	"Baraolt",
	"Bârlad",
	"Bechet",
	"Beclean",
	"Beiuș",
	"Bistrița",
	"Bistrița Bârgăului",
	"Blaj",
	"Bocșa",
	"Bolintin-Vale",
	"Borșa",
	"Botoșani",
	"Brad",
	"Brăila",
	"Bragadiru",
	"Breaza",
	"Brezoi",
	"Broșteni",
	"Buftea",
	"Buhusi",
	"Bumbești-Jiu",
	"Buzău",
	"Bușteni",
	"Călan",
	"Călărași",
	"Câmpeni",
	"Câmpia Turzii",
	"Câmpina",
	"Câmpulung",
	"Câmpulung Moldovenesc",
	"Caracal",
	"Caransebeș",
	"Carei",
	"Cărbunești",
	"Cavnic",
	"Cehu Silvaniei",
	"Cernavodă",
	"Cernica",
	"Chitila",
	"Chișineu-Criș",
	"Ciurea",
	"Cluj-Napoca",
	"Codlea",
	"Comănești",
	"Constanța",
	"Copșa Mică",
	"Corabia",
	"Corbeanca",
	"Costești",
	"Costinești",
	"Covasna",
	"Craiova",
	"Cristuru Secuiesc",
	"Curtea de Argeș",
	"Curtici",
	"Dăbuleni",
	"Darabani",
	"Dărmănești",
	"Dej",
	"Deta",
	"Deva",
	"Domnești",
	"Dorohoi",
	"Drobeta-Turnu Severin",
	"Dumbrăvița",
	"Dumbrăveni",
	"Eforie",
	"Eforie Nord",
	"Eforie Sud",
	"Făgăraș",
	"Făget",
	"Fălticeni",
	"Făurei",
	"Feleacu",
	"Fetești",
	"Filiași",
	"Florești",
	"Focșani",
	"Fundulea",
	"Galați",
	"Găești",
	"Gătaia",
	"Geoagiu",
	"Gherla",
	"Gheorgheni",
	"Ghimbav",
	"Ghiroda",
	"Gilău",
	"Giurgiu",
	"Glina",
	"Giroc",
	"Gura Humorului",
	"Hațeg",
	"Horezu",
	"Huedin",
	"Hunedoara",
	"Huși",
	"Iași",
	"Ineu",
	"Însurăței",
	"Întorsura Buzăului",
	"Isaccea",
	"Jibou",
	"Jimbolia",
	"Jilava",
	"Jucu",
	"Kolozsvar",
	"Lehliu-Gară",
	"Luduș",
	"Lugoj",
	"Lupeni",
	"Măgurele",
	"Mamaia",
	"Mangalia",
	"Marghita",
	"Mediaș",
	"Medgidia",
	"Miercurea Ciuc",
	"Miercurea Nirajului",
	"Mihăilești",
	"Miroslava",
	"Mioveni",
	"Mizil",
	"Moinești",
	"Mogoșoaia",
	"Moșnița Nouă",
	"Moldova Nouă",
	"Motru",
	"Murgeni",
	"Murfatlar",
	"Nădlac",
	"Năsăud",
	"Năvodari",
	"Negrești",
	"Negrești-Oaș",
	"Nehoiu",
	"Neptun",
	"Nucet",
	"Ocna Mureș",
	"Ocna Sibiului",
	"Odobești",
	"Odorheiu Secuiesc",
	"Olimp",
	"Oltenița",
	"Onești",
	"Oradea",
	"Orăștie",
	"Oravița",
	"Orșova",
	"Otopeni",
	"Pașcani",
	"Pătârlagele",
	"Pâncota",
	"Peris",
	"Piatra Neamț",
	"Piatra-Olt",
	"Pișchia",
	"Pitești",
	"Plopeni",
	"Podu Iloaiei",
	"Popeci-Leordeni",
	"Popricani",
	"Predeal",
	"Pucioasa",
	"Răcari",
	"Rădăuți",
	"Râmnicu Sărat",
	"Râmnicu Vâlcea",
	"Rășinari",
	"Recaș",
	"Reghin",
	"Remetea",
	"Remetea Mare",
	"Reșița",
	"Rediu",
	"Roman",
	"Roșiorii de Vede",
	"Rovinari",
	"Rupea",
	"Săcele",
	"Săcueni",
	"Salonta",
	"Sângeorgiu de Pădure",
	"Sânnicolau Mare",
	"Sărmașu",
	"Satu Mare",
	"Săveni",
	"Scornicești",
	"Sebeș",
	"Sebiș",
	"Segarcea",
	"Sfântu Gheorghe",
	"Sibiu",
	"Sighetu Marmației",
	"Sighișoara",
	"Simeria",
	"Șimleu Silvaniei",
	"Ștefănești",
	"Sinaia",
	"Slănic",
	"Slănic Moldova",
	"Slatina",
	"Slobozia",
	"Snagov",
	"Solca",
	"Sovata",
	"Spătaru",
	"Strehaia",
	"Ștefanestii de Jos",
	"Suceava",
	"Sulina",
	"Tălmaciu",
	"Tășnad",
	"Târgu Cărbunești",
	"Târgu Frumos",
	"Târgu Jiu",
	"Târgu Lăpuș",
	"Târgu Mureș",
	"Târgu Neamț",
	"Târgu Ocna",
	"Târgu Secuiesc",
	"Târnăveni",
	"Târgoviște",
	"Tecuci",
	"Techirghiol",
	"Teiuș",
	"Timișoara",
	"Tismana",
	"Titu",
	"Tomești",
	"Toplița",
	"Tulcea",
	"Tunari",
	"Turda",
	"Turnu Măgurele",
	"Turnu Roșu",
	"Țăndărei",
	"Țicleni",
	"Țintea",
	"Țureni",
	"Uricani",
	"Urlați",
	"Urziceni",
	"Valea Lupului",
	"Valea lui Mihai",
	"Vaslui",
	"Vălenii de Munte",
	"Vatra Dornei",
	"Victoria",
	"Videle",
	"Vicovu de Sus",
	"Viișoara",
	"Vulcan",
	"Vânju Mare",
	"Zalău",
	"Zărnești",
	"Zimnicea",
	"Zlatna",
];

// Funcție pentru a crea profilul manual dacă nu există
const ensureProfileExists = async (user: any, userData?: any) => {
	try {
		console.log("🔍 Checking if profile exists for user:", user.email);

		// Verificăm dacă profilul există deja
		const { data: existingProfile, error: checkError } = await supabase
			.from("profiles")
			.select("*")
			.eq("user_id", user.id)
			.single();

		if (existingProfile && !checkError) {
			console.log("✅ Profile already exists for user:", user.email);
			return existingProfile;
		}

		console.log("❌ Profile not found, creating new profile for:", user.email);

		// Dacă nu există, îl creăm
		const profileData = {
			user_id: user.id,
			name:
				userData?.name ||
				user.user_metadata?.name ||
				user.email?.split("@")[0] ||
				"Utilizator",
			email: user.email,
			phone: userData?.phone || user.user_metadata?.phone || "",
			location: userData?.location || user.user_metadata?.location || "",
			seller_type:
				userData?.sellerType || user.user_metadata?.sellerType || "individual",
			verified: false,
			is_admin: user.email === "admin@nexar.ro",
		};

		console.log("📝 Creating profile with data:", profileData);

		const { data: newProfile, error: createError } = await supabase
			.from("profiles")
			.insert([profileData])
			.select()
			.single();

		if (createError) {
			console.error("❌ Error creating profile:", createError);
			throw createError;
		}

		console.log("✅ Profile created successfully:", newProfile);
		return newProfile;
	} catch (err) {
		console.error("💥 Error in ensureProfileExists:", err);
		throw err;
	}
};

// Funcții pentru autentificare
export const auth = {
	signUp: async (email: string, password: string, userData: any) => {
		try {
			console.log("🚀 Starting signup process for:", email);

			const { data, error } = await supabase.auth.signUp({
				email,
				password,
				options: {
					data: userData,
					emailRedirectTo: `${window.location.origin}/auth/confirm`,
				},
			});

			if (error) {
				console.error("❌ Signup error:", error);
				return { data, error };
			}

			if (data.user) {
				console.log("👤 User created, ensuring profile exists...");
				try {
					await ensureProfileExists(data.user, userData);
				} catch (profileError) {
					console.error(
						"⚠️ Profile creation failed during signup:",
						profileError,
					);
					// Nu returnăm eroare aici pentru că utilizatorul a fost creat cu succes
				}
			}

			return { data, error };
		} catch (err) {
			console.error("💥 SignUp error:", err);
			return { data: null, error: err };
		}
	},

	signIn: async (email: string, password: string) => {
		try {
			console.log("🔐 Starting signin process for:", email);

			// Curățăm orice sesiune existentă înainte de a încerca să ne conectăm
			await supabase.auth.signOut();

			const { data, error } = await supabase.auth.signInWithPassword({
				email,
				password,
			});

			if (error) {
				console.error("❌ Signin error:", error);
				return { data, error };
			}

			if (data.user) {
				console.log("✅ User signed in successfully:", data.user.email);

				try {
					// Asigurăm că profilul există
					const profile = await ensureProfileExists(data.user);

					if (profile) {
						// Salvăm datele utilizatorului în localStorage pentru acces rapid
						const userData = {
							id: data.user.id,
							name: profile.name,
							email: profile.email,
							sellerType: profile.seller_type,
							isAdmin: profile.is_admin || data.user.email === "admin@nexar.ro",
							isLoggedIn: true,
						};

						localStorage.setItem("user", JSON.stringify(userData));
						console.log("💾 User data saved to localStorage:", userData);
					}
				} catch (profileError) {
					console.error(
						"⚠️ Profile handling failed during signin:",
						profileError,
					);
					// Salvăm măcar datele de bază
					const userData = {
						id: data.user.id,
						name: data.user.email?.split("@")[0] || "Utilizator",
						email: data.user.email,
						sellerType: "individual",
						isAdmin: data.user.email === "admin@nexar.ro",
						isLoggedIn: true,
					};
					localStorage.setItem("user", JSON.stringify(userData));
				}
			}

			return { data, error };
		} catch (err) {
			console.error("💥 SignIn error:", err);
			return { data: null, error: err };
		}
	},

	signOut: async () => {
		console.log("👋 Signing out user...");
		localStorage.removeItem("user");

		try {
			const { error } = await supabase.auth.signOut();

			// Forțăm curățarea completă a sesiunii
			if (error) {
				console.error("❌ Error during signOut:", error);
				// Chiar dacă avem eroare, curățăm local storage-ul
				localStorage.clear();
				sessionStorage.clear();
			}

			// Reîncărcăm pagina pentru a curăța complet starea
			setTimeout(() => {
				window.location.reload();
			}, 100);

			return { error };
		} catch (err) {
			console.error("💥 Error in signOut:", err);
			// Curățăm oricum storage-ul local
			localStorage.clear();
			sessionStorage.clear();
			return { error: err };
		}
	},

	getCurrentUser: async () => {
		try {
			const {
				data: { user },
				error,
			} = await supabase.auth.getUser();

			if (error) {
				console.error("❌ Error getting current user:", error);
				// Dacă avem eroare de refresh token, curățăm sesiunea
				if (
					error.message.includes("refresh") ||
					error.message.includes("token")
				) {
					localStorage.removeItem("user");
					sessionStorage.clear();
				}
				return null;
			}

			return user;
		} catch (err) {
			console.error("💥 Error in getCurrentUser:", err);
			return null;
		}
	},

	resetPassword: async (email: string) => {
		console.log("🔑 Sending password reset email to:", email);

		try {
			const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
				redirectTo: `${window.location.origin}/auth/reset-password`,
			});

			if (error) {
				console.error("❌ Error sending password reset email:", error);
				return { data: null, error };
			}

			console.log("✅ Password reset email sent successfully");
			return { data, error: null };
		} catch (err) {
			console.error("💥 Error sending password reset email:", err);
			return { data: null, error: err };
		}
	},

	updatePassword: async (newPassword: string) => {
		try {
			console.log("🔐 Updating password...");

			const { data, error } = await supabase.auth.updateUser({
				password: newPassword,
			});

			if (error) {
				console.error("❌ Error updating password:", error);
				return { data: null, error };
			}

			console.log("✅ Password updated successfully");
			return { data, error: null };
		} catch (err) {
			console.error("💥 Error updating password:", err);
			return { data: null, error: err };
		}
	},

	// Verifică dacă un token de confirmare email este valid
	verifyEmailToken: async (token: string) => {
		try {
			console.log("🔍 Verifying email confirmation token");

			// Supabase gestionează automat token-ul din URL
			const { data, error } = await supabase.auth.getSession();

			if (error) {
				console.error("❌ Error verifying email token:", error);
				return { success: false, error };
			}

			if (data?.session) {
				console.log("✅ Email confirmed successfully");
				return { success: true, user: data.session.user };
			} else {
				console.error("❌ No session found after email confirmation");
				return { success: false, error: new Error("No session found") };
			}
		} catch (err) {
			console.error("💥 Error in verifyEmailToken:", err);
			return { success: false, error: err };
		}
	},
};

// Funcții pentru anunțuri
export const listings = {
	getAll: async (filters?: any) => {
		try {
			console.log("🔍 Fetching all listings from Supabase...");

			let query = supabase
				.from("listings")
				.select("*")
				.eq("status", "active")
				.order("created_at", { ascending: false });

			if (filters) {
				if (filters.category)
					query = query.eq("category", filters.category.toLowerCase());
				if (filters.brand) query = query.eq("brand", filters.brand);
				if (filters.priceMin) query = query.gte("price", filters.priceMin);
				if (filters.priceMax) query = query.lte("price", filters.priceMax);
				if (filters.yearMin) query = query.gte("year", filters.yearMin);
				if (filters.yearMax) query = query.lte("year", filters.yearMax);
				if (filters.location)
					query = query.ilike("location", `%${filters.location}%`);
				if (filters.sellerType)
					query = query.eq("seller_type", filters.sellerType);
				if (filters.condition) query = query.eq("condition", filters.condition);
				if (filters.fuel) query = query.eq("fuel_type", filters.fuel);
				if (filters.transmission)
					query = query.eq("transmission", filters.transmission);
				if (filters.engineMin)
					query = query.gte("engine_capacity", filters.engineMin);
				if (filters.engineMax)
					query = query.lte("engine_capacity", filters.engineMax);
				if (filters.mileageMax)
					query = query.lte("mileage", filters.mileageMax);
				if (filters.availability)
					query = query.eq("availability", filters.availability);
			}

			const { data, error } = await query;

			if (error) {
				console.error("❌ Error fetching listings:", error);
				return { data: null, error };
			}

			console.log(`✅ Successfully fetched ${data?.length || 0} listings`);
			return { data, error: null };
		} catch (err) {
			console.error("💥 Error in listings.getAll:", err);
			return { data: null, error: err };
		}
	},

	// Funcție pentru a obține anunțurile utilizatorului curent (inclusiv cele în așteptare)
	getUserListings: async (userId: string) => {
		try {
			console.log("🔍 Fetching user listings from Supabase...");

			// Obținem profilul utilizatorului pentru a avea seller_id
			const { data: profile, error: profileError } = await supabase
				.from("profiles")
				.select("id")
				.eq("user_id", userId)
				.single();

			if (profileError || !profile) {
				console.error("❌ Error fetching user profile:", profileError);
				return {
					data: null,
					error: profileError || new Error("User profile not found"),
				};
			}

			// Obținem toate anunțurile utilizatorului, inclusiv cele în așteptare
			const { data, error } = await supabase
				.from("listings")
				.select("*")
				.eq("seller_id", profile.id)
				.order("created_at", { ascending: false });

			if (error) {
				console.error("❌ Error fetching user listings:", error);
				return { data: null, error };
			}

			console.log(`✅ Successfully fetched ${data?.length || 0} user listings`);
			return { data, error: null };
		} catch (err) {
			console.error("💥 Error in listings.getUserListings:", err);
			return { data: null, error: err };
		}
	},

	// Funcție specială pentru admin să vadă toate anunțurile
	getAllForAdmin: async () => {
		try {
			console.log("🔍 Fetching ALL listings for admin...");

			const { data, error } = await supabase
				.from("listings")
				.select(
					`
          *,
          profiles!listings_seller_id_fkey (
            name,
            email,
            seller_type,
            verified
          )
        `,
				)
				.order("created_at", { ascending: false });

			if (error) {
				console.error("❌ Error fetching admin listings:", error);
				return { data: null, error };
			}

			console.log(
				`✅ Successfully fetched ${data?.length || 0} listings for admin`,
			);
			return { data, error: null };
		} catch (err) {
			console.error("💥 Error in listings.getAllForAdmin:", err);
			return { data: null, error: err };
		}
	},

	getById: async (id: string) => {
		try {
			const { data, error } = await supabase
				.from("listings")
				.select("*")
				.eq("id", id)
				.single();

			// Incrementăm numărul de vizualizări
			if (data && !error) {
				await supabase
					.from("listings")
					.update({ views_count: (data.views_count || 0) + 1 })
					.eq("id", id);
			}

			return { data, error };
		} catch (err) {
			console.error("Error fetching listing:", err);
			return { data: null, error: err };
		}
	},

	create: async (listing: Partial<Listing>, images: File[]) => {
		try {
			console.log("🚀 Starting listing creation process...");

			// 1. Obținem utilizatorul curent
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) {
				throw new Error("Utilizatorul nu este autentificat");
			}

			console.log("👤 Current user:", user.email);

			// 2. Obținem profilul utilizatorului pentru a avea seller_id corect
			const { data: profile, error: profileError } = await supabase
				.from("profiles")
				.select("id, name, seller_type")
				.eq("user_id", user.id)
				.single();

			if (profileError || !profile) {
				console.error("❌ Profile not found:", profileError);

				// FIXED: Try to create profile if it doesn't exist
				console.log("🔧 Attempting to create missing profile...");
				try {
					const newProfile = await ensureProfileExists(user);
					if (newProfile) {
						console.log(
							"✅ Profile created successfully, retrying listing creation...",
						);
						// Use the newly created profile
						const profileToUse = {
							id: newProfile.id,
							name: newProfile.name,
							seller_type: newProfile.seller_type,
						};
						return await listings.createWithProfile(
							listing,
							images,
							user,
							profileToUse,
						);
					}
				} catch (createError) {
					console.error("❌ Failed to create profile:", createError);
				}

				throw new Error(
					"Profilul utilizatorului nu a fost găsit. Te rugăm să-ți completezi profilul mai întâi.",
				);
			}

			console.log("✅ Profile found:", profile);
			return await listings.createWithProfile(listing, images, user, profile);
		} catch (error: any) {
			console.error("💥 Error in listings.create:", error);
			return { data: null, error: error };
		}
	},

	// FIXED: Separate method to handle listing creation with profile
	createWithProfile: async (
		listing: Partial<Listing>,
		images: File[],
		user: any,
		profile: any,
	) => {
		try {
			// 3. Încărcăm imaginile în storage (dacă există)
			const imageUrls: string[] = [];

			if (images && images.length > 0) {
				console.log(`📸 Uploading ${images.length} images...`);

				for (const image of images) {
					const fileExt = image.name.split(".").pop();
					const fileName = `${uuidv4()}.${fileExt}`;
					const filePath = `${profile.id}/${fileName}`;

					console.log(`📤 Uploading image: ${fileName}`);

					const { error: uploadError, data: uploadData } =
						await supabase.storage
							.from("listing-images")
							.upload(filePath, image, {
								cacheControl: "3600",
								upsert: false,
							});

					if (uploadError) {
						console.error("❌ Error uploading image:", uploadError);
						// Continuăm cu următoarea imagine în loc să oprim procesul
						continue;
					}

					console.log("✅ Image uploaded:", uploadData.path);

					// Obținem URL-ul public pentru imagine
					const {
						data: { publicUrl },
					} = supabase.storage.from("listing-images").getPublicUrl(filePath);

					console.log("🔗 Public URL:", publicUrl);
					imageUrls.push(publicUrl);
				}

				console.log(`✅ Uploaded ${imageUrls.length} images successfully`);
			}

			// 4. Pregătim datele pentru anunț cu seller_id corect
			const listingData = {
				...listing,
				id: uuidv4(),
				seller_id: profile.id, // Folosim ID-ul din profiles
				seller_name: profile.name,
				seller_type: profile.seller_type,
				images: imageUrls,
				status: "pending", // Schimbat de la 'active' la 'pending' pentru a aștepta aprobarea
				views_count: 0,
				favorites_count: 0,
				featured: false,
			};

			console.log("📝 Creating listing with data:", {
				...listingData,
				images: `${imageUrls.length} images`,
			});

			// 5. Creăm anunțul în baza de date
			const { data, error } = await supabase
				.from("listings")
				.insert([listingData])
				.select()
				.single();

			if (error) {
				console.error("❌ Error creating listing:", error);
				throw new Error(`Eroare la crearea anunțului: ${error.message}`);
			}

			console.log("✅ Listing created successfully:", data.id);
			return { data, error: null };
		} catch (err: any) {
			console.error("💥 Error in createWithProfile:", err);
			return { data: null, error: err };
		}
	},

	update: async (
		id: string,
		updates: Partial<Listing>,
		newImages?: File[],
		imagesToRemove?: string[],
	) => {
		try {
			console.log("🔄 Starting listing update process...");

			// 1. Obținem anunțul curent pentru a păstra imaginile existente
			const { data: currentListing, error: fetchError } = await supabase
				.from("listings")
				.select(
					"images, seller_id, seller_name, status, seller_type, availability",
				)
				.eq("id", id)
				.single();

			if (fetchError || !currentListing) {
				console.error("❌ Error fetching current listing:", fetchError);
				throw new Error(
					`Eroare la obținerea anunțului: ${
						fetchError?.message || "Anunțul nu a fost găsit"
					}`,
				);
			}

			// 2. Gestionăm imaginile
			let updatedImages = [...(currentListing.images || [])];

			// 2.1 Ștergem imaginile marcate pentru eliminare
			if (imagesToRemove && imagesToRemove.length > 0) {
				console.log(`🗑️ Removing ${imagesToRemove.length} images...`);

				// Filtrăm imaginile care trebuie păstrate
				updatedImages = updatedImages.filter(
					(img) => !imagesToRemove.includes(img),
				);

				// Încercăm să ștergem și din storage, dar nu blocăm procesul dacă eșuează
				for (const imageUrl of imagesToRemove) {
					try {
						// Extragem path-ul din URL
						const urlParts = imageUrl.split("/");
						const fileName = urlParts[urlParts.length - 1];
						const sellerFolder = urlParts[urlParts.length - 2];
						const filePath = `${sellerFolder}/${fileName}`;

						await supabase.storage.from("listing-images").remove([filePath]);

						console.log(`✅ Removed image from storage: ${filePath}`);
					} catch (removeError) {
						console.error("⚠️ Error removing image from storage:", removeError);
						// Continuăm cu procesul chiar dacă ștergerea din storage eșuează
					}
				}
			}

			// 2.2 Adăugăm imaginile noi
			if (newImages && newImages.length > 0) {
				console.log(`📸 Uploading ${newImages.length} new images...`);

				for (const image of newImages) {
					const fileExt = image.name.split(".").pop();
					const fileName = `${uuidv4()}.${fileExt}`;
					const filePath = `${currentListing.seller_id}/${fileName}`;

					console.log(`📤 Uploading image: ${fileName}`);

					const { error: uploadError, data: uploadData } =
						await supabase.storage
							.from("listing-images")
							.upload(filePath, image, {
								cacheControl: "3600",
								upsert: false,
							});

					if (uploadError) {
						console.error("❌ Error uploading image:", uploadError);
						// Continuăm cu următoarea imagine în loc să oprim procesul
						continue;
					}

					console.log("✅ Image uploaded:", uploadData.path);

					// Obținem URL-ul public pentru imagine
					const {
						data: { publicUrl },
					} = supabase.storage.from("listing-images").getPublicUrl(filePath);

					console.log("🔗 Public URL:", publicUrl);
					updatedImages.push(publicUrl);
				}
			}

			// 3. Actualizăm anunțul cu toate modificările
			const updateData = {
				...updates,
				images: updatedImages,
				updated_at: new Date().toISOString(),
				status: updates.status || "pending", // Setăm statusul la pending pentru a aștepta aprobarea modificărilor
			};

			console.log("📝 Updating listing with data:", {
				...updateData,
				images: `${updatedImages.length} images`,
			});

			// 4. Obținem profilul utilizatorului pentru a actualiza seller_name
			if (!updates.seller_name) {
				try {
					const {
						data: { user },
					} = await supabase.auth.getUser();
					if (user) {
						const { data: profile } = await supabase
							.from("profiles")
							.select("name")
							.eq("id", currentListing.seller_id)
							.single();

						if (profile && profile.name !== currentListing.seller_name) {
							updateData.seller_name = profile.name;
							console.log("✅ Updated seller name to:", profile.name);
						}
					}
				} catch (profileError) {
					console.error("⚠️ Error updating seller name:", profileError);
					// Continuăm procesul chiar dacă actualizarea numelui eșuează
				}
			}

			const { data, error } = await supabase
				.from("listings")
				.update(updateData)
				.eq("id", id)
				.select();

			if (error) {
				console.error("❌ Error updating listing:", error);
				throw new Error(`Eroare la actualizarea anunțului: ${error.message}`);
			}

			console.log("✅ Listing updated successfully:", id);
			return { data, error: null };
		} catch (error: any) {
			console.error("💥 Error in listings.update:", error);
			return { data: null, error: error };
		}
	},

	delete: async (id: string) => {
		try {
			// Obținem anunțul pentru a șterge imaginile
			const { data: listing } = await supabase
				.from("listings")
				.select("images")
				.eq("id", id)
				.single();

			// Ștergem imaginile din storage
			if (listing && listing.images) {
				for (const imageUrl of listing.images) {
					try {
						// Extragem path-ul din URL
						const urlParts = imageUrl.split("/");
						const fileName = urlParts[urlParts.length - 1];
						const sellerFolder = urlParts[urlParts.length - 2];
						const filePath = `${sellerFolder}/${fileName}`;

						await supabase.storage.from("listing-images").remove([filePath]);

						console.log(`✅ Removed image from storage: ${filePath}`);
					} catch (error) {
						console.error("Error removing image:", error);
						// Continuăm cu ștergerea anunțului chiar dacă ștergerea imaginilor eșuează
					}
				}
			}

			// Ștergem anunțul
			const { error } = await supabase.from("listings").delete().eq("id", id);

			return { error };
		} catch (err) {
			console.error("Error deleting listing:", err);
			return { error: err };
		}
	},
};

// Funcții pentru profiluri
export const profiles = {
	getById: async (userId: string) => {
		try {
			const { data, error } = await supabase
				.from("profiles")
				.select("*")
				.eq("user_id", userId)
				.single();

			return { data, error };
		} catch (err) {
			console.error("Error fetching profile:", err);
			return { data: null, error: err };
		}
	},

	update: async (userId: string, updates: Partial<User>) => {
		try {
			// 1. Actualizăm profilul
			const { data, error } = await supabase
				.from("profiles")
				.update(updates)
				.eq("user_id", userId)
				.select();

			if (error) {
				console.error("Error updating profile:", error);
				return { data, error };
			}

			// 2. Dacă numele s-a schimbat, actualizăm și numele vânzătorului în toate anunțurile
			if (updates.name && data && data.length > 0) {
				const profile = data[0];

				// Actualizăm numele vânzătorului în toate anunțurile
				const { error: updateListingsError } = await supabase
					.from("listings")
					.update({ seller_name: profile.name })
					.eq("seller_id", profile.id);

				if (updateListingsError) {
					console.error(
						"Error updating seller name in listings:",
						updateListingsError,
					);
					// Nu blocăm procesul dacă actualizarea anunțurilor eșuează
				} else {
					console.log("✅ Updated seller name in all listings");
				}
			}

			return { data, error };
		} catch (err) {
			console.error("Error updating profile:", err);
			return { data: null, error: err };
		}
	},

	uploadAvatar: async (userId: string, file: File) => {
		try {
			const fileExt = file.name.split(".").pop();
			const fileName = `${uuidv4()}.${fileExt}`;
			const filePath = `${userId}/${fileName}`;

			const { error: uploadError } = await supabase.storage
				.from("profile-images")
				.upload(filePath, file);

			if (uploadError) {
				return { error: uploadError };
			}

			// Obținem URL-ul public pentru avatar
			const {
				data: { publicUrl },
			} = supabase.storage.from("profile-images").getPublicUrl(filePath);

			// Actualizăm profilul cu noul avatar
			const { data, error } = await supabase
				.from("profiles")
				.update({ avatar_url: publicUrl })
				.eq("user_id", userId)
				.select();

			return { data, error };
		} catch (err) {
			console.error("Error uploading avatar:", err);
			return { data: null, error: err };
		}
	},
};

// Funcții pentru mesaje
export const messages = {
	send: async (
		senderId: string,
		receiverId: string,
		listingId: string,
		content: string,
		subject?: string,
	) => {
		try {
			const { data, error } = await supabase
				.from("messages")
				.insert([
					{
						sender_id: senderId,
						receiver_id: receiverId,
						listing_id: listingId,
						content,
						subject,
						id: uuidv4(),
					},
				])
				.select();

			return { data, error };
		} catch (err) {
			console.error("Error sending message:", err);
			return { data: null, error: err };
		}
	},

	getConversations: async (userId: string) => {
		try {
			const { data, error } = await supabase
				.from("messages")
				.select("*")
				.or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
				.order("created_at", { ascending: false });

			return { data, error };
		} catch (err) {
			console.error("Error fetching conversations:", err);
			return { data: null, error: err };
		}
	},

	markAsRead: async (messageId: string) => {
		try {
			const { data, error } = await supabase
				.from("messages")
				.update({ read: true })
				.eq("id", messageId)
				.select();

			return { data, error };
		} catch (err) {
			console.error("Error marking message as read:", err);
			return { data: null, error: err };
		}
	},
};

// Funcții pentru admin
export const admin = {
	// Verifică dacă utilizatorul curent este admin - VERSIUNE REPARATĂ
	isAdmin: async () => {
		try {
			console.log("🔍 Checking admin status...");

			// Verificăm dacă există un utilizator în localStorage
			const userStr = localStorage.getItem("user");
			if (userStr) {
				try {
					const user = JSON.parse(userStr);
					if (user && user.isAdmin) {
						console.log("✅ User is admin based on localStorage");
						return true;
					}
				} catch (e) {
					console.error("Error parsing user from localStorage:", e);
				}
			}

			const {
				data: { user },
			} = await supabase.auth.getUser();

			if (!user) {
				console.log("❌ No authenticated user");
				return false;
			}

			console.log("👤 Checking admin status for user:", user.email);

			// VERIFICARE SIMPLĂ: Dacă email-ul este admin@nexar.ro, este admin
			if (user.email === "admin@nexar.ro") {
				console.log("✅ User is admin based on email");

				// Actualizăm localStorage pentru a marca utilizatorul ca admin
				try {
					const userStr = localStorage.getItem("user");
					if (userStr) {
						const userData = JSON.parse(userStr);
						userData.isAdmin = true;
						localStorage.setItem("user", JSON.stringify(userData));
					}
				} catch (e) {
					console.error("Error updating localStorage:", e);
				}

				return true;
			}

			// Încercăm să verificăm în baza de date, dar cu try/catch pentru a nu bloca
			try {
				const { data: profile, error: profileError } = await supabase
					.from("profiles")
					.select("is_admin")
					.eq("user_id", user.id)
					.single();

				if (!profileError && profile) {
					console.log("✅ Profile found, is_admin:", profile.is_admin);

					// Actualizăm localStorage pentru a marca utilizatorul ca admin
					try {
						const userStr = localStorage.getItem("user");
						if (userStr) {
							const userData = JSON.parse(userStr);
							userData.isAdmin = profile.is_admin;
							localStorage.setItem("user", JSON.stringify(userData));
						}
					} catch (e) {
						console.error("Error updating localStorage:", e);
					}

					return profile.is_admin || false;
				} else {
					console.log("⚠️ Profile not found or error:", profileError);
					// Fallback la verificarea email-ului
					return user.email === "admin@nexar.ro";
				}
			} catch (profileError) {
				console.error(
					"⚠️ Error checking profile, using email fallback:",
					profileError,
				);
				// Fallback la verificarea email-ului
				return user.email === "admin@nexar.ro";
			}
		} catch (err) {
			console.error("💥 Error checking admin status:", err);
			return false;
		}
	},

	// Obține toate anunțurile pentru admin (inclusiv inactive)
	getAllListings: async () => {
		try {
			console.log("🔍 Fetching ALL listings for admin...");

			const { data, error } = await supabase
				.from("listings")
				.select(
					`
          *,
          profiles!listings_seller_id_fkey (
            name,
            email,
            seller_type,
            verified
          )
        `,
				)
				.order("created_at", { ascending: false });

			if (error) {
				console.error("❌ Error fetching admin listings:", error);
				return { data: null, error };
			}

			console.log(
				`✅ Successfully fetched ${data?.length || 0} listings for admin`,
			);
			return { data, error: null };
		} catch (err) {
			console.error("💥 Error in listings.getAllForAdmin:", err);
			return { data: null, error: err };
		}
	},

	// Actualizează statusul unui anunț
	updateListingStatus: async (listingId: string, status: string) => {
		try {
			console.log("📝 Updating listing status:", listingId, "to", status);

			const { data, error } = await supabase
				.from("listings")
				.update({ status })
				.eq("id", listingId)
				.select();

			if (error) {
				console.error("❌ Error updating listing status:", error);
				return { data: null, error };
			}

			console.log("✅ Listing status updated successfully");
			return { data, error: null };
		} catch (err) {
			console.error("💥 Error in updateListingStatus:", err);
			return { data: null, error: err };
		}
	},

	// Șterge un anunț (admin)
	deleteListing: async (listingId: string) => {
		try {
			console.log("🗑️ Deleting listing:", listingId);

			// Obținem anunțul pentru a șterge imaginile
			const { data: listing } = await supabase
				.from("listings")
				.select("images")
				.eq("id", listingId)
				.single();

			// Ștergem imaginile din storage
			if (listing && listing.images) {
				for (const imageUrl of listing.images) {
					try {
						// Extragem path-ul din URL
						const urlParts = imageUrl.split("/");
						const fileName = urlParts[urlParts.length - 1];
						const sellerFolder = urlParts[urlParts.length - 2];
						const filePath = `${sellerFolder}/${fileName}`;

						await supabase.storage.from("listing-images").remove([filePath]);

						console.log(`✅ Removed image from storage: ${filePath}`);
					} catch (error) {
						console.error("Error removing image:", error);
						// Continuăm cu ștergerea anunțului chiar dacă ștergerea imaginilor eșuează
					}
				}
			}

			// Ștergem anunțul
			const { error } = await supabase
				.from("listings")
				.delete()
				.eq("id", listingId);

			if (error) {
				console.error("❌ Error deleting listing:", error);
				return { error };
			}

			console.log("✅ Listing deleted successfully");
			return { error: null };
		} catch (err) {
			console.error("💥 Error in deleteListing:", err);
			return { error: err };
		}
	},

	// Obține toți utilizatorii
	getAllUsers: async () => {
		try {
			const { data, error } = await supabase
				.from("profiles")
				.select("*")
				.order("created_at", { ascending: false });

			return { data, error };
		} catch (err) {
			console.error("Error fetching users:", err);
			return { data: null, error: err };
		}
	},

	// Suspendă/activează un utilizator
	toggleUserStatus: async (userId: string, suspended: boolean) => {
		try {
			const { data, error } = await supabase
				.from("profiles")
				.update({ suspended })
				.eq("user_id", userId)
				.select();

			return { data, error };
		} catch (err) {
			console.error("Error toggling user status:", err);
			return { data: null, error: err };
		}
	},

	// Șterge un utilizator și toate anunțurile sale
	deleteUser: async (userId: string) => {
		try {
			// Folosim funcția RPC pentru a șterge utilizatorul și toate datele asociate
			const { data, error } = await supabase.rpc("delete_user_complete", {
				user_id_to_delete: userId,
			});

			if (error) {
				console.error("Error deleting user:", error);
				return { error };
			}

			if (!data) {
				return { error: new Error("Failed to delete user") };
			}

			console.log(
				`Successfully deleted user ${userId} and all associated data`,
			);
			return { error: null };
		} catch (err) {
			console.error("Error deleting user:", err);
			return { error: err };
		}
	},
};

// Funcție pentru a verifica dacă utilizatorul este autentificat
export const isAuthenticated = async () => {
	try {
		const {
			data: { user },
		} = await supabase.auth.getUser();
		return !!user;
	} catch (err) {
		console.error("Error checking authentication:", err);
		return false;
	}
};

// Funcție pentru a verifica dacă Supabase este configurat corect
export const checkSupabaseConnection = async () => {
	try {
		const { error } = await supabase
			.from("profiles")
			.select("count", { count: "exact", head: true });
		return !error;
	} catch (e) {
		console.error("Supabase connection error:", e);
		return false;
	}
};

// Funcție pentru testarea conexiunii complete
export const testConnection = async () => {
	try {
		console.log("🔍 Testing Supabase connection...");

		// Test 1: Conexiunea de bază
		const { data: healthCheck, error: healthError } = await supabase
			.from("profiles")
			.select("count", { count: "exact", head: true });

		if (healthError) {
			console.error("❌ Health check failed:", healthError);
			return { success: false, error: "Database connection failed" };
		}

		console.log("✅ Database connection successful");

		// Test 2: Verificăm tabelele
		const tables = ["profiles", "listings", "favorites", "messages", "reviews"];
		for (const table of tables) {
			const { error } = await supabase
				.from(table)
				.select("count", { count: "exact", head: true });

			if (error) {
				console.error(`❌ Table ${table} not found:`, error);
				return { success: false, error: `Table ${table} missing` };
			}
			console.log(`✅ Table ${table} exists`);
		}

		// Test 3: Verificăm storage buckets (fără să încercăm să le creăm)
		const { data: buckets, error: bucketsError } =
			await supabase.storage.listBuckets();

		if (bucketsError) {
			console.error("❌ Storage check failed:", bucketsError);
			return { success: false, error: "Storage not accessible" };
		}

		const requiredBuckets = ["listing-images", "profile-images"];
		const existingBuckets = buckets?.map((b) => b.name) || [];

		for (const bucket of requiredBuckets) {
			if (!existingBuckets.includes(bucket)) {
				console.warn(
					`⚠️ Bucket ${bucket} not found - please create it manually in Supabase Dashboard`,
				);
			} else {
				console.log(`✅ Bucket ${bucket} exists`);
			}
		}

		console.log(
			"🎉 Connection test completed! Check console for any missing buckets.",
		);
		return {
			success: true,
			message: "Connection test completed - check console for details",
		};
	} catch (err) {
		console.error("❌ Connection test failed:", err);
		return { success: false, error: "Unexpected error during testing" };
	}
};

// Funcție pentru a crea profilul manual pentru utilizatorul existent
export const createMissingProfile = async (userId: string, email: string) => {
	try {
		console.log("🔧 Creating missing profile for user:", email);

		const profileData = {
			user_id: userId,
			name: email.split("@")[0], // Folosim partea din email ca nume implicit
			email: email,
			phone: "",
			location: "",
			seller_type: "individual",
			verified: false,
			is_admin: email === "admin@nexar.ro",
		};

		const { data, error } = await supabase
			.from("profiles")
			.insert([profileData])
			.select()
			.single();

		if (error) {
			console.error("❌ Error creating missing profile:", error);
			throw error;
		}

		console.log("✅ Missing profile created successfully:", data);
		return { data, error: null };
	} catch (err) {
		console.error("💥 Error in createMissingProfile:", err);
		return { data: null, error: err };
	}
};

// Funcție pentru a repara utilizatorul curent
export const fixCurrentUserProfile = async () => {
	try {
		console.log("🔧 Starting profile repair process...");

		// Obținem utilizatorul curent
		const {
			data: { user: currentUser },
			error: userError,
		} = await supabase.auth.getUser();

		if (userError || !currentUser) {
			console.error("❌ No authenticated user found:", userError);
			return { success: false, error: "No authenticated user" };
		}

		console.log("👤 Found authenticated user:", currentUser.email);

		// Verificăm dacă profilul există
		const { data: existingProfile, error: profileError } = await supabase
			.from("profiles")
			.select("*")
			.eq("user_id", currentUser.id)
			.single();

		if (existingProfile && !profileError) {
			console.log("✅ Profile already exists, updating localStorage...");

			// Actualizăm localStorage cu datele corecte
			const userData = {
				id: currentUser.id,
				name: existingProfile.name,
				email: existingProfile.email,
				sellerType: existingProfile.seller_type,
				isAdmin:
					existingProfile.is_admin || currentUser.email === "admin@nexar.ro",
				isLoggedIn: true,
			};

			localStorage.setItem("user", JSON.stringify(userData));
			return {
				success: true,
				message: "Profile found and localStorage updated",
			};
		}

		// Profilul nu există, îl creăm
		console.log("❌ Profile not found, creating new profile...");

		const result = await createMissingProfile(
			currentUser.id,
			currentUser.email!,
		);

		if (result.error) {
			console.error("❌ Failed to create profile:", result.error);
			return { success: false, error: "Failed to create profile" };
		}

		// Actualizăm localStorage cu datele noi
		const userData = {
			id: currentUser.id,
			name: result.data!.name,
			email: result.data!.email,
			sellerType: result.data!.seller_type,
			isAdmin: result.data!.is_admin || currentUser.email === "admin@nexar.ro",
			isLoggedIn: true,
		};

		localStorage.setItem("user", JSON.stringify(userData));

		console.log("🎉 Profile repair completed successfully!");
		return {
			success: true,
			message: "Profile created and localStorage updated",
		};
	} catch (err) {
		console.error("💥 Error in fixCurrentUserProfile:", err);
		return { success: false, error: "Unexpected error during repair" };
	}
};
