export class MySQLReservationRepository {
  constructor(mysqlPool) {
    this.mysqlPool = mysqlPool;
  }

  async save(reservation, conn = null) {
    try {
      const query =
        "INSERT INTO reservations (guest_id, property_id, booking_source, currency, reservation_status, payment_status, advance_payment_amount, check_in, check_out ,special_request, created_by) VALUES(?,?,?,?,?,?,?,?,?,?,?)";
      const params = [
        reservation.getGuestId(),
        reservation.getPropertyId(),
        reservation.getBookingSource(),
        reservation.getCurrency(),
        reservation.getReservationStatus(),
        reservation.getPaymentStatus(),
        reservation.getAdvancePaymentAmount(),
        reservation.getCheckIn(),
        reservation.getCheckOut(),
        reservation.getSpecialRequest(),
        reservation.getCreatedBy(),
      ];

      const [result] = await (conn
        ? conn.execute(query, params)
        : this.mysqlPool.execute(query, params));

      reservation.setId(result.insertId);

      // Insert reservation rooms (bulk)
      const selectedRooms = reservation.getSelectedRooms();
      if (selectedRooms.length > 0) {
        const setRoomsQuery = `
          INSERT INTO reservation_rooms 
          (reservation_id, room_type_id, number_of_rooms, total_amount) 
          VALUES ${selectedRooms.map(() => "(?,?,?,?)").join(", ")}`;

        const roomParams = selectedRooms.flatMap(room => [
          reservation.getId(),
          room.room_type_id,
          room.number_of_rooms,
          room.total_amount,
        ]);

        await conn.execute(setRoomsQuery, roomParams);
      }

      // Insert assigned beds (bulk);
      const beds = reservation.getBeds();
      if (beds.length > 0) {
        const setBedsQuery = `INSERT INTO assigned_beds (reservation_id, bed_id) VALUES ${beds
          .maps(() => "(?,?)")
          .join(", ")}`;

        const bedsParams = beds.flatMap(bedId => [reservation.getId(), bedId]);

        await conn.execute(setBedsQuery, bedsParams);
      }

      return reservation;
    } catch (e) {
      throw new Error(
        `An error occurred when creating a new reservation. Error: ${e.message}`
      );
    }
  }

  async getOverlappingReservationsByPropertyId(
    propertyId,
    startDate,
    endDate,
    conn = null
  ) {
    try {
      const query =
        "SELECT reservations.id AS id, reservations.check_in, reservations.check_out, reservation_rooms.room_type_id, reservation_rooms.number_of_rooms FROM reservations JOIN reservation_rooms ON reservation_rooms.reservation_id = reservations.id WHERE reservations.property_id = ? AND reservations.reservation_status NOT IN ('canceled', 'no_show') AND reservations.check_in <= ? AND reservations.check_out > ?";
      const params = [propertyId, endDate, startDate];

      const [result] = await this.mysqlPool.execute(query, params);

      return result;
    } catch (e) {
      throw new Error(
        `An error occurred when getting reservations by property ID. Error: ${e.message}`
      );
    }
  }

  async getOverlappingReservations(
    roomTypeId,
    reservationId = -1,
    startDate,
    endDate,
    conn = null
  ) {
    try {
      const query =
        "SELECT reservation_rooms.id as id, reservation_rooms.number_of_rooms, reservations.check_in, reservations.check_out FROM reservation_rooms JOIN reservations ON reservation_rooms.reservation_id = reservations.id WHERE reservation_rooms.room_type_id = ? AND reservation_rooms.reservation_id != ? AND reservations.reservation_status NOT IN ('canceled', 'no_show') AND reservations.check_in < ? AND reservations.check_out > ?";
      const params = [roomTypeId, reservationId, endDate, startDate];

      const [result] = await (conn
        ? conn.execute(query, params)
        : this.mysqlPool.execute(query, params));

      return result;
    } catch (e) {
      throw new Error(
        `An error occurred when getting the reservation list. Error: ${e.message}`
      );
    }
  }

