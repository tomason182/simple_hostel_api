import fs from "fs/promises";
import path from "path";

export class ImagesController {
  constructor(imagesInputPort) {
    this.imagesInputPort = imagesInputPort;
  }

  // @desc    Upload room type images
  // @router  POST /api/v2/images/upload/room-types/:id
  // @access  Private
  uploadRoomTypeImages = async (req, res, next) => {
    try {
      const roomTypeId = parseInt(req.params.id, 10);
      if (isNaN(roomTypeId)) {
        return res.status(400).json({ msg: "Invalid Room Type ID" });
      }

      const files = req.files;
      if (!files || files.length === 0) {
        return res.status(400).json({ msg: "No files to upload" });
      }

      // Check NOT to exceed maximum images permitted.
      const imagesStored = await this.imagesInputPort.getRoomTypeImages(
        roomTypeId
      );

      if (imagesStored.length + files.length > 10) {
        return res
          .status(400)
          .json({ msg: "Maximum amount of images reached" });
      }

      const propertyId = req.user.property_id;

      const filePaths = files.map(file => file.filename);

      const result = await this.imagesInputPort.saveRoomTypesImagesFilenames(
        propertyId,
        roomTypeId,
        filePaths
      );

      return res.status(200).json(result);
    } catch (e) {
      await Promise.all(
        req.files.map(file =>
          fs
            .unlink(path.join("public", "uploads", file.filename))
            .catch(err => {
              console.error("Error deleting file: ", err);
            })
        )
      );
      next(e);
    }
  };

  // @desc    Upload property images
  // @router  POST /api/v2/images/upload/property
  // @access  Private
  uploadPropertyImages = async (req, res, next) => {
    try {
      const files = req.files;
      if (!files || files.length === 0) {
        return res.status(400).json({ msg: "No files to upload" });
      }

      const propertyId = req.user.property_id;

      // Check NOT to exceed maximum images permitted.
      const imagesStored = await this.imagesInputPort.getPropertyImages(
        propertyId
      );

      if (imagesStored.length + files.length > 10) {
        return res
          .status(400)
          .json({ msg: "Maximum amount of images reached" });
      }

      const filePaths = files.map(file => file.filename);

      const result = await this.imagesInputPort.savePropertyImages(
        propertyId,
        filePaths
      );

      return res.status(200).json(result);
    } catch (e) {
      await Promise.all(
        req.files
          .map(file => fs.unlink(path.join("public", "uploads", file.filename)))
          .catch(err => {
            console.error("Error deleting file: ", err);
          })
      );
      next(e);
    }
  };

  // @desc    Get room types images.
  // @route   GET /api/v2/images/room-types/:id
  // @access  Private
  getRoomTypeImages = async (req, res, next) => {
    try {
      const roomTypeId = parseInt(req.params.id, 10);
      if (isNaN(roomTypeId)) {
        return res.status(400).json({ msg: "Invalid Room Type ID" });
      }

      const result = await this.imagesInputPort.getRoomTypeImages(roomTypeId);

      return res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  };

  // @desc    Get property images.
  // @route   GET /api/v2/images/property
  // @access  Private
  getPropertyImages = async (req, res, next) => {
    try {
      const propertyId = req.user.property_id;

      const result = await this.imagesInputPort.getPropertyImages(propertyId);

      return res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  };

  // @desc    Delete room type image.
  // @route   GET /api/v2/images/roomType/delete/:roomId
  // @access  Private
  deleteRoomTypeImage = async (req, res, next) => {
    try {
      const imageId = parseInt(req.params.imageId, 10);
      if (isNaN(imageId)) {
        return res.status(400).json({ msg: "Invalid image ID" });
      }
      const propertyId = req.user.property_id;
      const image = await this.imagesInputPort.getRoomTypeImageById(imageId);

      // Image filename es image.file_name ¿¿??
      console.log(image);
      // Delete image from the database
      const result = await this.imagesInputPort.deleteRoomTypeImage(
        propertyId,
        imageId
      );

      // Delete image from storage
      await fs
        .unlink(path.join("public", "uploads", image.file_name))
        .catch(err => {
          console.error("Failed to delete image file", err);
        });

      return res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  };

  // @desc    Delete property image.
  // @route   GET /api/v2/images/property/delete/:roomId
  // @access  Private
  deletePropertyImage = async (req, res, next) => {
    try {
      const imageId = parseInt(req.params.imageId, 10);
      if (isNaN(imageId)) {
        return res.status(400).json({ msg: "Invalid image ID" });
      }
      const propertyId = req.user.property_id;
      const image = await this.imagesInputPort.getPropertyImageById(imageId);

      // Delete image filename from database
      const result = await this.imagesInputPort.deletePropertyImage(
        propertyId,
        imageId
      );

      // Delete image from storage
      await fs
        .unlink(path.join("public", "uploads", image.file_name))
        .catch(err => {
          console.error("Failed to delete image file", err);
        });

      return res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  };
}
