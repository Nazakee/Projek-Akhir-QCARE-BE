const supabase = require("../config/supabase");

const getAllPasien = async (req, res) => {
    try {
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
            .order("id", { ascending: true });

        if (error) throw error;

        res.status(200).json({
            message: "Data pasien berhasil diambil",
            data
        });

    } catch (error) {
            console.error("Error getAllPasien:", error);

            res.status(500).json({
                message: "Terjadi kesalahan saat mengambil data pasien"
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
            console.error("Error getPasienById:", error);

            res.status(500).json({
                message: "Terjadi kesalahan saat mengambil data pasien"
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

        if (
            !nama_pasien ||
            typeof nama_pasien !== "string" ||
            !nama_pasien.trim() ||
            !kategori_pasien ||
            typeof kategori_pasien !== "string" ||
            !kategori_pasien.trim()
        ) {
            return res.status(400).json({
                message: "Nama pasien dan kategori pasien wajib diisi"
            });
        }
        let tanggalLahir = tanggal_lahir || null;

        if (tanggalLahir !== null) {
            if (typeof tanggalLahir !== "string") {
                return res.status(400).json({
                    message: "Tanggal lahir tidak valid"
                });
            }

            const tanggal = new Date(tanggalLahir);

            if (
                Number.isNaN(tanggal.getTime()) ||
                tanggal.toISOString().slice(0, 10) !== tanggalLahir ||
                tanggalLahir > new Date().toISOString().slice(0, 10)
            ) {
                return res.status(400).json({
                    message: "Tanggal lahir tidak valid"
                });
            }
        }

        if (no_telepon) {
            const nomor = String(no_telepon).trim();

            if (!/^[0-9+\-\s]{8,20}$/.test(nomor)) {
                return res.status(400).json({
                    message: "Format nomor telepon tidak valid"
                });
            }
        }
        const daftarKategori = [
            "Umum",
            "BPJS",
            "Asuransi"
        ];

        const kategoriPasien = kategori_pasien.trim();

        if (!daftarKategori.includes(kategoriPasien)) {
            return res.status(400).json({
                message: "Kategori pasien harus Umum, BPJS, atau Asuransi"
            });
        }

        const daftarJenisKelamin = [
            "Laki-laki",
            "Perempuan"
        ];

        if (
            typeof jenis_kelamin !== "string" ||
            !daftarJenisKelamin.includes(jenis_kelamin.trim())
        ) {
            return res.status(400).json({
                message: "Jenis kelamin harus Laki-laki atau Perempuan"
            });
        }

        const { data, error } = await supabase
            .from("pasien")
            .insert([{
                nama_pasien: nama_pasien.trim(),
                tanggal_lahir: tanggalLahir,
                jenis_kelamin: jenis_kelamin.trim(),
                no_telepon: no_telepon ? String(no_telepon).trim() : null,
                alamat,
                kategori_pasien: kategoriPasien,
                kebutuhan_khusus
            }])
            .select(`
                id,
                nama_pasien,
                tanggal_lahir,
                jenis_kelamin,
                no_telepon,
                alamat,
                kategori_pasien,
                kebutuhan_khusus
            `)
            .single();

        if (error) throw error;

        res.status(201).json({
            message: "Pasien berhasil ditambahkan",
            data
        });

    } catch (error) {
            console.error("Error createPasien:", error);

            res.status(500).json({
                message: "Terjadi kesalahan saat menambahkan data pasien"
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

        if (nama_pasien !== undefined) {
            if (
                typeof nama_pasien !== "string" ||
                !nama_pasien.trim()
            ) {
                return res.status(400).json({
                    message: "Nama pasien tidak boleh kosong"
                });
            }

            updateData.nama_pasien = nama_pasien.trim();
        }

        if (tanggal_lahir !== undefined) {
            if (tanggal_lahir === null || tanggal_lahir === "") {
                updateData.tanggal_lahir = null;
            } else {
                if (typeof tanggal_lahir !== "string") {
                    return res.status(400).json({
                        message: "Tanggal lahir tidak valid"
                    });
                }

                const tanggal = new Date(tanggal_lahir);

                if (
                    Number.isNaN(tanggal.getTime()) ||
                    tanggal.toISOString().slice(0, 10) !== tanggal_lahir ||
                    tanggal_lahir > new Date().toISOString().slice(0, 10)
                ) {
                    return res.status(400).json({
                        message: "Tanggal lahir tidak valid"
                    });
                }
            }
        }

        if (no_telepon !== undefined) {
            if (no_telepon === null || no_telepon === "") {
                updateData.no_telepon = null;
            } else {
                const nomor = String(no_telepon).trim();

                if (!/^[0-9+\-\s]{8,20}$/.test(nomor)) {
                    return res.status(400).json({
                        message: "Format nomor telepon tidak valid"
                    });
                }

                updateData.no_telepon = nomor;
            }
        }

        if (kategori_pasien !== undefined) {
            const daftarKategori = [
                "Umum",
                "BPJS",
                "Asuransi"
            ];

            if (
                typeof kategori_pasien !== "string" ||
                !daftarKategori.includes(kategori_pasien.trim())
            ) {
                return res.status(400).json({
                    message: "Kategori pasien harus Umum, BPJS, atau Asuransi"
                });
            }

            updateData.kategori_pasien = kategori_pasien.trim();
        }
        if (jenis_kelamin !== undefined) {
            const daftarJenisKelamin = [
                "Laki-laki",
                "Perempuan"
            ];

            if (
                typeof jenis_kelamin !== "string" ||
                !daftarJenisKelamin.includes(jenis_kelamin.trim())
            ) {
                return res.status(400).json({
                    message: "Jenis kelamin harus Laki-laki atau Perempuan"
                });
            }

            updateData.jenis_kelamin = jenis_kelamin.trim();
        }

        // Hilangkan field yang tidak dikirim
        Object.keys(updateData).forEach((key) => {
            if (updateData[key] === undefined) {
                delete updateData[key];
            }
        });
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                message: "Tidak ada data yang diperbarui"
            });
        }

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
            console.error("Error updatePasien:", error);

            res.status(500).json({
                message: "Terjadi kesalahan saat memperbarui data pasien"
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
            .select("id")
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
            console.error("Error deletePasien:", error);

            res.status(500).json({
                message: "Terjadi kesalahan saat menghapus data pasien"
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
