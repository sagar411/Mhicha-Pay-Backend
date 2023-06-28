require("dotenv").config(".env");

PORT = process.env.PORT;
HOST_NAME = process.env.HOST_NAME;
DB_URL =process.env.DB_URL;
DB_NAME= process.env.DB_NAME;
CLIENT_ID =process.env.CLIENT_ID;
CLIENT_SECRETS = process.env.CLIENT_SECRETS;
REDIRECT_URI=process.env.REDIRECT_URI;
REFRESH_TOKEN=process.env.REFRESH_TOKEN;
EMAIL =process.env.EMAIL;
JWT_SECRET = process.env.JWT_SECRET;

module.exports = {
    PORT,
    HOST_NAME,
    DB_URL,
    DB_NAME,
    CLIENT_ID,
    CLIENT_SECRETS,
    REDIRECT_URI,
    REFRESH_TOKEN,EMAIL,
    JWT_SECRET
}