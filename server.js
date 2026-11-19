
require("dotenv").config();

const helmet = require("helmet");
const express = require("express");
const cors = require("cors");
const supabase = require("./config/supabase");
const verifyToken = require("./middleware/authMiddleware");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "QCare Backend API is running!"
    });
});

app.get("/api/health", (req, res) => {
    res.json({
        status: "OK",
        message: "QCare API is healthy"
    });
});

app.get("/api/db-test", async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("fasilitas_kesehatan")
            .select("id")
            .limit(1);

        if (error) {
            throw error;
        }

        res.json({
            status: "Connected",
            message: "Supabase database connected successfully!"
        });
    } catch (error) {
        console.error("Database error:", error.message);

        res.status(500).json({
            status: "Error",
            message: "Failed to connect to Supabase database"
        });
    }
});

const fasilitasRoutes = require("./routes/fasilitasRoutes");
app.use("/api/fasilitas", verifyToken, fasilitasRoutes);

const pasienRoutes = require("./routes/pasienRoutes");
app.use("/api/pasien", verifyToken, pasienRoutes);

const layananRoutes = require("./routes/layananRoutes");
app.use("/api/layanan", verifyToken, layananRoutes);

const dokterRoutes = require("./routes/dokterRoutes");
app.use("/api/dokter", verifyToken, dokterRoutes);

const jadwalDokterRoutes = require("./routes/jadwalDokterRoutes");
app.use("/api/jadwal-dokter", verifyToken, jadwalDokterRoutes);

const adminRoutes = require("./routes/adminRoutes");
app.use("/api/admin", verifyToken, adminRoutes);

const antreanRoutes = require("./routes/antreanRoutes");
app.use("/api/antrean", verifyToken, antreanRoutes);

const riwayatAntreanRoutes = require("./routes/riwayatAntreanRoutes");
app.use("/api/riwayat-antrean", verifyToken, riwayatAntreanRoutes);

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
    console.log(`QCare API running at http://localhost:${PORT}`);
});