  async getReservationsListLimit(roomTypeId, reservationId, from, limit, conn) {
    try {
      const safeLimit = parseInt(limit);
      const query = `SELECT reservations.id AS id, reservations.check_in, reservations.check_out, reservation_rooms.number_of_rooms, reservation_rooms.room_type_id, JSON_OBJECTAGG(assigned_beds.id, assigned_beds.bed_id) AS assigned_beds FROM reservations JOIN reservation_rooms ON reservation_rooms.reservation_id = reservations.id JOIN assigned_beds ON assigned_beds.reservation_id = reservations.id  WHERE reservation_rooms.room_type_id = ? AND reservation_rooms.reservation_id != ? AND reservations.reservation_status NOT IN ('canceled', 'no_show') AND reservations.check_out > ? GROUP BY reservations.id, reservations.check_in, reservations.check_out,reservation_rooms.number_of_rooms, reservation_rooms.room_type_id  LIMIT ${safeLimit}`;
      const params = [roomTypeId, reservationId, from];

      const [result] = await (conn
        ? conn.execute(query, params)
        : this.mysqlPool.execute(query, params));

      return result;
    } catch (e) {
      throw new Error(
        `An error occurred trying to get the reservation list. Error: ${e.message}`
      );
    }
  }

  async updateAssignedBed(data, conn) {
    try {
      if (data.length === 1) {
        const query = "UPDATE assigned_beds SET bed_id=? WHERE id=?";
        const params = [parseInt(data[0].bed_id), parseInt(data[0].id)];

        const [updateResult] = await conn.execute(query, params);

        return updateResult.affectedRows || 0;
      } else if (data.length > 1) {
        const caseStatement = data.map(() => `WHEN ? THEN ?`).join(" ");
        const idsPlaceholders = data.map(() => "?").join(", ");
        const caseParams = [];

        data.forEach(obj => {
          caseParams.push(obj.id, obj.bed_id);
        });

        const idParams = data.map(obj => obj.id);

        const query = `
          UPDATE assigned_beds
          SET bed_id = CASE id 
          ${caseStatement} 
          ELSE bed_id
          END
          WHERE id IN (${idsPlaceholders})`;

        const [updateResult] = await conn.execute(query, [
          ...caseParams,
          ...idParams,
        ]);
        return updateResult.affectedRows || 0;
      } else {
        return 0;
      }
    } catch (e) {
      throw new Error(
        `An error occurred trying to update assigned beds. Error: ${e.message}`
      );
    }
  }

  async findReservationsByDate(propertyId, date) {
    try {
      const query =
        "SELECT reservations.id as id, reservations.check_in, reservations.check_out, reservations.reservation_status ,guests.first_name, guests.last_name FROM reservations JOIN guests ON guests.id = reservations.guest_id WHERE reservations.property_id = ? AND reservations.check_in <= ? AND reservations.check_out >= ?";
      const params = [propertyId, date, date];

      const [result] = await this.mysqlPool.execute(query, params);

      return result;
    } catch (e) {
      throw new Error(
        `An error occurred trying to get reservations for specific date`
      );
    }
  }

  async findLatestReservations(propertyId) {
    try {
      const query =
        "SELECT reservations.id as id, reservations.check_in, reservations.check_out, reservations.reservation_status ,guests.first_name, guests.last_name FROM reservations JOIN guests ON guests.id = reservations.guest_id WHERE reservations.property_id = ? ORDER BY reservations.created_at DESC LIMIT 10";
      const params = [propertyId];

      const [result] = await this.mysqlPool.execute(query, params);

      return result;
    } catch (e) {
      throw new Error(`An error occurred trying the get latest reservations`);
    }
  }

