import app from "./src/app.js"
import setupRoutes from "./src/routes/setupRoutes.js"
const PORT = 5000;
app.listen(PORT,()=>{
  console.log(`Server running on port ${PORT}`);
});
app.use("/setup", setupRoutes);