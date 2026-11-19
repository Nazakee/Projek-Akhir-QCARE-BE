
const supabase = require("../config/supabase");

// GET: Mengambil semua jadwal dokter
const getAllJadwalDokter = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("jadwal_dokter")
            .select("*")
            .order("id", { ascending: true });

        if (error) throw error;

        res.status(200).json({
            message: "Data jadwal dokter berhasil diambil",
            data
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET: Mengambil jadwal berdasarkan ID
const getJadwalDokterById = async (req, res) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from("jadwal_dokter")
            .select("*")
            .eq("id", id)
            .maybeSingle();

        if (error) throw error;

        if (!data) {
            return res.status(404).json({
                message: "Jadwal dokter tidak ditemukan"
            });
        }

        res.status(200).json({
            message: "Jadwal dokter berhasil ditemukan",
            data
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST: Menambahkan jadwal dokter
const createJadwalDokter = async (req, res) => {
    try {
        const {
            dokter_id,
            layanan_id,
            hari,
            jam_mulai,
            jam_selesai,
            kuota,
            aktif
        } = req.body;

        if (
            !dokter_id ||
            !layanan_id ||
            !hari ||
            !jam_mulai ||
            !jam_selesai
        ) {
            return res.status(400).json({
                message: "Dokter ID, layanan ID, hari, jam mulai, dan jam selesai wajib diisi"
            });
        }

        const { data, error } = await supabase
            .from("jadwal_dokter")
            .insert([{
                dokter_id,
                layanan_id,
                hari,
                jam_mulai,
                jam_selesai,
                kuota,
                aktif
            }])
            .select()
            .single();

        if (error) throw error;

        res.status(201).json({
            message: "Jadwal dokter berhasil ditambahkan",
            data
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// PUT: Memperbarui jadwal dokter
const updateJadwalDokter = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            dokter_id,
            layanan_id,
            hari,
            jam_mulai,
            jam_selesai,
            kuota,
            aktif
        } = req.body;

        const { data, error } = await supabase
            .from("jadwal_dokter")
            .update({
                dokter_id,
                layanan_id,
                hari,
                jam_mulai,
                jam_selesai,
                kuota,
                aktif
            })
            .eq("id", id)
            .select()
            .maybeSingle();

        if (error) throw error;

        if (!data) {
            return res.status(404).json({
                message: "Jadwal dokter tidak ditemukan"
            });
        }

        res.status(200).json({
            message: "Jadwal dokter berhasil diperbarui",
            data
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE: Menghapus jadwal dokter
const deleteJadwalDokter = async (req, res) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from("jadwal_dokter")
            .delete()
            .eq("id", id)
            .select()
            .maybeSingle();

        if (error) throw error;

        if (!data) {
            return res.status(404).json({
                message: "Jadwal dokter tidak ditemukan"
            });
        }

        res.status(200).json({
            message: "Jadwal dokter berhasil dihapus"
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllJadwalDokter,
    getJadwalDokterById,
    createJadwalDokter,
    updateJadwalDokter,
    deleteJadwalDokter
};