  async getReservationsByDateRange(propertyId, from, to, type = "calendar") {
    try {
      let query;
      if (type === "calendar") {
        query =
          "SELECT reservations.id AS id, reservations.check_in, reservations.check_out, reservations.reservation_status, guests.first_name, guests.last_name, assigned_beds.bed_id FROM reservations JOIN guests ON guests.id = reservations.guest_id JOIN assigned_beds ON assigned_beds.reservation_id = reservations.id WHERE reservations.property_id = ? AND reservations.check_in <= ? AND reservations.check_out > ? AND reservations.reservation_status NOT IN ('canceled', 'no_show')";
      } else if (type === "search") {
        query =
          "SELECT reservations.id AS id, reservations.check_in, reservations.check_out, reservations.reservation_status, guests.first_name, guests.last_name, assigned_beds.bed_id FROM reservations JOIN guests ON guests.id = reservations.guest_id JOIN assigned_beds ON assigned_beds.reservation_id = reservations.id WHERE reservations.property_id = ? AND reservations.check_in <= ? AND reservations.check_out > ?";
      }

      const params = [propertyId, to, from];

      const [result] = await this.mysqlPool.execute(query, params);

      return result;
    } catch (e) {
      throw new Error(
        `An error occurred trying to get reservations by date range. Error: ${e.message}`
      );
    }
  }

  async findReservationById(propertyId, reservationId, conn) {
    // IMPORTANTE: Esto NO se puede limitar a 1 porque devuelve un array con varios elementos si la reserva contiene varios cuartos selectionados.
    const query =
      "SELECT r.id AS id, r.property_id, r.booking_source, r.currency, r.reservation_status, r.payment_status, r.advance_payment_amount, r.check_in, r.check_out, r.special_request, g.id AS guest_id, g.first_name, g.last_name, g.id_number, g.email, g.phone_number, g.city, g.street, g.postal_code, g.country_code, rr.room_type_id AS room_type_id, rr.number_of_rooms, rr.total_amount, rt.description FROM reservations r JOIN guests g ON r.guest_id = g.id JOIN reservation_rooms rr ON rr.reservation_id = r.id JOIN room_types rt ON rt.id = rr.room_type_id  WHERE r.property_Id = ? AND r.id = ?";
    const params = [propertyId, reservationId];

    const [result] = await (conn
      ? conn.execute(query, params)
      : this.mysqlPool.execute(query, params));

    return result;
  }

  async findReservationsByGuestName(propertyId, name) {
    try {
      const query =
        "SELECT r.id AS reservation_id, r.currency, r.reservation_status, r.check_in, r.check_out, g.first_name, g.last_name, rr.room_type_id AS room_type_id, rr.number_of_rooms, rr.total_amount FROM reservations r JOIN guests g ON r.guest_id = g.id JOIN reservation_rooms rr ON rr.reservation_id = r.id JOIN room_types rt ON rt.id = rr.room_type_id  WHERE r.property_Id = ? AND MATCH(g.first_name, g.last_name) AGAINST (? IN NATURAL LANGUAGE MODE)";
      const params = [propertyId, name];

      const [result] = await this.mysqlPool.execute(query, params);

      return result;
    } catch (e) {
      throw new Error(
        `An error occurred trying to find reservations by guest name. Error: ${e.message}`
      );
    }
  }

  async findReservationByGuestNameAndDates(propertyId, from, until, name) {
    try {
      const query =
        "SELECT r.id AS reservation_id, r.currency, r.reservation_status, r.check_in, r.check_out, g.first_name, g.last_name, rr.room_type_id AS room_type_id, rr.number_of_rooms, rr.total_amount FROM reservations r JOIN guests g ON r.guest_id = g.id JOIN reservation_rooms rr ON rr.reservation_id = r.id JOIN room_types rt ON rt.id = rr.room_type_id  WHERE r.property_Id = ? AND MATCH(g.first_name, g.last_name) AGAINST (? IN NATURAL LANGUAGE MODE) AND r.check_in >= ? AND r.check_in <= ?";
      const params = [propertyId, name, from, until];

      const [result] = await this.mysqlPool.execute(query, params);

      return result;
    } catch (e) {
      throw new Error(
        `An error occurred trying to find reservations by guest name and date range`
      );
    }
  }

