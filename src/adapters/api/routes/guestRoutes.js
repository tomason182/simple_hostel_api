import express from "express";
import { checkSchema, param } from "express-validator";
import { createTokenService } from "../../config/tokenConfig.js";
import authMiddleware from "../../../middleware/authMiddleware.js";
import { guestSchema } from "../schemas/guestSchema.js";

export function createGuestRoutes(services) {
  const router = express.Router();
  const tokenService = createTokenService();

  const guestController = services.guestController;

  // @desc    Create a new Guest
  // @route   POST /api/v1/guests/create
  // @access  Private
  // Parece que esta ruta esta en desuso, pero puede ser usada para agregar huespedes a reserva.
  router.post(
    "/create",
    authMiddleware(tokenService),
    checkSchema(guestSchema),
    guestController.createGuest
  );

  // @desc    Create a new Guest from website
  // @route   POST /api/v1/guests/new
  // @access  Publica
  // Esto no deberia ser de utilidad porque el huesped se crea junto con la reserva.
  /*   router.post(
    "/new/:id",
    checkSchema(guestSchema),
    param("id").trim().isInt().withMessage("Invalid ID param"),
    guestController.createGuestFromWeb
  ); */

  // @desc    Update an specific guest
  // @route   PUT /api/v1/guests/update/:id
  // @access  Private
  router.put(
    "/update/:id",
    param("id").trim().isInt().withMessage("Invalid ID parameter"),
    authMiddleware(tokenService),
    checkSchema(guestSchema),
    guestController.updateGuest
  );

  // @desc    Get an specific guest by id
  // @route   GET /api/v1/guests/:id
  // @access  Private
  router.get(
    "/:id",
    authMiddleware(tokenService),
    param("id").trim().isInt("Invalid ID parameter"),
    guestController.findGuestById
  );

  return router;
}
