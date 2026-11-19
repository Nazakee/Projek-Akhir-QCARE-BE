
const supabase = require("../config/supabase");

const getAllDokter = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("dokter")
            .select("*")
            .order("id", { ascending: true });

        if (error) throw error;

        res.status(200).json({
            message: "Data dokter berhasil diambil",
            data
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const getDokterById = async (req, res) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from("dokter")
            .select("*")
            .eq("id", id)
            .maybeSingle();

        if (error) throw error;

        if (!data) {
            return res.status(404).json({
                message: "Dokter tidak ditemukan"
            });
        }

        res.status(200).json({
            message: "Data dokter berhasil ditemukan",
            data
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const createDokter = async (req, res) => {
    try {
        const {
            fasilitas_id,
            nama_dokter,
            spesialisasi,
            no_telepon,
            aktif
        } = req.body;

        if (!fasilitas_id || !nama_dokter) {
            return res.status(400).json({
                message: "Fasilitas ID dan nama dokter wajib diisi"
            });
        }

        const { data, error } = await supabase
            .from("dokter")
            .insert([{
                fasilitas_id,
                nama_dokter,
                spesialisasi,
                no_telepon,
                aktif
            }])
            .select()
            .single();

        if (error) throw error;

        res.status(201).json({
            message: "Dokter berhasil ditambahkan",
            data
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const updateDokter = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            fasilitas_id,
            nama_dokter,
            spesialisasi,
            no_telepon,
            aktif
        } = req.body;

        const { data, error } = await supabase
            .from("dokter")
            .update({
                fasilitas_id,
                nama_dokter,
                spesialisasi,
                no_telepon,
                aktif
            })
            .eq("id", id)
            .select()
            .maybeSingle();

        if (error) throw error;

        if (!data) {
            return res.status(404).json({
                message: "Dokter tidak ditemukan"
            });
        }

        res.status(200).json({
            message: "Data dokter berhasil diperbarui",
            data
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const deleteDokter = async (req, res) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from("dokter")
            .delete()
            .eq("id", id)
            .select()
            .maybeSingle();

        if (error) throw error;

        if (!data) {
            return res.status(404).json({
                message: "Dokter tidak ditemukan"
            });
        }

        res.status(200).json({
            message: "Dokter berhasil dihapus"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    getAllDokter,
    getDokterById,
    createDokter,
    updateDokter,
    deleteDokter
};
