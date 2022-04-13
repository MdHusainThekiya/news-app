const mongoClient = require("../mongoClient");
const userContoller = require("./userContoller");
const mongodb = require("mongodb");
const categoryController = require("./categoryController");
const jsonwebtoken = require("jsonwebtoken");
const axios = require("axios");
const { compare } = require("bcrypt");
const databaseName = process.env.DATABASE_NAME || "NewsAPI";
const collectionName = "newsArticleDb";

// create userDb collection
async function newsArticleDbConnect() {
  try {
    let connecting = await mongoClient.client.connect();
    return connecting.db(databaseName).collection(collectionName);
  } catch (error) {
    console.log(
      "failed to connect with newsArticle database =>",
      error.message
    );
    return res.status(400).send({
      message: "failed to connect with newsArticle database",
      totalCount: 0,
      status: error.message || [],
    });
  }
}

// READ newsArticle Data
const readData = async (req, res) => {
  try {
    let rawData = await newsArticleDbConnect();
    let processedData = await rawData.find().toArray();

    if (processedData && Object.keys(processedData).length > 0) {
      console.log("newsArticle data =>", processedData);
      return res.status(200).send({
        message: "newsArticle data fetch successfully",
        totalCount: processedData.length || 0,
        status: processedData || [],
      });
    } else {
      console.log(processedData);
      return res.status(404).send({
        message: "newsArticle data not found",
        totalCount: processedData.length || 0,
        status: [processedData, "zero entries in user database"] || [],
      });
    }
  } catch (error) {
    console.log("unable to get newsArticle data =>", error.message);
    return res.status(404).send({
      message: "newsArticle data Not Found",
      totalCount: error.length || 0,
      status: error.message || [],
    });
  }
};

// Create newsCatagory // NOTE: for createData, inputs are seperately validated in middleware.
const createData = async (req, res) => {
  try {
    const token = req.header("token");
    const decode = jsonwebtoken.verify(token, process.env.JWT_SECRET_KEY);
    let userRawData = await userContoller.userDbConnect();
    let findUserDataByEmailInDb = await userRawData.findOne({
      email: decode.email,
    });
    let categoryRawData = await categoryController.newsCatagoryDbConnect();
    let findCategoryByTitleInDb = await categoryRawData.findOne({
      title: req.body.category,
    });
    if (!findCategoryByTitleInDb) {
      console.log("Category Not Found, Pl enter Valid Category");
      return res.status(404).send({
        message: "Category Not Found, Pl enter Valid Category",
        totalCount: 0,
        status: 'enter valid "category"' || [],
      });
    }
    let rawData = await newsArticleDbConnect();
    let processedData = await rawData.insertOne({
      author: [
        findUserDataByEmailInDb.firstName,
        findUserDataByEmailInDb.lastName,
      ].join(" "),
      title: req.body.title,
      category: findCategoryByTitleInDb,
      description: req.body.description,
      content: req.body.content,
      sourceName: req.body.sourceName,
      sourceUrl:req.body.sourceUrl,
      imageUrl: req.body.imageUrl,
      publishedAt: new Date().toISOString(),
      updatedBy: [
        findUserDataByEmailInDb.firstName,
        findUserDataByEmailInDb.lastName,
      ].join(" "),
      updatedAt: new Date().toISOString(),
    });
    console.log("successfully created newsArticle =>", processedData);
    return res.status(201).send({
      message: "newsArticle created successfully",
      totalCount: 1,
      status:
        [processedData, await rawData.findOne({ title: req.body.title })] || [],
    });
  } catch (error) {
    console.log("unable to post/create newsArticle =>", error.message);
    return res.status(404).send({
      message: "unable to post/create newsArticle",
      totalCount: error.length || 0,
      status: error.message || [],
    });
  }
};

