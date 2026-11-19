
const supabase = require("../config/supabase");

// GET semua riwayat antrean
const getAllRiwayatAntrean = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("riwayat_antrean")
            .select("*")
            .order("id", { ascending: false });

        if (error) throw error;

        res.status(200).json({
            message: "Data riwayat antrean berhasil diambil",
            data
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET riwayat berdasarkan ID
const getRiwayatAntreanById = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("riwayat_antrean")
            .select("*")
            .eq("id", req.params.id)
            .maybeSingle();

        if (error) throw error;

        if (!data) {
            return res.status(404).json({
                message: "Riwayat antrean tidak ditemukan"
            });
        }

        res.status(200).json({
            message: "Data riwayat antrean berhasil ditemukan",
            data
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST tambah riwayat antrean
const createRiwayatAntrean = async (req, res) => {
    try {
        const {
            antrean_id,
            admin_id,
            status_antrean,
            keterangan
        } = req.body;

        if (!antrean_id || !status_antrean) {
            return res.status(400).json({
                message: "Antrean ID dan status antrean wajib diisi"
            });
        }

        const { data, error } = await supabase
            .from("riwayat_antrean")
            .insert([{
                antrean_id,
                admin_id: admin_id || null,
                status_antrean,
                keterangan
            }])
            .select()
            .single();

        if (error) throw error;

        res.status(201).json({
            message: "Riwayat antrean berhasil ditambahkan",
            data
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// PUT update riwayat antrean
const updateRiwayatAntrean = async (req, res) => {
    try {
        const {
            antrean_id,
            admin_id,
            status_antrean,
            keterangan
        } = req.body;

        if (!antrean_id || !status_antrean) {
            return res.status(400).json({
                message: "Antrean ID dan status antrean wajib diisi"
            });
        }

        const { data, error } = await supabase
            .from("riwayat_antrean")
            .update({
                antrean_id,
                admin_id: admin_id || null,
                status_antrean,
                keterangan
            })
            .eq("id", req.params.id)
            .select()
            .maybeSingle();

        if (error) throw error;

        if (!data) {
            return res.status(404).json({
                message: "Riwayat antrean tidak ditemukan"
            });
        }

        res.status(200).json({
            message: "Riwayat antrean berhasil diperbarui",
            data
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// DELETE riwayat antrean
const deleteRiwayatAntrean = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("riwayat_antrean")
            .delete()
            .eq("id", req.params.id)
            .select()
            .maybeSingle();

        if (error) throw error;

        if (!data) {
            return res.status(404).json({
                message: "Riwayat antrean tidak ditemukan"
            });
        }

        res.status(200).json({
            message: "Riwayat antrean berhasil dihapus"
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllRiwayatAntrean,
    getRiwayatAntreanById,
    createRiwayatAntrean,
    updateRiwayatAntrean,
    deleteRiwayatAntrean
};
