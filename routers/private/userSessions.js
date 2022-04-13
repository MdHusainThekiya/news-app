const tokenController = require("../../controllers/tokenController");
const authentication = require("../../middlewares/authentication");
const express = require("express");
const router = express.Router();

router.get("/", authentication.verifyUser,tokenController.readData);
router.delete("/:sessionKey", authentication.verifyUser,tokenController.deleteData);

module.exports = router
