export class RoomTypeOutputPort {
  constructor(roomTypeRepository) {
    this.roomTypeRepository = roomTypeRepository;
  }

  save(roomType, connection) {
    return this.roomTypeRepository.save(roomType, connection);
  }

  findOneRoomTypeByDescription(description, propertyId, conn = null) {
    return this.roomTypeRepository.findOneRoomTypeByDescription(description, propertyId, conn);
  }

  findAllRoomTypesByPropertyId(propertyId, conn = null) {
    return this.roomTypeRepository.findAllRoomTypesByPropertyId(propertyId, conn);
  }

  findRoomTypeById(id, conn = null) {
    return this.roomTypeRepository.findRoomTypeById(id, conn);
  }
  
  updateRoomTypeById(roomTypeData, conn = null) {
    return this.roomTypeRepository.updateRoomTypeById(roomTypeData, conn);
  } 

  deleteRoomTypeById(id, conn = null) {
    return this.roomTypeRepository.deleteRoomTypeById(id, conn);
  } 

}


/* ###############################          ESTO MAS QUE SEGURO NO ESTA BIEN                        ###########################################
  ################################        ES QUE NO ME QUEDO CLARO EL CONCEPTO DE LA                 ##########################################
  ################################        CONEXION, CUANDO SI LA REQUIERE Y CUANDO NO.                #########################################
  ################################       PREFIERO PASARTE YA LO QUE TENGO Y QUE VOS VAYAS              ########################################
  ################################       METIENDO MANO. YO POR MI PARTE VOY A TERMINAR DE               #######################################
  ################################      CODIFICAR EL ULTIMO ARCHIVO QUE ME QUEDA, QUE ES EL              #######################################
  ################################      REPOSITORY MSQL Y CUANDO LO TENGA REPASO TODO PARA IR             #######################################  
  ################################      HACIENDO LOS AJUSTES NECESARIOS Y QUE DE UNA BUENA VEZ FUNCIONE    ####################################### */