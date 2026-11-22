
const supabase = require("../config/supabase");

const getAllPasien = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("pasien")
            .select("*")
            .order("id", { ascending: true });

        if (error) throw error;

        res.status(200).json({
            message: "Data pasien berhasil diambil",
            data
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


const getPasienById = async (req, res) => {
    try {
        const { id } = req.params;

        if (
            req.admin.role === "pasien" &&
            String(req.admin.id) !== String(id)
        ) {
            return res.status(403).json({
                message: "Akses ditolak. Kamu hanya dapat melihat data milik sendiri."
            });
        }

        const { data, error } = await supabase
            .from("pasien")
            .select(`
                id,
                nama_pasien,
                email,
                tanggal_lahir,
                jenis_kelamin,
                no_telepon,
                alamat,
                kategori_pasien,
                kebutuhan_khusus
            `)
            .eq("id", id)
            .maybeSingle();

        if (error) throw error;

        if (!data) {
            return res.status(404).json({
                message: "Pasien tidak ditemukan"
            });
        }

        res.status(200).json({
            message: "Data pasien berhasil ditemukan",
            data
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


const createPasien = async (req, res) => {
    try {
        const {
            nama_pasien,
            tanggal_lahir,
            jenis_kelamin,
            no_telepon,
            alamat,
            kategori_pasien,
            kebutuhan_khusus
        } = req.body;

        if (!nama_pasien || !kategori_pasien) {
            return res.status(400).json({
                message: "Nama pasien dan kategori pasien wajib diisi"
            });
        }

        const { data, error } = await supabase
            .from("pasien")
            .insert([{
                nama_pasien,
                tanggal_lahir,
                jenis_kelamin,
                no_telepon,
                alamat,
                kategori_pasien,
                kebutuhan_khusus
            }])
            .select()
            .single();

        if (error) throw error;

        res.status(201).json({
            message: "Pasien berhasil ditambahkan",
            data
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


const updatePasien = async (req, res) => {
    try {
        const { id } = req.params;

        // Pasien hanya boleh mengubah profil sendiri
        if (
            req.admin.role === "pasien" &&
            String(req.admin.id) !== String(id)
        ) {
            return res.status(403).json({
                message: "Akses ditolak. Kamu hanya dapat mengubah data milik sendiri."
            });
        }

        const {
            nama_pasien,
            tanggal_lahir,
            jenis_kelamin,
            no_telepon,
            alamat,
            kategori_pasien,
            kebutuhan_khusus
        } = req.body;

        const updateData = {
            nama_pasien,
            tanggal_lahir,
            jenis_kelamin,
            no_telepon,
            alamat,
            kategori_pasien,
            kebutuhan_khusus
        };

        // Hilangkan field yang tidak dikirim
        Object.keys(updateData).forEach((key) => {
            if (updateData[key] === undefined) {
                delete updateData[key];
            }
        });

        const { data, error } = await supabase
            .from("pasien")
            .update(updateData)
            .eq("id", id)
            .select(`
                id,
                nama_pasien,
                email,
                tanggal_lahir,
                jenis_kelamin,
                no_telepon,
                alamat,
                kategori_pasien,
                kebutuhan_khusus
            `)
            .maybeSingle();

        if (error) throw error;

        if (!data) {
            return res.status(404).json({
                message: "Pasien tidak ditemukan"
            });
        }

        res.status(200).json({
            message: "Data pasien berhasil diperbarui",
            data
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


const deletePasien = async (req, res) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from("pasien")
            .delete()
            .eq("id", id)
            .select()
            .maybeSingle();

        if (error) throw error;

        if (!data) {
            return res.status(404).json({
                message: "Pasien tidak ditemukan"
            });
        }

        res.status(200).json({
            message: "Pasien berhasil dihapus"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    getAllPasien,
    getPasienById,
    createPasien,
    updatePasien,
    deletePasien
};
