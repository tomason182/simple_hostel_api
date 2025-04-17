export class ImagesInputPort {
  constructor(imagesRepository) {
    this.imagesRepository = imagesRepository;
  }

  saveRoomTypesImagesFilenames(roomId, files) {
    return this.imagesRepository.saveRoomTypesImages(propertyId, roomId, files);
  }

  savePropertyImagesFilenames(propertyId, filesPath) {
    return this.imagesRepository.savePropertyImages(propertyId, filesPath);
  }

  getRoomTypeImages(roomTypeId) {
    return this.imagesRepository.getRoomTypeImages(roomTypeId);
  }

  getPropertyImage(propertyId) {
    return this.imagesRepository.getPropertyImage(propertyId);
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
