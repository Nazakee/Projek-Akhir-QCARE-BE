
const supabase = require("../config/supabase");

const getAllFasilitas = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("fasilitas_kesehatan")
            .select("*")
            .order("id", { ascending: true });

        if (error) throw error;

        res.status(200).json({
            message: "Data fasilitas kesehatan berhasil diambil",
            data
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const getFasilitasById = async (req, res) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from("fasilitas_kesehatan")
            .select("*")
            .eq("id", id)
            .maybeSingle();

        if (error) throw error;

        if (!data) {
            return res.status(404).json({
                message: "Fasilitas kesehatan tidak ditemukan"
            });
        }

        res.status(200).json({
            message: "Data fasilitas berhasil ditemukan",
            data
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const createFasilitas = async (req, res) => {
    try {
        const {
            nama_fasilitas,
            jenis_fasilitas,
            alamat,
            no_telepon,
            email
        } = req.body;

        if (!nama_fasilitas) {
            return res.status(400).json({
                message: "Nama fasilitas wajib diisi"
            });
        }

        const { data, error } = await supabase
            .from("fasilitas_kesehatan")
            .insert([{
                nama_fasilitas,
                jenis_fasilitas,
                alamat,
                no_telepon,
                email
            }])
            .select()
            .single();

        if (error) throw error;

        res.status(201).json({
            message: "Fasilitas kesehatan berhasil ditambahkan",
            data
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const updateFasilitas = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            nama_fasilitas,
            jenis_fasilitas,
            alamat,
            no_telepon,
            email
        } = req.body;

        const { data, error } = await supabase
            .from("fasilitas_kesehatan")
            .update({
                nama_fasilitas,
                jenis_fasilitas,
                alamat,
                no_telepon,
                email
            })
            .eq("id", id)
            .select()
            .maybeSingle();

        if (error) throw error;

        if (!data) {
            return res.status(404).json({
                message: "Fasilitas kesehatan tidak ditemukan"
            });
        }

        res.status(200).json({
            message: "Fasilitas kesehatan berhasil diperbarui",
            data
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const deleteFasilitas = async (req, res) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from("fasilitas_kesehatan")
            .delete()
            .eq("id", id)
            .select()
            .maybeSingle();

        if (error) throw error;

        if (!data) {
            return res.status(404).json({
                message: "Fasilitas kesehatan tidak ditemukan"
            });
        }

        res.status(200).json({
            message: "Fasilitas kesehatan berhasil dihapus"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    getAllFasilitas,
    getFasilitasById,
    createFasilitas,
    updateFasilitas,
    deleteFasilitas
};
