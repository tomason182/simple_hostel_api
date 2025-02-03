import { validationResult, matchedData } from "express-validator";


export class RoomTypeController {
  constructor(roomTypeInputPort) {
    this.roomTypeInputPort = roomTypeInputPort;
  }

  // @desc    Create new room type
  // @route   POST /api/v2/room-types/create
  // @access  Private
  roomTypeCreate = async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
      }

      const propertyId = req.user.property_id;

      // Extract req values
      const data = matchedData(req);

      const roomTypeData = {
        description: data.description,
        type: data.type,
        gender: data.gender,
        max_occupancy: data.maxOccupancy,
        inventory: data.inventory,
        base_rate: data.baseRate,
        currency: data.currency,
        amenities: data.amenities,
      };

      //En este punto del código se puede traducir el array de amenities en un número binario
      //donde los ceros del mismo equivaldrían a false y los unos a true. Y la posición de cada 
      //dígito en este número binario indicaría el estado de un valor único de amenity.
      //Para mantener la coherencia: un valor de amenity siempre se va a encontrar en la misma
      //posición de este binario. Con esto nos ahorraríamos crear una nueva tabla en la bd, si 
      //por alguna razón este fuera nuestro deseo.


      const result = await this.roomTypeInputPort.createRoomType(
        propertyId,
        roomTypeData
      );

      return res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  // @desc    Reads all room types for a property id
  // @route   GET /api/v2/room-types/
  // @access  Private
  roomTypesRead = async (req, res, next) => {
    try {
      const propertyId = req.user.property_id;

      if (propertyId === null || propertyId === undefined) {
        res.status(401);
        throw new Error("Access denied. Property id not found");
      }

      const result = await this.roomTypeInputPort.readRoomTypes(propertyId);

      return res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  // @desc    Read a room type through its identifier.
  // @route   GET /api/v2/room-types/:id
  // @access  Private
  roomTypeRead = async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
      }

      
      const { id } = matchedData(req);

      const result = await this.roomTypeInputPort.findRoomTypeById(id); // aca pasar propertyId no tiene sentido

      return res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  // @desc    Update a room type in the Database.
  // @route   PUT /api/v2/room-types/update/:id
  // @access  Private
  roomTypeUpdate = async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
      }

      // Extract req values
      const data = matchedData(req);

      const roomTypeData = {
        id: data.id,
        description: data.description,
        gender: data.gender,
        base_rate: data.baseRate,
        currency: data.currency,
        amenities: data.amenities,
      };

      const propertyId = req.user.property_id;

      const result = await this.roomTypeInputPort.updateRoomTypeById(roomTypeData, propertyId);

      return res.status(200).json({result});
    } catch (err) {
      next(err);
    }
  };

  // @desc    Delete a room type through its identifier.
  // @route   DELETE /api/v2/room-types/:id
  // @access  Private
  roomTypeDelete = async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
      }

      // Extract req values
      const { id } = matchedData(req);

      const result = await this.roomTypeInputPort.deleteRoomTypeById(id);

      return res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };























  

 
}