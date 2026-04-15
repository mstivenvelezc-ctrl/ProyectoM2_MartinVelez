import "dotenv/config";
import app from "./app.js";
/*
import path from "path";
import { fileURLToPath } from "url";
import YAML from "yamljs";
import swaggerUi from "swagger-ui-express";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swaggerDocument = YAML.load(
  path.join(__dirname, "../openapi.yaml")
);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
*/
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
