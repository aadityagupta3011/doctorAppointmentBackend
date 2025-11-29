import app from "./src/app.js";
import authRoutes from "./src/routes/authRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";

const PORT = 5000;

app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/users", userRoutes);


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
