
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

        // Pasien hanya boleh melihat antrean miliknya sendiri
        if (
            req.admin.role === "pasien" &&
            String(data.pasien_id) !== String(req.admin.id)
        ) {
            return res.status(403).json({
                message: "Akses ditolak. Kamu hanya dapat melihat antrean milik sendiri."
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
            tanggal_kunjungan,
            kategori_pasien
        } = req.body;

        // Validasi input wajib
        if (
            !fasilitas_id ||
            !layanan_id ||
            !dokter_id ||
            !jadwal_dokter_id ||
            !tanggal_kunjungan
        ) {
            return res.status(400).json({
                message: "Fasilitas, layanan, dokter, jadwal dokter, dan tanggal kunjungan wajib diisi"
            });
        }

        // Menentukan pasien berdasarkan role
        const finalPasienId =
            req.admin.role === "pasien"
                ? req.admin.id
                : pasien_id;

        if (!finalPasienId) {
            return res.status(400).json({
                message: "Pasien ID wajib diisi"
            });
        }

        // 1. Memeriksa layanan
        const { data: layanan, error: layananError } = await supabase
            .from("layanan")
            .select("id, fasilitas_id")
            .eq("id", layanan_id)
            .maybeSingle();

        if (layananError) throw layananError;

        if (!layanan) {
            return res.status(400).json({
                message: "Layanan tidak ditemukan"
            });
        }

        if (String(layanan.fasilitas_id) !== String(fasilitas_id)) {
            return res.status(400).json({
                message: "Layanan tidak sesuai dengan fasilitas kesehatan"
            });
        }

        // 2. Memeriksa dokter
        const { data: dokter, error: dokterError } = await supabase
            .from("dokter")
            .select("id, fasilitas_id")
            .eq("id", dokter_id)
            .maybeSingle();

        if (dokterError) throw dokterError;

        if (!dokter) {
            return res.status(400).json({
                message: "Dokter tidak ditemukan"
            });
        }

        if (String(dokter.fasilitas_id) !== String(fasilitas_id)) {
            return res.status(400).json({
                message: "Dokter tidak bertugas di fasilitas yang dipilih"
            });
        }

        // 3. Memeriksa jadwal dokter
        const { data: jadwal, error: jadwalError } = await supabase
            .from("jadwal_dokter")
            .select("id, dokter_id, layanan_id, hari, jam_mulai, jam_selesai, kuota, aktif")
            .eq("id", jadwal_dokter_id)
            .maybeSingle();

        if (jadwalError) throw jadwalError;

        if (!jadwal) {
            return res.status(400).json({
                message: "Jadwal dokter tidak ditemukan"
            });
        }

        if (
            String(jadwal.dokter_id) !== String(dokter_id) ||
            String(jadwal.layanan_id) !== String(layanan_id)
        ) {
            return res.status(400).json({
                message: "Jadwal dokter tidak sesuai dengan dokter atau layanan yang dipilih"
            });
        }

        // Memeriksa status aktif jadwal
        if (!jadwal.aktif) {
            return res.status(400).json({
                message: "Jadwal dokter sedang tidak aktif"
            });
        }

        // Memeriksa format tanggal
        const tanggalObj = new Date(`${tanggal_kunjungan}T00:00:00Z`);

        if (
            !/^\d{4}-\d{2}-\d{2}$/.test(tanggal_kunjungan) ||
            isNaN(tanggalObj.getTime()) ||
            tanggalObj.toISOString().slice(0, 10) !== tanggal_kunjungan
        ) {
            return res.status(400).json({
                message: "Format tanggal kunjungan tidak valid"
            });
        }

        // Memeriksa tanggal kunjungan
        const tanggalHariIni = new Intl.DateTimeFormat("en-CA", {
            timeZone: "Asia/Jakarta",
            year: "numeric",
            month: "2-digit",
            day: "2-digit"
        }).format(new Date());

        if (tanggal_kunjungan <= tanggalHariIni) {
            return res.status(400).json({
                message: "Tanggal kunjungan harus setelah hari ini"
            });
        }

        // Memeriksa kesesuaian hari praktik
        const namaHari = [
            "Minggu",
            "Senin",
            "Selasa",
            "Rabu",
            "Kamis",
            "Jumat",
            "Sabtu"
        ];

        const hariKunjungan = namaHari[tanggalObj.getUTCDay()];

        if (hariKunjungan !== jadwal.hari) {
            return res.status(400).json({
                message: `Jadwal dokter hanya tersedia pada hari ${jadwal.hari}`
            });
        }

        // Memeriksa kuota antrean
        const { count, error: countError } = await supabase
            .from("antrean")
            .select("id", { count: "exact", head: true })
            .eq("jadwal_dokter_id", jadwal_dokter_id)
            .eq("tanggal_kunjungan", tanggal_kunjungan);

        if (countError) throw countError;

        if (count >= jadwal.kuota) {
            return res.status(400).json({
                message: "Kuota antrean pada jadwal ini sudah penuh"
            });
        }


       
        // 4. Membuat antrean secara atomik melalui database
        const { data, error } = await supabase
            .rpc("buat_antrean_atomik", {
                p_pasien_id: finalPasienId,
                p_fasilitas_id: fasilitas_id,
                p_layanan_id: layanan_id,
                p_dokter_id: dokter_id,
                p_jadwal_dokter_id: jadwal_dokter_id,
                p_admin_id: req.admin.role === "admin"
                    ? req.admin.id
                    : null,
                p_tanggal_kunjungan: tanggal_kunjungan,
                p_kategori_pasien: kategori_pasien ?? null
            });

        if (error) throw error;

        res.status(201).json({
            message: "Antrean berhasil ditambahkan",
            data
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};




// PUT: Memperbarui antrean

const updateAntrean = async (req, res) => {
    try {
        const { id } = req.params;
        const { status_antrean } = req.body;

        if (!status_antrean) {
            return res.status(400).json({
                message: "Status antrean wajib diisi"
            });
        }

        // Perubahan status dan riwayat dilakukan secara atomik
        const { data, error } = await supabase.rpc(
            "update_status_antrean_atomik",
            {
                p_antrean_id: Number(id),
                p_status_antrean: status_antrean,
                p_admin_id: req.admin.id,
                p_role: req.admin.role
            }
        );

        if (error) {
            const pesan = error.message;

            if (pesan.includes("Data antrean tidak ditemukan")) {
                return res.status(404).json({
                    message: pesan
                });
            }

            if (pesan.includes("Kamu tidak memiliki akses")) {
                return res.status(403).json({
                    message: pesan
                });
            }

            if (pesan.includes("Pasien hanya dapat membatalkan")) {
                return res.status(403).json({
                    message: pesan
                });
            }

            if (
                pesan.includes("tidak dapat dibatalkan") ||
                pesan.includes("Role tidak valid")
            ) {
                return res.status(409).json({
                    message: pesan
                });
            }

            if (pesan.includes("Status antrean tidak valid")) {
                return res.status(400).json({
                    message: pesan
                });
            }

            throw error;
        }

        res.status(200).json({
            message: req.admin.role === "pasien"
                ? "Antrean berhasil dibatalkan"
                : "Status antrean berhasil diperbarui",
            data
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
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
            .select("id")
            .maybeSingle();

        if (error) {
            if (error.code === "23503") {
                return res.status(409).json({
                    message: "Antrean tidak dapat dihapus karena masih memiliki data riwayat"
                });
            }

            throw error;
        }

        if (!data) {
            return res.status(404).json({
                message: "Data antrean tidak ditemukan"
            });
        }

        res.status(200).json({
            message: "Antrean berhasil dihapus",
            id: data.id
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


module.exports = {
    getAllAntrean,
    getAntreanById,
    createAntrean,
    updateAntrean,
    deleteAntrean
};
