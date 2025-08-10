import dotenv from "dotenv";
import app from "./app.js";
dotenv.config({
  path: "./.env",
});

const PORT = process.env.PORT || 5000;

app.get("/user", (req, res) => {
  res.send("hello world");
});

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
