
const supabase = require("../config/supabase");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// POST: Login admin
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email dan password wajib diisi"
            });
        }

        const { data: admin, error } = await supabase
            .from("admin")
            .select("id, nama_admin, email, password_hash, role")
            .eq("email", email)
            .maybeSingle();

        if (error) throw error;

        if (!admin) {
            return res.status(401).json({
                message: "Email atau password salah"
            });
        }

        const passwordValid = await bcrypt.compare(
            password,
            admin.password_hash
        );

        if (!passwordValid) {
            return res.status(401).json({
                message: "Email atau password salah"
            });
        }

        const token = jwt.sign(
            {
                id: admin.id,
                email: admin.email,
                role: admin.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN || "1d"
            }
        );

        res.status(200).json({
            message: "Login berhasil",
            data: {
                id: admin.id,
                nama_admin: admin.nama_admin,
                email: admin.email,
                role: admin.role
            },
            token
        });

    } catch (error) {
        console.error("Login error:", error.message);

        res.status(500).json({
            message: "Terjadi kesalahan pada server"
        });
    }
};

module.exports = { loginAdmin };
