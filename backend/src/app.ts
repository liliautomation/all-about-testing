import express from "express";
import cors from "cors";
import checklistRoute from "./routes/checklist";
import strategiesRoute from "./routes/strategies";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/checklist", checklistRoute);
app.use("/api/strategies", strategiesRoute);

export default app;