const articleController = require("../../controllers/articleController");
const articleValidation = require("../../middlewares/articleValidation");
const authentication = require("../../middlewares/authentication");
const express = require("express");
const router = express.Router();

router.get(
  "/",
  authentication.verifyUser,
  articleController.readData
);

router.post(
  "/",
  [
    authentication.verifyUser,
    authentication.verifyAdmin,
    articleValidation.validateNewsArticle,
    articleValidation.validateTitleForNewNewsArticle,
  ],
  articleController.createData
);

router.post("/fromapi", articleController.createDataFromApi);

router.put(
  "/:id",
  [
    authentication.verifyUser,
    authentication.verifyAdmin,
    articleValidation.validateNewsArticle,
  ],
  articleController.updateData
);

router.delete(
  "/:id",
  [authentication.verifyUser, authentication.verifyAdmin],
  articleController.deleteData
);

module.exports = router;
