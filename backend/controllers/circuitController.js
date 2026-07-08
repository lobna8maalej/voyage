import Circuit from "../models/Circuit.js";

// ================= CREATE CIRCUIT =================
export const createCircuit = async (req, res) => {
  try {
    const {
      destination,
      title,
      startDate,
      endDate,
      days,
      nights,
      price,
      programs,
      images,
    } = req.body;

    const circuit = await Circuit.create({
      destination,
      agency: req.user.id, // agence connectée
      title,
      startDate,
      endDate,
      days,
      nights,
      price,
      programs,
      images,
    });

    return res.status(201).json({
      success: true,
      circuit,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getCircuits = async (req, res) => {
  try {

    const circuits = await Circuit.find()
      .populate("destination")
      .populate("agency");


    return res.json({
      success:true,
      circuits
    });


  } catch (error) {

    return res.status(500).json({
      message:error.message,
    });

  }
};

export const getCircuit = async (req, res) => {
  try {
    const circuit = await Circuit.findById(req.params.id)
      .populate("destination")
      .populate("agency");

    if (!circuit) {
      return res.status(404).json({
        message: "Circuit not found",
      });
    }

    return res.json(circuit);

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const updateCircuit = async (req, res) => {
  try {
    const circuit = await Circuit.findById(req.params.id);

    if (!circuit) {
      return res.status(404).json({ message: "Circuit not found" });
    }

    // sécurité : seule l'agence propriétaire peut modifier
    if (circuit.agency.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    const updated = await Circuit.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    return res.json({
      success: true,
      circuit: updated,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteCircuit = async (req, res) => {
  try {
    const circuit = await Circuit.findById(req.params.id);

    if (!circuit) {
      return res.status(404).json({ message: "Circuit not found" });
    }

    if (circuit.agency.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    await circuit.deleteOne();

    return res.json({
      success: true,
      message: "Circuit deleted",
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};