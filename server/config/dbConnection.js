const mongoose = require("mongoose");

const dbConnect = () => {
  mongoose
    .connect(process.env.DATABASE_URL)
    .then(() => console.log("✅ DB Connected Successfully"))
    .catch((err) => console.log("❌ DB Not Connected", err));
};

module.exports = dbConnect;
