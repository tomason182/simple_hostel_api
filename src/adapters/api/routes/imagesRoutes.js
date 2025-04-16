import express from "express";
import authMiddleware from "../../../middleware/authMiddleware";
import { createTokenService } from "../../config/tokenConfig";
import { upload } from "../../config/multer";

export function createImagesRoutes(services) {
  const router = express.Router();

  const tokenService = createTokenService();

  const imagesController = services.imagesController;

  // Upload room types images.
  router.post(
    "/images/upload/room-types/:id",
    authMiddleware(tokenService),
    upload.array("photos", 10),
    imagesController.uploadRoomTypeImages
  );

  // Get room types images.
  router.get(
    "/images/room-types/:id",
    authMiddleware(tokenService),
    imagesController.getRoomTypeImages
  );

  // Delete room type image.
  router.delete("/images/room-types/:imageId");

  // Delete property image.
  router.delete("/images/property/:imageId");

  // Upload property images.
  router.post(
    "/images/upload/property",
    authMiddleware(tokenService),
    upload.array("photos", 10),
    imagesController.uploadPropertyImages
  );

  // Get property images.
  router.get(
    "/images/property",
    authMiddleware(tokenService),
    imagesController.getPropertyImages
  );

  return router;
}
