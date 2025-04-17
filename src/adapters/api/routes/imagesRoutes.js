import express from "express";
import authMiddleware from "../../../middleware/authMiddleware.js";
import { createTokenService } from "../../config/tokenConfig.js";
import { upload } from "../../config/multer.js";

export function createImagesRoutes(services) {
  const router = express.Router();

  const tokenService = createTokenService();

  const imagesController = services.imagesController;

  // Upload room types images.
  router.post(
    "/upload/room-types/:id",
    authMiddleware(tokenService),
    upload.array("photos", 10),
    imagesController.uploadRoomTypeImages
  );

  // Upload property images.
  router.post(
    "/upload/property",
    authMiddleware(tokenService),
    upload.array("photos", 10),
    imagesController.uploadPropertyImages
  );

  // Get room types images.
  router.get(
    "/room-types/:id",
    authMiddleware(tokenService),
    imagesController.getRoomTypeImages
  );

  // Get property images.
  router.get(
    "/property",
    authMiddleware(tokenService),
    imagesController.getPropertyImages
  );

  // Delete room type image.
  router.delete(
    "/room-types/delete/:imageId",
    authMiddleware(tokenService),
    imagesController.deleteRoomTypeImage
  );

  // Delete property image.
  router.delete(
    "/property/delete/:imageId",
    authMiddleware(tokenService),
    imagesController.deletePropertyImage
  );

  return router;
}
