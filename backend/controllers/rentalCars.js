const { request } = require("express");
const RentalCar = require("../models/RentalCar");
const carCenter = require("../models/CarCenter");

//@desc     GET car centers
//@route    GET /api/v1/rentalCars/carCenters/
//@access   Public
exports.getCarCenters = (req, res, next) => {
  carCenter.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message ||
          "some error occurred while retrieving Rental Car Centers.",
      });
    else res.send(data);
  });
};

//@desc     Get all rental cars
//@route    GET /api/v1/rentalCars
//@access   Public
exports.getRentalCars = async (req, res, next) => {
  let query;

  // Copy req.query
  const reqQuery = { ...req.query };

  //Fields to exclude
  const removeFields = ["select", "sort", "page", "limit"];

  //Loop over remove fields and delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);
  console.log(reqQuery);

  //Create query string
  let queryStr = JSON.stringify(reqQuery);
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  //finding resource
  query = RentalCar.find(JSON.parse(queryStr))
    .populate("rentals")
    .populate("reviews");

  //Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }

  //Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  //Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  try {
    const total = await RentalCar.countDocuments();

    query = query.skip(startIndex).limit(limit);

    //Executing query
    const rentalCars = await query;
    //Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit,
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      };
    }

    res.status(200).json({
      success: true,
      count: rentalCars.length,
      pagination,
      data: rentalCars,
    });
  } catch (err) {
    res.status(200).json({ success: false });
  }
};

//@desc     Get single rental cars
//@route    GET /api/v1/rentalCars/:id
//@access   Public
exports.getRentalCar = async (req, res, next) => {
  try {
    const rentalCar = await RentalCar.findById(req.params.id);

    if (!rentalCar) return res.status(400).json({ success: false });

    res.status(200).json({ success: true, data: rentalCar });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

//@desc     Create new rental cars
//@route    POST /api/v1/rentalCars
//@access   Private
exports.createRentalCar = async (req, res, next) => {
  const rentalCar = await RentalCar.create(req.body);
  res.status(201).json({ success: true, data: rentalCar });
};

//@desc     Update rental car
//@route    PUT /api/v1/rentalCars/:id
//@access   Private
exports.updateRentalCar = async (req, res, next) => {
  try {
    const rentalCar = await RentalCar.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!rentalCar) {
      return res.status(400).json({ success: false });
    }

    res.status(200).json({ success: true, data: rentalCar });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

//@desc     Delete rental cars
//@route    DELETE /api/v1/rentalCars/:id
//@access   Private
exports.deleteRentalCar = async (req, res, next) => {
  try {
    const rentalCar = await RentalCar.findById(req.params.id);

    if (!rentalCar) {
      return res.status(404).json({
        success: false,
        message: `Bootcamp not found with id of ${req.params.id}`,
      });
    }

    //console.log(hospital);

    await rentalCar.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};
