import express from "express";
import { checkSchema, body, param } from "express-validator";
import { createTokenService } from "../../../adapters/config/tokenConfig.js";
import authMiddleware from "../../../middleware/authMiddleware.js";
import {
  roomTypeSchema,
  updateRoomTypeSchema,
} from "../schemas/roomTypeSchema.js";

export function createRoomTypeRoutes(services) {
  const router = express.Router();

  const tokenService = createTokenService();

  const roomTypeController = services.roomTypeController;                                          //Crear en services el room type controller y sus metodos
                                                                                                   // estudiar lo del tokenservices
  // Create a new room type
  router.post(
    "/create",
    authMiddleware(tokenService),
    checkSchema(roomTypeSchema),
    roomTypeController.createRoomType
  );

  // Read room types
  router.get("/", authMiddleware(tokenService), roomTypeController.readRoomTypes);

  // Read only one room type
  router.get(
    "/:id",
    authMiddleware(tokenService),
    param("id").trim().isInt().withMessage("Not a valid ID"),
    roomTypeController.readRoomType
  );

  // Update a room type
  router.put(
    "/update/:id",
    authMiddleware(tokenService),
    checkSchema(updateRoomTypeSchema),
    param("id").trim().isInt().withMessage("Not a valid ID"),
    roomTypeController.updateRoomType
  );

  // Delete a room type
  router.delete(
    "/delete/:id",
    authMiddleware(tokenService),
    param("id").trim().isInt().withMessage("Not a valid ID"),
    roomTypeController.deleteRoomType
  );

  return router;
}