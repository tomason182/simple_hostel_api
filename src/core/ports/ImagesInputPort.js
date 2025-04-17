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
}
