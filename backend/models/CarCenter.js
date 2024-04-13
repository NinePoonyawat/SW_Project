const sql = require("../config/carCenterDB");

//constructor
const CarCenter = function (carCenter) {
  this.id = carCenter.id;
  this.name = carCenter.name;
  this.tel = carCenter.tel;
};

CarCenter.getAll = (result) => {
  sql.query("SELECT * FROM carCenters", (err, res) => {
    if (err) {
      console.log("err: ", err);
      result(null, err);
      return;
    }
    console.log("carCenters: ", res);
    result(null, res);
  });
};

module.exports = CarCenter;
