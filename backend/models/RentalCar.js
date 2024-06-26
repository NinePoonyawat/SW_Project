const mongoose = require("mongoose");

const carData = {
  Acura: ["ILX", "MDX", "RDX", "RLX", "TLX"],
  "Alfa Romeo": ["Giulia", "Stelvio"],
  "Aston Martin": ["DB11", "DBS Superleggera", "Vantage"],
  Audi: [
    "A3",
    "A4",
    "A5",
    "A6",
    "A7",
    "A8",
    "Q3",
    "Q5",
    "Q7",
    "Q8",
    "R8",
    "TT",
  ],
  Bentley: ["Bentayga", "Continental GT", "Flying Spur"],
  BMW: [
    "2 Series",
    "3 Series",
    "4 Series",
    "5 Series",
    "6 Series",
    "7 Series",
    "8 Series",
    "X1",
    "X2",
    "X3",
    "X4",
    "X5",
    "X6",
    "X7",
    "Z4",
  ],
  Bugatti: ["Chiron", "Divo"],
  Buick: ["Enclave", "Encore", "Envision", "Regal"],
  Cadillac: ["CT4", "CT5", "Escalade", "XT4", "XT5", "XT6"],
  Chevrolet: [
    "Blazer",
    "Camaro",
    "Corvette",
    "Equinox",
    "Malibu",
    "Silverado",
    "Suburban",
    "Tahoe",
    "Trailblazer",
    "Traverse",
    "Trax",
  ],
  Chrysler: ["300", "Pacifica", "Voyager"],
  Citroen: ["C3", "C4", "C5 Aircross", "C6"],
  Dodge: ["Challenger", "Charger", "Durango", "Grand Caravan", "Journey"],
  Ferrari: [
    "488 GTB",
    "812 Superfast",
    "F8 Tributo",
    "Portofino",
    "Roma",
    "SF90 Stradale",
  ],
  Fiat: ["500", "500X", "500L"],
  Ford: [
    "Bronco",
    "Edge",
    "Escape",
    "Expedition",
    "Explorer",
    "F-150",
    "Mustang",
    "Ranger",
  ],
  Genesis: ["G70", "G80", "G90"],
  GMC: ["Acadia", "Canyon", "Sierra", "Terrain", "Yukon"],
  Honda: [
    "Accord",
    "Civic",
    "CR-V",
    "Fit",
    "HR-V",
    "Insight",
    "Odyssey",
    "Passport",
    "Pilot",
    "Ridgeline",
  ],
  Hyundai: [
    "Accent",
    "Elantra",
    "Kona",
    "Palisade",
    "Santa Fe",
    "Sonata",
    "Tucson",
    "Veloster",
  ],
  Infiniti: ["Q50", "Q60", "QX50", "QX60", "QX80"],
  Jaguar: ["E-Pace", "F-Pace", "F-Type", "I-Pace", "XE", "XF", "XJ"],
  Jeep: [
    "Cherokee",
    "Compass",
    "Gladiator",
    "Grand Cherokee",
    "Renegade",
    "Wrangler",
  ],
  Kia: [
    "Forte",
    "K5",
    "Niro",
    "Optima",
    "Rio",
    "Seltos",
    "Sorento",
    "Soul",
    "Sportage",
    "Stinger",
    "Telluride",
  ],
  Lamborghini: ["Aventador", "Huracan", "Urus"],
  "Land Rover": [
    "Defender",
    "Discovery",
    "Discovery Sport",
    "Range Rover",
    "Range Rover Evoque",
    "Range Rover Sport",
    "Range Rover Velar",
  ],
  Lexus: ["ES", "GS", "GX", "IS", "LC", "LS", "LX", "NX", "RC", "RX", "UX"],
  Lincoln: [
    "Aviator",
    "Continental",
    "Corsair",
    "MKZ",
    "Nautilus",
    "Navigator",
  ],
  Lotus: ["Evora", "Exige"],
  Maserati: ["Ghibli", "Levante", "Quattroporte"],
  Mazda: ["CX-3", "CX-30", "CX-5", "CX-9", "Mazda3", "Mazda6", "MX-5 Miata"],
  McLaren: ["570S", "720S", "Artura", "GT"],
  "Mercedes-Benz": [
    "A-Class",
    "C-Class",
    "E-Class",
    "G-Class",
    "GLA",
    "GLB",
    "GLC",
    "GLE",
    "GLS",
    "S-Class",
    "SL",
    "SLC",
  ],
  Mini: ["Clubman", "Countryman", "Cooper", "Hardtop"],
  Mitsubishi: ["Eclipse Cross", "Mirage", "Outlander", "Outlander Sport"],
  Nissan: [
    "Altima",
    "Armada",
    "Frontier",
    "Kicks",
    "Leaf",
    "Maxima",
    "Murano",
    "Pathfinder",
    "Rogue",
    "Sentra",
    "Titan",
    "Versa",
  ],
  Porsche: [
    "718 Boxster",
    "718 Cayman",
    "911",
    "Cayenne",
    "Macan",
    "Panamera",
    "Taycan",
  ],
  Ram: ["1500", "2500", "3500"],
  "Rolls-Royce": ["Cullinan", "Dawn", "Ghost", "Phantom", "Wraith"],
  Subaru: ["Ascent", "Crosstrek", "Forester", "Impreza", "Legacy", "Outback"],
  Suzuki: ["Ciaz", "Swift", "Vitara"],
  Tesla: ["Model 3", "Model S", "Model X", "Model Y"],
  Toyota: [
    "4Runner",
    "Avalon",
    "Camry",
    "Corolla",
    "Highlander",
    "Land Cruiser",
    "Prius",
    "RAV4",
    "Sienna",
    "Tacoma",
    "Tundra",
    "Yaris",
  ],
  Volkswagen: [
    "Arteon",
    "Atlas",
    "Golf",
    "Jetta",
    "Passat",
    "Tiguan",
    "Touareg",
  ],
  Volvo: ["S60", "S90", "V60", "V90", "XC40", "XC60", "XC90"],
};

