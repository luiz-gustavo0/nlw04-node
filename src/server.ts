import "reflect-metadata";
import express from "express";
import "./database";
import { router } from "./routes";
import { useContainer } from "typeorm";

const app = express();

app.use(express.json());
app.use(router);

app.listen(4000, () => console.log('Server is running"'));
