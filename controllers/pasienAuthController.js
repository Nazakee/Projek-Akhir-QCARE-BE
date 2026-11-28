
const supabase = require("../config/supabase");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const registerPasien = async (req, res) => {
    try {
        const {
            nama_pasien,
            email,
            password,
            tanggal_lahir,
            jenis_kelamin,
            no_telepon,
            alamat,
            kategori_pasien,
            kebutuhan_khusus
        } = req.body;

        if (
            !nama_pasien ||
            !email ||
            !password ||
            !kategori_pasien
        ) {
            return res.status(400).json({
                message: "Nama, email, password, dan kategori pasien wajib diisi"
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                message: "Password minimal 8 karakter"
            });
        }

        const { data: existingPasien, error: checkError } =
            await supabase
                .from("pasien")
                .select("id")
                .ilike("email", email.trim())
                .maybeSingle();

        if (checkError) throw checkError;

        if (existingPasien) {
            return res.status(400).json({
                message: "Email sudah terdaftar"
            });
        }

        const password_hash = await bcrypt.hash(password, 10);

        const { data, error } = await supabase
            .from("pasien")
            .insert([{
                nama_pasien,
                email: email.trim().toLowerCase(),
                password_hash,
                tanggal_lahir: tanggal_lahir || null,
                jenis_kelamin: jenis_kelamin || null,
                no_telepon: no_telepon || null,
                alamat: alamat || null,
                kategori_pasien,
                kebutuhan_khusus: kebutuhan_khusus || null
            }])
            .select("id, nama_pasien, email, kategori_pasien")
            .single();

        if (error) throw error;

        return res.status(201).json({
            message: "Registrasi pasien berhasil",
            data
        });

    } catch (error) {
        console.error("Registrasi pasien error:", error.message);

        return res.status(500).json({
            message: "Terjadi kesalahan pada server"
        });
    }
};
// Login pasien
const loginPasien = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email dan password wajib diisi"
            });
        }

        const { data: pasien, error } = await supabase
            .from("pasien")
            .select("id, nama_pasien, email, password_hash")
            .ilike("email", email.trim())
            .maybeSingle();

        if (error) throw error;

        if (!pasien || !pasien.password_hash) {
            return res.status(401).json({
                message: "Email atau password salah"
            });
        }

        const passwordValid = await bcrypt.compare(
            password,
            pasien.password_hash
        );

        if (!passwordValid) {
            return res.status(401).json({
                message: "Email atau password salah"
            });
        }

        const token = jwt.sign(
            {
                id: pasien.id,
                email: pasien.email,
                role: "pasien"
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN || "1d"
            }
        );

        return res.status(200).json({
            message: "Login pasien berhasil",
            data: {
                id: pasien.id,
                nama_pasien: pasien.nama_pasien,
                email: pasien.email,
                role: "pasien"
            },
            token
        });

    } catch (error) {
        console.error("Login pasien error:", error.message);

        return res.status(500).json({
            message: "Terjadi kesalahan pada server"
        });
    }
};

// Login atau registrasi otomatis menggunakan Google
const googleLogin = async (req, res) => {
    try {
        const { idToken } = req.body;

        if (!idToken || typeof idToken !== "string") {
            return res.status(400).json({
                message: "Google ID Token wajib dikirim"
            });
        }

        if (!process.env.GOOGLE_CLIENT_ID) {
            return res.status(500).json({
                message: "Konfigurasi Google Login belum tersedia"
            });
        }

        // Verifikasi Google ID Token
        let payload;

        try {
            const ticket = await googleClient.verifyIdToken({
                idToken,
                audience: process.env.GOOGLE_CLIENT_ID
            });

            payload = ticket.getPayload();
        } catch (error) {
            return res.status(401).json({
                message: "Google ID Token tidak valid"
            });
        }

        if (
            !payload ||
            !payload.sub ||
            !payload.email ||
            payload.email_verified !== true
        ) {
            return res.status(401).json({
                message: "Akun Google tidak valid atau email belum terverifikasi"
            });
        }

        const email = payload.email.trim().toLowerCase();

        const namaPasien = (
            payload.name ||
            payload.given_name ||
            email.split("@")[0]
        ).trim().slice(0, 100);

        // Cegah akun admin menggunakan Google Login pasien
        const { data: existingAdmin, error: adminError } =
            await supabase
                .from("admin")
                .select("id")
                .ilike("email", email)
                .maybeSingle();

        if (adminError) throw adminError;

        if (existingAdmin) {
            return res.status(403).json({
                message: "Akun admin tidak dapat menggunakan Google Login pasien"
            });
        }

        // Cari pasien berdasarkan email Google
        const { data: existingPasien, error: pasienError } =
            await supabase
                .from("pasien")
                .select("id, nama_pasien, email, kategori_pasien")
                .ilike("email", email)
                .maybeSingle();

        if (pasienError) throw pasienError;

        let pasien = existingPasien;

        // Buat akun otomatis jika email belum terdaftar
        if (!pasien) {
            const { data: newPasien, error: insertError } =
                await supabase
                    .from("pasien")
                    .insert([{
                        nama_pasien: namaPasien,
                        email,
                        password_hash: null,
                        kategori_pasien: "Umum"
                    }])
                    .select("id, nama_pasien, email, kategori_pasien")
                    .single();

            if (insertError) {
                // Tangani jika email terdaftar bersamaan
                if (insertError.code === "23505") {
                    const { data: registeredPasien, error: retryError } =
                        await supabase
                            .from("pasien")
                            .select("id, nama_pasien, email, kategori_pasien")
                            .ilike("email", email)
                            .maybeSingle();

                    if (retryError) throw retryError;
                    if (!registeredPasien) throw insertError;

                    pasien = registeredPasien;
                } else {
                    throw insertError;
                }
            } else {
                pasien = newPasien;
            }
        }

        // Buat JWT dengan format yang sama seperti login biasa
        const token = jwt.sign(
            {
                id: pasien.id,
                email: pasien.email,
                role: "pasien"
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN || "1d"
            }
        );

        return res.status(200).json({
            message: existingPasien
                ? "Login Google berhasil"
                : "Registrasi dan login Google berhasil",
            data: {
                id: pasien.id,
                nama_pasien: pasien.nama_pasien,
                email: pasien.email,
                kategori_pasien: pasien.kategori_pasien,
                role: "pasien"
            },
            token
        });

    } catch (error) {
        console.error("Google Login error:", error.message);

        return res.status(500).json({
            message: "Terjadi kesalahan pada server"
        });
    }
};
module.exports = {
    registerPasien,
    loginPasien,
    googleLogin
};