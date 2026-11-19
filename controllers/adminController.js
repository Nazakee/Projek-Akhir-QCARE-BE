
const supabase = require("../config/supabase");
const bcrypt = require("bcryptjs");

// GET: Mengambil semua data admin tanpa password_hash
const getAllAdmin = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("admin")
            .select("id, nama_admin, email, role, created_at")
            .order("id", { ascending: true });

        if (error) throw error;

        res.status(200).json({
            message: "Data admin berhasil diambil",
            data
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET: Mengambil admin berdasarkan ID
const getAdminById = async (req, res) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from("admin")
            .select("id, nama_admin, email, role, created_at")
            .eq("id", id)
            .maybeSingle();

        if (error) throw error;

        if (!data) {
            return res.status(404).json({
                message: "Admin tidak ditemukan"
            });
        }

        res.status(200).json({
            message: "Data admin berhasil ditemukan",
            data
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST: Menambahkan admin
const createAdmin = async (req, res) => {
    try {
        const { nama_admin, email, password, role } = req.body;

        if (!nama_admin || !email || !password) {
            return res.status(400).json({
                message: "Nama admin, email, dan password wajib diisi"
            });
        }

        const password_hash = await bcrypt.hash(password, 10);

        const { data, error } = await supabase
            .from("admin")
            .insert([{
                nama_admin,
                email,
                password_hash,
                role: role || "admin"
            }])
            .select("id, nama_admin, email, role, created_at")
            .single();

        if (error) {
            if (error.code === "23505") {
                return res.status(400).json({
                    message: "Email admin sudah terdaftar"
                });
            }
            throw error;
        }

        res.status(201).json({
            message: "Admin berhasil ditambahkan",
            data
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// PUT: Memperbarui admin
const updateAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const { nama_admin, email, password, role } = req.body;

        const updateData = {
            nama_admin,
            email,
            role
        };

        // Password hanya diubah jika dikirim
        if (password) {
            updateData.password_hash = await bcrypt.hash(password, 10);
        }

        const { data, error } = await supabase
            .from("admin")
            .update(updateData)
            .eq("id", id)
            .select("id, nama_admin, email, role, created_at")
            .maybeSingle();

        if (error) {
            if (error.code === "23505") {
                return res.status(400).json({
                    message: "Email admin sudah digunakan"
                });
            }
            throw error;
        }

        if (!data) {
            return res.status(404).json({
                message: "Admin tidak ditemukan"
            });
        }

        res.status(200).json({
            message: "Data admin berhasil diperbarui",
            data
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE: Menghapus admin
const deleteAdmin = async (req, res) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from("admin")
            .delete()
            .eq("id", id)
            .select("id")
            .maybeSingle();

        if (error) throw error;

        if (!data) {
            return res.status(404).json({
                message: "Admin tidak ditemukan"
            });
        }

        res.status(200).json({
            message: "Admin berhasil dihapus"
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllAdmin,
    getAdminById,
    createAdmin,
    updateAdmin,
    deleteAdmin
};
