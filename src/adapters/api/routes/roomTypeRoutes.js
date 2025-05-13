import express from "express";
import { checkSchema, param } from "express-validator";
import { createTokenService } from "../../../adapters/config/tokenConfig.js";
import authMiddleware from "../../../middleware/authMiddleware.js";
import checkPermission from "../../../middleware/rbacMiddleware.js";
import {
  roomTypeSchema,
  updateRoomTypeSchema,
} from "../schemas/roomTypeSchema.js";
import { amenitiesSchema } from "../schemas/amenitiesSchema.js";

export function createRoomTypeRoutes(services) {
  const router = express.Router();

  const tokenService = createTokenService();

  const roomTypeController = services.roomTypeController;

  // Create a new room type
  router.post(
    "/create",
    authMiddleware(tokenService),
    checkPermission("create_room_type"),
    checkSchema(roomTypeSchema),
    roomTypeController.roomTypeCreate
  );

  // Read room types
  router.get(
    "/",
    authMiddleware(tokenService),
    roomTypeController.getAllPropertyRoomTypes
  );

  // Read only one room type
  router.get(
    "/:id",
    authMiddleware(tokenService),
    param("id").trim().isInt().withMessage("Not a valid ID"),
    roomTypeController.getRoomTypeById
  );

  // Update a room type
  router.put(
    "/update/:id",
    authMiddleware(tokenService),
    checkPermission("update_room_type"),
    checkSchema(updateRoomTypeSchema),
    param("id").trim().isInt().withMessage("Not a valid ID"),
    roomTypeController.roomTypeUpdate
  );

  // Delete a room type
  router.delete(
    "/delete/:id",
    authMiddleware(tokenService),
    checkPermission("delete_room_type"),
    param("id").trim().isInt().withMessage("Not a valid ID"),
    roomTypeController.roomTypeDelete
  );

  // Add or edit amenities
  router.post(
    "/amenities/:id",
    checkSchema(amenitiesSchema),
    param("id").trim().isInt().withMessage("Not a valid ID"),
    authMiddleware(tokenService),
    roomTypeController.addAmenities
  );

  return router;
}
