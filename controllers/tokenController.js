const userContoller = require("./userContoller");
const redisClient = require("../redisClient");

// insert token in redis from login-router
const insertTokenInRedis = async (token, decode) => {
  const userRawData = await userContoller.userDbConnect();
  let getUserDataByEmail = await userRawData.findOne({
    email: decode.email,
  });
  let sessionId = Math.floor(Math.random() * 9000000000) + 1000000000;
  await redisClient.redisClient.HSET(
    `${getUserDataByEmail.email}_SessionId_${sessionId}`,
    "Session_Token",
    `${token}`
  );
  await redisClient.redisClient.HSET(
    `${getUserDataByEmail.email}_SessionId_${sessionId}`,
    "userEmail",
    `${getUserDataByEmail.email}`
  );
  await redisClient.redisClient.HSET(
    `${getUserDataByEmail.email}_SessionId_${sessionId}`,
    "userName",
    `${[getUserDataByEmail.firstName, getUserDataByEmail.lastName].join(" ")}`
  );
  await redisClient.redisClient.HSET(
    `${getUserDataByEmail.email}_SessionId_${sessionId}`,
    "userId",
    `${getUserDataByEmail._id}`
  );
  await redisClient.redisClient.expire(
    `${getUserDataByEmail.email}_SessionId_${sessionId}`,
    `${decode.exp - decode.iat}`
  );
  console.log(
    `tokenObjectOf=> ${getUserDataByEmail.email}`,
    await redisClient.redisClient.HGETALL(`${getUserDataByEmail.email}`)
  );
};

// get all token sessions
const readData = async (req, res) => {
  try {
    let tokenData = [];
    let tokenKeys = await redisClient.redisClient.keys(`*`);
    for (const key of tokenKeys) {
      let value = await redisClient.redisClient.HGETALL(key);
      tokenData.push({ [key]: value });
    }

    // console.log("All Active sessions data =>", tokenData);
    return res.status(200).send({
      message: "All Active sessions data fetch successfully",
      totalCount: tokenData.length || 0,
      status: tokenData || [],
    });
  } catch (error) {
    console.log("unable to get Active sessions data =>", error.message);
    return res.status(400).send({
      message: "Failed to Get Active sessions",
      totalCount: error.length || 0,
      status: error.message || [],
    });
  }
};

// find one token in redis for authentication process
const findOneTokenInRedis = async (token) => {
  try {
    let tokenData = [];
    let tokenKeys = await redisClient.redisClient.keys(`*`);
    for (const key of tokenKeys) {
      let value = await redisClient.redisClient.HGETALL(key);
      tokenData.push({ [key]: value });
    }
    const activeTokenArray = [];
    for (const session of tokenData) {
      activeTokenArray.push(Object.values(session)[0].Session_Token);
    }
    return !(activeTokenArray.indexOf(token) === -1);
  } catch (error) {
    return console.log("Unable to get find the token In Redis");
  }
};

const deleteData = async (req, res) => {
  try {
    await redisClient.redisClient.DEL(req.params.sessionKey);
    return res.send({
      message: `Successfully deleted the session : ${req.params.sessionKey}`,
      totalCount: 1,
      status: [],
    });
  } catch (error) {
    console.log("unable to delete the data =>", error.message);
    return res.status(400).send({
      message: "invalid input data",
      totalCount: 0,
      status: error.message || [],
    });
  }
};

module.exports = {
  insertTokenInRedis,
  readData,
  findOneTokenInRedis,
  deleteData,
};
