
const supabase = require("../config/supabase");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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

        if (!pasien) {
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

module.exports = {
    registerPasien,
    loginPasien
};