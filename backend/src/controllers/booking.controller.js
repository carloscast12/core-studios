import User from "../models/User.js";
import Booking from "../models/Booking.js";

export const createBooking = async (req, res) => {
  try {
    const { cabinType, startTime, endTime, notes, price } = req.body;
    const notAvailable = await Booking.findOne({
      cabinType,
      status: { $ne: "cancelada" },
      startTime: { $lt: endTime },
      endTime: { $gt: startTime },
    });
    if (notAvailable) {
      return res.status(400).json({ message: "horario no disponible" });
    }
    const createdBooking = new Booking({
      user: req.user.id,
      cabinType,
      startTime,
      endTime,
      notes,
      price,
    });
    await createdBooking.save();
    return res.status(201).json(createdBooking);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getBooking = async (req, res) => {
  try {
    const allBookings = await Booking.find({ user: req.user.id });
    return res.status(200).json(allBookings);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAdminBooking = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "no autorizado" });
    }
    const allAdminBookings = await Booking.find().populate("user", "-password");
    return res.status(200).json(allAdminBookings);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAvailableSlots = async (req, res) => {
  try {
    const { date, cabinType } = req.query;
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const takenSlots = await Booking.find({
      cabinType,
      startTime: { $gte: start, $lte: end },
    });
    return res.status(200).json(takenSlots);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const findBooking = await Booking.findById(id);

    if (
      req.user.role !== "admin" &&
      (findBooking.user.toString() !== req.user.id ||
        findBooking.status !== "pendiente")
    ) {
      return res.status(403).json({ message: "no autorizado" });
    }

    const updatedBooking = await Booking.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    return res.status(200).json(updatedBooking);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteThis = await Booking.findById(id);
    if (!deleteThis) {
      return res.status(404).json({ message: "reserva no encontrada" });
    }
    if (
      req.user.role !== "admin" &&
      deleteThis.user.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "no autorizado" });
    }
    await Booking.findByIdAndDelete(id);
    return res.status(200).json({ message: "reserva eliminada" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "no autorizado" });
    }
    const updatedStatus = await Booking.findByIdAndUpdate(
      id,
      { status: "confirmada" },
      { new: true },
    );
    return res.status(200).json(updatedStatus);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
