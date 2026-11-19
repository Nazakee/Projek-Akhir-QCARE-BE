
const supabase = require("../config/supabase");

// GET: Mengambil semua data antrean
const getAllAntrean = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("antrean")
            .select("*")
            .order("id", { ascending: true });

        if (error) throw error;

        res.status(200).json({
            message: "Data antrean berhasil diambil",
            data
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET: Mengambil antrean berdasarkan ID
const getAntreanById = async (req, res) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from("antrean")
            .select("*")
            .eq("id", id)
            .maybeSingle();

        if (error) throw error;

        if (!data) {
            return res.status(404).json({
                message: "Data antrean tidak ditemukan"
            });
        }

        res.status(200).json({
            message: "Data antrean berhasil ditemukan",
            data
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST: Menambahkan antrean
const createAntrean = async (req, res) => {
    try {
        const {
            pasien_id,
            fasilitas_id,
            layanan_id,
            dokter_id,
            jadwal_dokter_id,
            admin_id,
            nomor_antrean,
            tanggal_kunjungan,
            status_antrean,
            tanggal_daftar
        } = req.body;

        if (!nomor_antrean) {
            return res.status(400).json({
                message: "Nomor antrean wajib diisi"
            });
        }

        const { data, error } = await supabase
            .from("antrean")
            .insert([{
                pasien_id,
                fasilitas_id,
                layanan_id,
                dokter_id,
                jadwal_dokter_id,
                admin_id,
                nomor_antrean,
                tanggal_kunjungan,
                status_antrean: status_antrean || "Menunggu",
                tanggal_daftar
            }])
            .select()
            .single();

        if (error) throw error;

        res.status(201).json({
            message: "Antrean berhasil ditambahkan",
            data
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// PUT: Memperbarui antrean
const updateAntrean = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            pasien_id,
            fasilitas_id,
            layanan_id,
            dokter_id,
            jadwal_dokter_id,
            admin_id,
            nomor_antrean,
            tanggal_kunjungan,
            status_antrean,
            tanggal_daftar
        } = req.body;

        if (!nomor_antrean) {
            return res.status(400).json({
                message: "Nomor antrean wajib diisi"
            });
        }

        const { data, error } = await supabase
            .from("antrean")
            .update({
                pasien_id,
                fasilitas_id,
                layanan_id,
                dokter_id,
                jadwal_dokter_id,
                admin_id,
                nomor_antrean,
                tanggal_kunjungan,
                status_antrean,
                tanggal_daftar
            })
            .eq("id", id)
            .select()
            .maybeSingle();

        if (error) throw error;

        if (!data) {
            return res.status(404).json({
                message: "Data antrean tidak ditemukan"
            });
        }

        res.status(200).json({
            message: "Data antrean berhasil diperbarui",
            data
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE: Menghapus antrean
const deleteAntrean = async (req, res) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from("antrean")
            .delete()
            .eq("id", id)
            .select()
            .maybeSingle();

        if (error) throw error;

        if (!data) {
            return res.status(404).json({
                message: "Data antrean tidak ditemukan"
            });
        }

        res.status(200).json({
            message: "Antrean berhasil dihapus"
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllAntrean,
    getAntreanById,
    createAntrean,
    updateAntrean,
    deleteAntrean
};
