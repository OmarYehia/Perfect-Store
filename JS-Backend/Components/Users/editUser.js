const router = require("express").Router();
const usersSchema = require("./RegisterUserModel");
const jwt_decode = require("jwt-decode");
const globalUtilFunctions = require("./Util/UserUtilFunctions");
const connectionToDB = require("../DBConnector/ConnectionHandler");

router.post("/edit", async (req, res) => {
   connectionToDB.establishConnection();
   let responseObject;
   //console.log(req.body);
   let decoded = jwt_decode(req.body.token);

   //console.log(decoded);

   if (await globalUtilFunctions.checkIfExistInDatabase(req.body.email)) {
      responseObject = globalUtilFunctions.appendDataAndCodeToResponseMessage(
         400,
         "Email Already Exists"
      );
   } else {
      const userData = await globalUtilFunctions.getUserBackFromDatabase(decoded.email);
      console.log(userData._id);

      await usersSchema.findByIdAndUpdate(
         userData._id,
         { name: req.body.name },
         { new: true },
         function (err, model) {
            if (err) console.log(err);
            else console.log(model);
         }
      );
      /*    usersSchema.findByIdAndUpdate(
         userData._id,
         { name: req.body.name },
         { useFindAndModify: false },
         function (err, result) {
            if (err) {
               console.log(err);
            } else {
               console.log(result);
            }
         }
      ); */
   }

   res.send({ success: "YO" });
   connectionToDB.closeConnection();
});

module.exports = router;
