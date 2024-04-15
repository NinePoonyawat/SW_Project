const Rental = require("../models/Rental");
const RentalCar = require("../models/RentalCar");

//@desc     Get all remtals
//@route    GET /api/v1/rentals
//@access   Public
exports.getRentals = async (req, res, next) => {
  let query;

  //General users can see only their rentals!
  if (req.user.role !== "admin") {
    query = Rental.find({ user: req.user.id }).populate({
      path: "rentalCar",
      select: "carBrand model color licensePlate",
    });
  } else {
    //If you are an admin, you can see all!
    if (req.params.rentalCarId) {
      query = Rental.find(req.params.rentalCarId).populate({
        path: "rentalCar",
        select: "carBrand model color licensePlate",
      });
    } else {
      query = Rental.find().populate({
        path: "rentalCar",
        select: "carBrand model color licensePlate",
      });
    }
  }

  try {
    const rentals = await query;

    res.status(200).json({
      success: true,
      count: rentals.length,
      data: rentals,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Cannot find Rentals" });
  }
};

//@desc     Get single rental
//@route    GET /api/v1/rental/:id
//@access   Public
exports.getRental = async (req, res, next) => {
  try {
    const rental = await Rental.findById(req.params.id).populate({
      path: "rentalCar",
      select: "carBrand model color licensePlate",
    });

    if (!rental) {
      return res.status(404).json({
        success: false,
        message: `No rental with the id of ${req.params.id}`,
      });
    }

    res.status(200).json({
      success: true,
      data: rental,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "cannot find Rental" });
  }
};

//@desc     Add rental
//@route    POST /api/v1/rentalCars/:rentalId/rental
//@access   Private
exports.addRental = async (req, res, next) => {
  try {
    // req.body.rentalCar = req.params.rentalCarId;
    console.log(req.body.rentalCarId);

    const rentalCar = await RentalCar.findById(req.body.rentalCarId);

    if (!rentalCar) {
      return res.status(404).json({
        success: false,
        message: `No rental car with the id of ${req.body.rentalCarId}`,
      });
    }

    //add user Id to req.body
    req.body.user = req.user.id;
    req.body.rentalCar = rentalCar;
    //Check for existed rental
    const existedRental = await Rental.find({ user: req.body.user });

    //If the user is not an admin, they can only one rental
    if (existedRental.length >= 1 && req.user.role !== "admin") {
      return res.status(404).json({
        success: false,
        message: `The user with id ${req.user.id} has already made rental`,
      });
    }

    const rental = await Rental.create(req.body);

    res.status(200).json({
      success: true,
      data: rental,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Cannot create Rental" });
  }
};

//@desc     Update rental
//@route    PUT /api/v1/remtals/:id
//@access   Private
exports.updateRental = async (req, res, next) => {
  try {
    let rental = await Rental.findById(req.params.id);
    console.log(req.params.id);

    if (!rental) {
      return res.status(404).json({
        success: false,
        message: `No rental with the id of ${req.params.id}`,
      });
    }

    //Make sure user is the rental owner
    if (rental.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(401).json({
        success: false,
        message: `User ${req.user.id} is not authorized to update this rental`,
      });
    }

    rental = await Rental.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: rental,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Cannot update Rental" });
  }
};

//@desc     Delete rental
//@roue     DELETE /api/v1/rentals/:id
//@access   Private
exports.deleteRental = async (req, res, next) => {
  try {
    const rental = await Rental.findById(req.params.id);

    if (!rental) {
      return res.status(404).json({
        success: false,
        message: `No rental with the id of ${req.params.id}`,
      });
    }

    //Make sure user is the rental owner
    if (rental.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(404).json({
        success: false,
        message: `User ${req.params.rentalCarId} is not authorized to delete this bootcamp`,
      });
    }
    await rental.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Cannot delete Rental" });
  }
};