  async searchReservationsByDateRange(propertyId, from, until) {
    try {
      const query =
        "SELECT r.id AS reservation_id, r.currency, r.reservation_status, r.check_in, r.check_out, g.first_name, g.last_name, rr.room_type_id AS room_type_id, rr.number_of_rooms, rr.total_amount FROM reservations r JOIN guests g ON r.guest_id = g.id JOIN reservation_rooms rr ON rr.reservation_id = r.id JOIN room_types rt ON rt.id = rr.room_type_id  WHERE r.property_Id = ? AND r.check_in >= ? AND r.check_in <= ?";
      const params = [propertyId, from, until];

      const [result] = await this.mysqlPool.execute(query, params);

      return result;
    } catch (e) {
      throw new Error(
        `An error occurred trying to find reservations by dates range`
      );
    }
  }

  // Get Advance payment policy
  async getAdvancePaymentPolicy(propertyId, conn = null) {
    try {
      const query =
        "SELECT * FROM advance_payment_policies WHERE property_id = ? LIMIT 1";
      const params = [propertyId];

      const [result] = await (conn
        ? conn.execute(query, params)
        : this.mysqlPool.execute(query, params));

      return result[0] || null;
    } catch (e) {
      throw new Error(
        `An error occurred trying to get advance payment policy. Error: ${e.message}`
      );
    }
  }

  // Update reservation dates and amount
  async updateReservation(reservation, conn) {
    try {
      const reservationId = reservation.getId();
      const paymentStatus = reservation.getPaymentStatus();

      // Update reservation dates
      if (paymentStatus === "pending") {
        const queryReservation =
          "UPDATE reservations SET check_in = ?, check_out = ?, advance_payment_amount = ? WHERE id = ?";
        const paramsReservation = [
          reservation.getCheckIn(),
          reservation.getCheckOut(),
          reservation.getAdvancePaymentAmount(),
          reservationId,
        ];

        await conn.execute(queryReservation, paramsReservation);
      } else if (paymentStatus === "partial") {
        const queryReservation =
          "UPDATE reservations SET check_in = ?, check_out = ? WHERE id = ?";
        const paramsReservation = [
          reservation.getCheckIn(),
          reservation.getCheckOut(),
          reservationId,
        ];

        await conn.execute(queryReservation, paramsReservation);
      }

      // Update reservation amount
      const selectedRooms = reservation.getSelectedRooms();

      if (selectedRooms.length > 0) {
        if (selectedRooms.length === 1) {
          const queryAmount =
            "UPDATE reservation_rooms SET total_amount = ? WHERE reservation_id = ? AND room_type_id = ?";
          const paramsAmount = [
            selectedRooms[0].total_amount,
            reservationId,
            selectedRooms[0].room_type_id,
          ];

          await conn.execute(queryAmount, paramsAmount);
        } else {
          const caseStatement = selectedRooms
            .map(() => `WHEN ? THEN ?`)
            .join(" ");

          const queryAmount = `
            UPDATE reservation_rooms 
            SET total_amount = CASE room_type_id
            ${caseStatement}
            ELSE total_amount
            END
            WHERE reservation_id = ? AND room_type_id IN (${selectedRooms
              .map(() => "?")
              .join(", ")})`;

          const caseParams = [];
          selectedRooms.forEach(room => {
            caseParams.push(room.room_type_id, room.total_amount);
          });

          const idParams = selectedRooms.map(room => room.room_type_id);

          await conn.execute(queryAmount, [
            ...caseParams,
            reservationId,
            ...idParams,
          ]);
        }
      }

      // Update assigned beds.
      const beds = reservation.getBeds();

      // Get old reservations beds [{id, reservation_id, bed_id}]
      const queryOldBeds =
        "SELECT * FROM assigned_beds WHERE reservation_id = ?";
      const [oldBeds] = await conn.execute(queryOldBeds, [reservationId]);

      if (oldBeds.length !== beds.length) {
        throw new Error("UNEXPECTED_ERROR_BEDS_COUNT_DONT_MATCH");
      }
      const newBeds = oldBeds.map((bed, i) => {
        bed.bed_id = beds[i];
        return bed;
      });

      if (newBeds.length > 0) {
        if (newBeds.length === 1) {
          const queryBeds = "UPDATE assigned_beds SET bed_id = ? WHERE id = ?";
          const paramsBeds = [newBeds[0].bed_id, newBeds[0].id];
          await conn.execute(queryBeds, paramsBeds);
        } else {
          const caseStatementBeds = beds.map(() => `WHEN ? THEN ?`).join(" ");

          const queryBeds = `
          UPDATE assigned_beds
          SET bed_id = CASE id
          ${caseStatementBeds}
          ELSE bed_id
          END
          WHERE id IN (${newBeds.map(() => "?").join(", ")})`;

          const caseParamsBeds = [];
          newBeds.forEach(bed => {
            caseParamsBeds.push(bed.id, bed.bed_id);
          });

          const idParamsBeds = newBeds.map(bed => bed.id);

          await conn.execute(queryBeds, [...caseParamsBeds, ...idParamsBeds]);
        }
      }

      return {
        status: "ok",
        msg: "RESERVATION_UPDATED",
      };
    } catch (e) {
      throw new Error(
        `An error occurred trying to update reservation dates. Error: ${e.message}`
      );
    }
  }

