import express from "express";
import { publicRouter } from "../router/public-api";
import { errorMiddleware } from "../middleware/error-middleware";
import { apiRouter } from "../router/api";

export const server = express();
server.use(express.json());

server.use(express.json());
server.use(publicRouter);
server.use(apiRouter);
server.use(errorMiddleware);
