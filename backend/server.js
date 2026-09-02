import "dotenv/config";
import connectDB from "./src/config/db.js";
import app from "./app.js";

connectDB();

const PORT = process.env.PORT || 2345;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