  // Update reservation status
  async updateReservationStatus(propertyId, id, status) {
    try {
      const query =
        "UPDATE reservations SET reservation_status = ? WHERE property_id = ? AND id = ?";
      const params = [status, propertyId, id];

      const [result] = await this.mysqlPool.execute(query, params);

      return {
        affectedRows: result.affectedRows,
        changedRows: result.changedRows,
      };
    } catch (e) {
      throw new Error(
        `An error occurred trying to update reservation status. Error: ${e.message}`
      );
    }
  }

  async updatePaymentStatus(propertyId, id, status) {
    const query =
      "UPDATE reservations SET payment_status = ? WHERE property_id = ? AND id = ?";
    const params = [status, propertyId, id];

    const [result] = await this.mysqlPool.execute(query, params);

    return {
      affectedRows: result.affectedRows,
      changedRows: result.changedRows,
    };
  }

  async updateReservationPrices(reservationId, newPrices) {
    // newPrices => {"1": "54,00", "7": "36.50", "deposit": "23.25"}
    // Separate deposit from room prices
    const { deposit, ...rawRoomPrices } = newPrices;

    // Normalize price strings like "54,00" to numbers
    const roomPrices = Object.fromEntries(
      Object.entries(rawRoomPrices).map(([key, value]) => [
        key,
        Number(value.replace(",", ".")),
      ])
    );

    const roomTypeIds = Object.keys(roomPrices);

    let affectedRows = 0;

    if (roomTypeIds.length === 1) {
      const query =
        "UPDATE reservation_rooms SET total_amount = ? WHERE reservation_id = ? AND room_type_id = ?";
      const params = [
        Object.values(roomPrices)[0],
        reservationId,
        parseInt(roomTypeIds[0]),
      ];

      const [result] = await this.mysqlPool.execute(query, params);

      affectedRows += result.affectedRows || 0;
    } else if (roomTypeIds.length > 1) {
      const caseStatement = roomTypeIds.map(() => "WHEN ? THEN ?").join(" ");

      const caseParams = Object.entries(roomPrices).flatMap(([id, val]) => [
        id,
        val,
      ]);

      const query = `
          UPDATE reservation_rooms
          SET total_amount = CASE room_type_id
          ${caseStatement}
          ELSE total_amount
          END
          WHERE reservation_id = ? AND room_type_id IN (${roomTypeIds
            .map(() => "?")
            .join(", ")})
        `;

      const [result] = await this.mysqlPool.execute(query, [
        ...caseParams,
        reservationId,
        ...roomTypeIds,
      ]);

      affectedRows += result.affectedRows || 0;
    }

    if (deposit !== undefined) {
      const depositValue = Number(deposit.replace(",", "."));
      const depositQuery =
        "UPDATE reservations SET advance_payment_amount = ? WHERE id = ?";
      const depositParams = [depositValue, reservationId];

      const [depositResult] = await this.mysqlPool.execute(
        depositQuery,
        depositParams
      );

      affectedRows += depositResult.affectedRows || 0;
    }

    return affectedRows;
  }
}
