
const supabase = require("../config/supabase");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

// Meminta OTP reset password
const requestPasswordReset = async (req, res) => {
    try {
        const { email, role } = req.body;

        if (!email || !role) {
            return res.status(400).json({
                message: "Email dan role wajib diisi"
            });
        }

        if (!["admin", "pasien"].includes(role)) {
            return res.status(400).json({
                message: "Role tidak valid"
            });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const table = role === "admin" ? "admin" : "pasien";

        // Periksa akun berdasarkan email
        const { data: account, error: accountError } = await supabase
            .from(table)
            .select("id")
            .ilike("email", normalizedEmail)
            .maybeSingle();

        if (accountError) throw accountError;

        // Pesan dibuat sama agar tidak membocorkan keberadaan akun
        if (!account) {
            return res.status(200).json({
                message: "Jika akun ditemukan, OTP akan diproses."
            });
        }


        const { error: updateError } = await supabase
            .from("password_reset_otps")
            .update({ used_at: new Date().toISOString() })
            .eq("email", normalizedEmail)
            .eq("role", role)
            .is("used_at", null);

        if (updateError) throw updateError;

        // Buat OTP 6 digit
        const otp = crypto.randomInt(100000, 1000000).toString();
        const otp_hash = await bcrypt.hash(otp, 10);

        const expires_at = new Date(
            Date.now() + 5 * 60 * 1000
        ).toISOString();

        const { error: insertError } = await supabase
            .from("password_reset_otps")
            .insert([{
                email: normalizedEmail,
                role,
                otp_hash,
                expires_at
            }]);

        if (insertError) throw insertError;

        // Hanya untuk simulasi lokal
        console.log(`[SIMULASI OTP] ${role} - ${normalizedEmail}: ${otp}`);

        return res.status(200).json({
            message: "Jika akun ditemukan, OTP akan diproses."
        });

    } catch (error) {
        console.error("Request OTP error:", error.message);

        return res.status(500).json({
            message: "Terjadi kesalahan pada server"
        });
    }
};


const verifyPasswordResetOTP = async (req, res) => {
    try {
        const { email, role, otp } = req.body;

        if (!email || !role || !otp) {
            return res.status(400).json({
                message: "Email, role, dan OTP wajib diisi"
            });
        }

        if (!["admin", "pasien"].includes(role)) {
            return res.status(400).json({
                message: "Role tidak valid"
            });
        }

        if (!/^\d{6}$/.test(otp)) {
            return res.status(400).json({
                message: "Format OTP tidak valid"
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const { data: otpData, error } = await supabase
            .from("password_reset_otps")
            .select("*")
            .eq("email", normalizedEmail)
            .eq("role", role)
            .is("used_at", null)
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();

        if (error) throw error;

        if (!otpData) {
            return res.status(400).json({
                message: "OTP tidak ditemukan atau sudah digunakan"
            });
        }

        if (new Date(otpData.expires_at) < new Date()) {
            return res.status(400).json({
                message: "OTP sudah kedaluwarsa"
            });
        }

        if (otpData.attempts >= 5) {
            return res.status(429).json({
                message: "Batas percobaan OTP telah tercapai"
            });
        }

        const isValid = await bcrypt.compare(
            otp,
            otpData.otp_hash
        );

        if (!isValid) {
            const { error: updateError } = await supabase
                .from("password_reset_otps")
                .update({
                    attempts: otpData.attempts + 1
                })
                .eq("id", otpData.id);

            if (updateError) throw updateError;

            return res.status(400).json({
                message: "Kode OTP salah"
            });
        }

        return res.status(200).json({
            message: "OTP berhasil diverifikasi"
        });

    } catch (error) {
        console.error("Verify OTP error:", error.message);

        return res.status(500).json({
            message: "Terjadi kesalahan pada server"
        });
    }
};


const resetPassword = async (req, res) => {
    try {
        const { email, role, otp, new_password } = req.body;

        if (!email || !role || !otp || !new_password) {
            return res.status(400).json({
                message: "Semua field wajib diisi"
            });
        }

        if (!["admin", "pasien"].includes(role)) {
            return res.status(400).json({
                message: "Role tidak valid"
            });
        }

        if (!/^\d{6}$/.test(otp)) {
            return res.status(400).json({
                message: "Format OTP tidak valid"
            });
        }

        if (new_password.length < 8) {
            return res.status(400).json({
                message: "Password minimal 8 karakter"
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const { data: otpData, error } = await supabase
            .from("password_reset_otps")
            .select("*")
            .eq("email", normalizedEmail)
            .eq("role", role)
            .is("used_at", null)
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();

        if (error) throw error;

        if (!otpData) {
            return res.status(400).json({
                message: "OTP tidak ditemukan atau sudah digunakan"
            });
        }

        if (new Date(otpData.expires_at) < new Date()) {
            return res.status(400).json({
                message: "OTP sudah kedaluwarsa"
            });
        }

        if (otpData.attempts >= 5) {
            return res.status(429).json({
                message: "Batas percobaan OTP telah tercapai"
            });
        }

        const isValid = await bcrypt.compare(
            otp,
            otpData.otp_hash
        );

        if (!isValid) {
            const { error: updateError } = await supabase
                .from("password_reset_otps")
                .update({
                    attempts: otpData.attempts + 1
                })
                .eq("id", otpData.id);

            if (updateError) throw updateError;

            return res.status(400).json({
                message: "Kode OTP salah"
            });
        }

        const table = role === "admin" ? "admin" : "pasien";
        const password_hash = await bcrypt.hash(new_password, 10);

        const { error: passwordError } = await supabase
            .from(table)
            .update({ password_hash })
            .ilike("email", normalizedEmail);

        if (passwordError) throw passwordError;

        const { error: otpError } = await supabase
            .from("password_reset_otps")
            .update({
                used_at: new Date().toISOString()
            })
            .eq("id", otpData.id)
            .is("used_at", null);

        if (otpError) throw otpError;

        return res.status(200).json({
            message: "Password berhasil diperbarui"
        });

    } catch (error) {
        console.error("Reset password error:", error.message);

        return res.status(500).json({
            message: "Terjadi kesalahan pada server"
        });
    }
};


module.exports = {
    requestPasswordReset,
    verifyPasswordResetOTP,
    resetPassword
};
