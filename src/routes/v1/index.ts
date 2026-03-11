import express, { Router } from "express";
import meetings from "./meetings/index.ts";

const v1: Router = express.Router();

v1.use("/meetings", meetings);

export default v1;