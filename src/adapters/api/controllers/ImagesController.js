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

      const propertyId = req.params.property_id;

      const filePaths = files.map(file => file.filename);

      const result = await this.imagesInputPort.saveRoomTypesImagesFilename(
        propertyId,
        roomTypeId,
        filePaths
      );

      return res.status(200).json(result);
    } catch (e) {
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

      const filePaths = files.map(file => file.filename);

      const result = await this.imagesInputPort.savePropertyImages(
        propertyId,
        filePaths
      );

      return res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  };

  // @desc    Get room types images.
  // @route   GET /api/v2/images/room-types/:id
  // @access  Private
  getRoomTypeImage = async (req, res, next) => {
    try {
      const roomTypeId = parseInt(req.params.id, 10);
      if (isNaN(roomTypeId)) {
        return res.status(400).json({ msg: "Invalid Room Type ID" });
      }

      const result = await this.imagesInputPort.getRoomTypeImage(roomTypeId);

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
      if (isNaN(roomTypeId)) {
        return res.status(400).json({ msg: "Invalid Room Type ID" });
      }
      const propertyId = req.user.property_id;

      const result = await this.imagesInputPort.deleteRoomTypeImage(
        propertyId,
        imageId
      );

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
      if (isNaN(roomTypeId)) {
        return res.status(400).json({ msg: "Invalid Room Type ID" });
      }
      const propertyId = req.user.property_id;

      const result = await this.imagesInputPort.deletePropertyImage(
        propertyId,
        imageId
      );

      return res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  };
}
