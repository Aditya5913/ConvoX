const dotenv = require("dotenv");
dotenv.config();

const { app, server } = require("./socket/socket"); // ✅ Import shared app & server
const dbConnect = require("./config/dbConnection");
const authRoutes = require("./routes/authRoutes");
const messageRoute = require("./routes/messageRoute");
const cors = require("cors");

// Middlewares
app.use(cors());
app.use(require("express").json());

// Mount Routes
app.use("/api/v1", authRoutes);
app.use("/api/v1", messageRoute);

dbConnect();

app.get("/", (req, res) => {
  res.send("API is Running Successfully");
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is Running on port ${PORT}`);
});
