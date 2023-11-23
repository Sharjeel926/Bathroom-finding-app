const express = require("express");
const dataBase = require("./database/database");
const swaggerSpec = require("./swagger/swagger");
const swaggerUi = require("swagger-ui-express");
const app = express();
const { generateOtp } = require("./utils/generateOtp");
const ot = generateOtp();

const port = 3500;
app.use(express.json());
const authRoutes = require("./routes/authRoutes");
const bathRoutes = require("./routes/bathRoutes");
const userRoutes = require("./routes/userRoutes");
app.use("/api-doc", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/bath", bathRoutes);
app.listen(port, () => {
  console.log(`App is running on ${port}`);
});
