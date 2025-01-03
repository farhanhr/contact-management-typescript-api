import express from "express";
import { publicRouter } from "../router/public-api";

export const server = express();
server.use(express.json());

server.use(express.json());
server.use(publicRouter);