const RentalCarSchema = new mongoose.Schema(
  {
    carBrand: {
      type: String,
      enum: Object.keys(carData),
      required: [true, "Please provide the car brand"],
    },
    model: {
      type: String,
      required: [true, "Please provide the car model"],
      validate: {
        validator: function (value) {
          const allowedModels = carData[this.carBrand];
          return allowedModels.includes(value);
        },
        message: (props) =>
          `${props.value} is not a valid model for the selected car brand`,
      },
    },
    pricePerDay: {
      type: Number,
      required: [true, "Please provide the car rental price"],
    },
    year: {
      type: Number,
      required: [true, "Please provide the manufacturing year"],
    },
    color: {
      type: String,
      required: [true, "Please provide the car color"],
    },
    licensePlate: {
      type: String,
      required: [true, "Please provide the license plate number"],
    },
    mileage: {
      type: Number,
      default: 0,
    },
    fuelType: {
      type: String,
      enum: ["Gasoline", "Diesel", "Electric", "Hybrid"],
      required: true,
    },
    transmission: {
      type: String,
      enum: ["Manual", "Automatic"],
      required: true,
    },
    seats: {
      type: Number,
      required: true,
    },
    rented: {
      type: Boolean,
      default: false, // Initially, the car is not rented
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//Reserve populate with virtuals
RentalCarSchema.virtual("rental", {
  ref: "Rental",
  localField: "_id",
  foreignField: "rentalCar",
  justOne: false,
});

//Cascade delete rentals when a hospital is deleted
RentalCarSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    console.log(`Rental being removed from rental car ${this._id}`);
    await this.model("Rental").deleteMany({ rentalCar: this._id });
    next();
  }
);

RentalCarSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "rentalCar",
});

RentalCarSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    console.log(`Deleting reviews associated with rental car ${this._id}`);
    await this.model("Review").deleteMany({ rentalCar: this._id });
    next();
  }
);
module.exports = mongoose.model("RentalCar", RentalCarSchema);
