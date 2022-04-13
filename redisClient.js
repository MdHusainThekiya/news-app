const { createClient } = require("redis");
const redisClient = createClient();

async function redisClientConnect() {
  try {
    let count = 0;
    const connecting = redisClient.on("error", (error) => {
      (count = count + 1),
        console.log(`ping:=>"${count + 1}", server is OFF =>`, error.message);
    });
    return (await connecting.connect(), console.log("Successfully Connected to Redis Server"))
  } catch (error) {
    console.log("Redis Client Error =>", error.message);
    return console.log("Redis Connection Error, try to re-start 'src/redis-server'");
  }
}

module.exports = {
  redisClient,
  redisClientConnect,
};

// // redis wala part in "userLogin.js" after token verified !!

// let getUserDataByEmail = await rawData.findOne({
//   email: decode.email,
// });
// const insertTokenInRedis = async () => {
//   await redisClient.redisClientConnect();
//   await redisClient.redisClient.HSET(
//     `${getUserDataByEmail._id}`,
//     "userId",
//     `${getUserDataByEmail._id}`
//   );
//   await redisClient.redisClient.HSET(
//     `${getUserDataByEmail._id}`,
//     "userName",
//     `${[getUserDataByEmail.firstName, getUserDataByEmail.lastName].join(" ")}`
//   );
//   await redisClient.redisClient.HSET(
//     `${getUserDataByEmail._id}`,
//     "userEmail",
//     `${getUserDataByEmail.email}`
//   );
//   await redisClient.redisClient.HSET(
//     `${getUserDataByEmail._id}`,
//     "token",
//     `${token}`
//   );
//   await redisClient.redisClient.expire(
//     `${getUserDataByEmail._id}`,
//     `${decode.exp - decode.iat}`
//   );
//   console.log(
//     `tokenObjectOf=> ${getUserDataByEmail.email}`,
//     await redisClient.redisClient.HGETALL(`${getUserDataByEmail._id}`)
//   );
// };
// insertTokenInRedis();