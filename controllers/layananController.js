
const supabase = require("../config/supabase");

const getAllLayanan = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("layanan")
            .select("*")
            .order("id", { ascending: true });

        if (error) throw error;

        res.status(200).json({
            message: "Data layanan berhasil diambil",
            data
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const getLayananById = async (req, res) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from("layanan")
            .select("*")
            .eq("id", id)
            .maybeSingle();

        if (error) throw error;

        if (!data) {
            return res.status(404).json({
                message: "Layanan tidak ditemukan"
            });
        }

        res.status(200).json({
            message: "Data layanan berhasil ditemukan",
            data
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const createLayanan = async (req, res) => {
    try {
        const {
            fasilitas_id,
            nama_layanan,
            deskripsi,
            estimasi_durasi,
            biaya,
            aktif
        } = req.body;

        if (!fasilitas_id || !nama_layanan) {
            return res.status(400).json({
                message: "Fasilitas ID dan nama layanan wajib diisi"
            });
        }

        const { data, error } = await supabase
            .from("layanan")
            .insert([{
                fasilitas_id,
                nama_layanan,
                deskripsi,
                estimasi_durasi,
                biaya,
                aktif
            }])
            .select()
            .single();

        if (error) throw error;

        res.status(201).json({
            message: "Layanan berhasil ditambahkan",
            data
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const updateLayanan = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            fasilitas_id,
            nama_layanan,
            deskripsi,
            estimasi_durasi,
            biaya,
            aktif
        } = req.body;

        const { data, error } = await supabase
            .from("layanan")
            .update({
                fasilitas_id,
                nama_layanan,
                deskripsi,
                estimasi_durasi,
                biaya,
                aktif
            })
            .eq("id", id)
            .select()
            .maybeSingle();

        if (error) throw error;

        if (!data) {
            return res.status(404).json({
                message: "Layanan tidak ditemukan"
            });
        }

        res.status(200).json({
            message: "Layanan berhasil diperbarui",
            data
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// DELETE: Menghapus layanan
const deleteLayanan = async (req, res) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from("layanan")
            .delete()
            .eq("id", id)
            .select()
            .maybeSingle();

        if (error) throw error;

        if (!data) {
            return res.status(404).json({
                message: "Layanan tidak ditemukan"
            });
        }

        res.status(200).json({
            message: "Layanan berhasil dihapus"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    getAllLayanan,
    getLayananById,
    createLayanan,
    updateLayanan,
    deleteLayanan
};
