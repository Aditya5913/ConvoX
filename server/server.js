const dotenv = require("dotenv");
dotenv.config();

const { app, server } = require("./socket/socket");
const dbConnect = require("./config/dbConnection");
const authRoutes = require("./routes/authRoutes");
const messageRoute = require("./routes/messageRoute");
const cors = require("cors");

// 🔥 PRODUCTION CORS FIX
app.use(
  cors({
    origin: "https://convo-x-sigma.vercel.app",
    credentials: true,
  }),
);

app.use(require("express").json());

// Routes
app.use("/api/v1", authRoutes);
app.use("/api/v1", messageRoute);

// DB
dbConnect();

app.get("/", (req, res) => {
  res.send("API is Running Successfully 🚀");
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server is Running on port ${PORT}`);
});
