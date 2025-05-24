import fs from "fs/promises";
import path from "path";
import sharp from "sharp";
import { rename, legend } from "../../../utils/stringHandler.js";

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

      
      const listMetadatas = await Promise.all(
        files.map(file => sharp(file.buffer).metadata())
      );
      
      let smallImageNames = "";
      const rejectedList = [];
      const rejectedIndexes = [];
      listMetadatas.forEach((metadata, index) => {
        if (metadata.height < 1000) {
          rejectedList.push(files[index].originalname);
          rejectedIndexes.push(index);
          smallImageNames += files[index].originalname + ", ";
        }
      });

      let msg = "All images are of the correct height";
      if ((rejectedList.length !== 0) && (rejectedList.length === files.length)) {
        msg = legend(smallImageNames);
        return res.status(400).json({ msg: msg, rejected_images: rejectedList});
      } else if (rejectedList.length !== 0) {
        msg = legend(smallImageNames);
      }

      let route = "";
      const filePaths = [];
      for (let i=0; i < files.length; i++) {
        if (!rejectedIndexes.includes(i)) {
          const file_name = files[i].originalname;
          const newName = rename(file_name);
          route = path.join("public", "uploads", newName);
          filePaths.push(newName);

          await sharp(files[i].buffer)
            .resize({ height: 960 })
            .toFormat('webp')
            .toFile(route);
        };
      };

      const propertyId = req.user.property_id;

      const result = await this.imagesInputPort.saveRoomTypesImagesFilenames(
        propertyId,
        roomTypeId,
        filePaths
      );

      return res.status(200).json({result: result, msg: msg, rejected_images: rejectedList});
    } catch (e) {
      console.log(e);
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

      const listMetadatas = await Promise.all(
        files.map(file => sharp(file.buffer).metadata())
      );
      
      let smallImageNames = "";
      const rejectedList = [];
      const rejectedIndexes = [];
      listMetadatas.forEach((metadata, index) => {
        if (metadata.height < 1000) {
          rejectedList.push(files[index].originalname);
          rejectedIndexes.push(index);
          smallImageNames += files[index].originalname + ", ";
        }
      });

      let msg = "All images are of the correct height";
      if ((rejectedList.length !== 0) && (rejectedList.length === files.length)) {
        msg = legend(smallImageNames);
        return res.status(400).json({ msg: msg, rejected_images: rejectedList});
      } else if (rejectedList.length !== 0) {
        msg = legend(smallImageNames);
      }

      let route = "";
      const filePaths = [];
      for (let i=0; i < files.length; i++) {
        if (!rejectedIndexes.includes(i)) {
          const file_name = files[i].originalname;
          const newName = rename(file_name);
          route = path.join("public", "uploads", newName);
          filePaths.push(newName);

          await sharp(files[i].buffer)
            .resize({ height: 960 })
            .toFormat('webp')
            .toFile(route);
        };
      };

      const result = await this.imagesInputPort.savePropertyImagesFilenames(
        propertyId,
        filePaths
      );

      return res.status(200).json({result: result, msg: msg, rejected_images: rejectedList});
    } catch (e) {
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

      if (image === null) {
        return res.status(400).json({ msg: "Image not found" });
      }
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