// CREATE DATA BY IMPORTING FROM NEWS-API
const createDataFromApi = async (req, res) => {
  try{
  const token = req.header("token");
  
    const categoryResponse = await axios.get(
      `http://localhost:${process.env.PORT}/newscategory/`,
      {
        headers: {
          token: `${token}`,
        },
      }
    );
  let rawData = await newsArticleDbConnect();
  let categoryRawData = await categoryController.newsCatagoryDbConnect();

  const compare = (a, b)=>{
    if ( a.updatedAt > b.updatedAt ){
      return -1;
    }
    if ( a.updatedAt < b.updatedAt ){
      return 1;
    }
    return 0;
  }

  for (const category of categoryResponse.data.status) {
    const articleResponse = await axios.get(
      `https://newsapi.org/v2/top-headlines?country=in&category=${category.title}&apiKey=bb83896dffe54918a691b053fb6ee20a`
    )
    const articlesOfSingleCategory = articleResponse.data.articles
    for (const article of articlesOfSingleCategory) {
      let findCategoryByTitleInDb = await categoryRawData.findOne({
        title: category.title,
      });
      findExistingArticleInCategory = await rawData.findOne({
        title : article.title
      })
      if(findExistingArticleInCategory){
        console.log('article already in DB');
        continue
      }
      await rawData.insertOne({
        author: article.author || 'Admin',
        title: article.title,
        category: findCategoryByTitleInDb || 'general',
        description: article.description,
        content: article.content,
        sourceName: article.source.name,
        sourceUrl:article.url,
        imageUrl: article.urlToImage,
        publishedAt: article.publishedAt,
        updatedBy: article.author || 'Admin',
        updatedAt: article.publishedAt,
      })
      let processedRawData = await rawData.find().toArray()
      let sortedRawData = processedRawData.sort(compare)
      let oldObjectInArray = sortedRawData[sortedRawData.length - 1]
      if(sortedRawData.length > 200){
        await rawData.deleteOne({
          title : oldObjectInArray.title
        })
      }
    }
  }
  console.log("successfully created newsArticle =>");
    return res.status(201).send({
      message: "newsArticle created successfully",
      totalCount: (await rawData.find().toArray()).length,
      status:
        [await rawData.find().toArray()] || [],
    });
  } catch(error){
    console.log("unable to post/create newsArticle from API =>", error);
    return res.status(404).send({
      message: "unable to post/create newsArticle from API",
      totalCount: error.length || 0,
      status: error.message || [],
    });
  }
  // console.log(categories);

  

  // const response = await axios.get('https://newsapi.org/v2/top-headlines?country=in&category=business&apiKey=bb83896dffe54918a691b053fb6ee20a')
  // return res.send(JSON.stringify(response.data));
};

// UPDATE DATA
const updateData = async (req, res) => {
  try {
    const token = req.header("token");
    const decode = jsonwebtoken.verify(token, process.env.JWT_SECRET_KEY);
    let userRawData = await userContoller.userDbConnect();
    let findUserDataByEmailInDb = await userRawData.findOne({
      email: decode.email,
    });
    let categoryRawData = await categoryController.newsCatagoryDbConnect();
    let findCategoryByTitleInDb = await categoryRawData.findOne({
      title: req.body.category,
    });
    if (!findCategoryByTitleInDb) {
      console.log("Category Not Found, Pl enter Valid Category");
      return res.status(404).send({
        message: "Category Not Found, Pl enter Valid Category",
        totalCount: 0,
        status: 'enter valid "category"' || [],
      });
    }
    let rawData = await newsArticleDbConnect();
    let processedData = await rawData.updateOne(
      { _id: new mongodb.ObjectId(req.params.id) },
      {
        $set: {
          title: req.body.title,
          category: findCategoryByTitleInDb,
          description: req.body.description,
          content: req.body.content,
          sourceName: req.body.sourceName,
          sourceUrl:req.body.sourceUrl,
          imageUrl: req.body.imageUrl,
          updatedBy: [
            findUserDataByEmailInDb.firstName,
            findUserDataByEmailInDb.lastName,
          ].join(" "),
          updatedAt: new Date().toISOString(),
        },
      }
    );
    console.log("successfully updated newsArticle =>", processedData);
    return res.status(201).send({
      message: "newsArticle updated successfully",
      totalCount: 1,
      status:
        [processedData, await rawData.findOne({ title: req.body.title })] || [],
    });
  } catch (error) {
    console.log("unable to put/update newsArticle =>", error.message);
    return res.status(404).send({
      message: "unable to put/update newsArticle",
      totalCount: error.length || 0,
      status: error.message || [],
    });
  }
};

// DELETE DATA
const deleteData = async (req, res) => {
  try {
    let rawData = await newsArticleDbConnect();
    let findObjectById = await rawData.findOne({
      _id: new mongodb.ObjectId(req.params.id),
    });
    if (findObjectById) {
      let deletedData = await rawData.deleteOne({
        _id: new mongodb.ObjectId(req.params.id),
      });
      console.log("newsArticle deleted successfully =>", deletedData);
      return res.status(200).send({
        message: "newsArticle deleted successfully",
        totalCount: deletedData.length || 1,
        status: [deletedData, findObjectById] || [],
      });
    } else {
      console.log("newsArticle with given ID not found");
      return res.status(404).send({
        message: "newsArticle with given ID not found",
        totalCount: findObjectById.length || 0,
        status: "invalid ID" || [],
      });
    }
  } catch (error) {
    console.log("enter valid newsArticle ID =>", error.message);
    return res.status(404).send({
      message: "enter valid newsArticle ID, Catagory Not Found",
      totalCount: 1,
      status: error.message || [],
    });
  }
};

module.exports = {
  newsArticleDbConnect,
  readData,
  createData,
  createDataFromApi,
  updateData,
  deleteData,
};
