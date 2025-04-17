export class ImagesInputPort {
  constructor(imagesRepository) {
    this.imagesRepository = imagesRepository;
  }

  saveRoomTypesImagesFilenames(propertyId, roomId, files) {
    return this.imagesRepository.saveRoomTypesImages(propertyId, roomId, files);
  }

  savePropertyImagesFilenames(propertyId, filesPath) {
    return this.imagesRepository.savePropertyImages(propertyId, filesPath);
  }

  getRoomTypeImages(roomTypeId) {
    return this.imagesRepository.getRoomTypeImages(roomTypeId);
  }

  getPropertyImages(propertyId) {
    return this.imagesRepository.getPropertyImages(propertyId);
  }

  getRoomTypeImageById(imageId) {
    return this.imagesRepository.getRoomTypeImageById(imageId);
  }

  getPropertyImageById(imageId) {
    return this.imagesRepository.getPropertyImageById(imageId);
  }

  deleteRoomTypeImage(propertyId, imageId) {
    return this.imagesRepository.deleteRoomTypeImage(propertyId, imageId);
  }

  deletePropertyImage(propertyId, imageId) {
    return this.imagesRepository.deletePropertyImage(propertyId, imageId);
  }
}
