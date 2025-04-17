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
  };

  // @desc    Get room types images.
  // @route   GET /api/v2/images/room-types/:id
  // @access  Private
}
