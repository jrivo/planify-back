
const fs = require("fs");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const { CDN_URL, CDN_STORAGE_ZONE, CDN_ACCESS_KEY } = require("../const/const");

isAdminOrModerator = function (role) {
  if (role == "ADMIN" || role == "MODERATOR") {
    return true;
  }
  return false;
};

isAdmin = function (role) {
  if (role == "ADMIN") {
    return true;
  }
  return false;
};

isModerator = function (role) {
  if (role == "MODERATOR") {
    return true;
  }
  return false;
};

// uploadFile = function (file, fileName, path = "default") {
//   //save file to temp folder
//   const writeStream = fs.createWriteStream(fileName)
//   const url =
//     CDN_URL + CDN_STORAGE_ZONE + "/" + (path ? path : "path") + "/" + fileName;
//   //binaryData is from base64Data to binary
//   const binaryData = Buffer.from(base64Data, "base64").toString("binary");
//   const options = {
//     method: "PUT",
//     headers: {
//       AccessKey: CDN_ACCESS_KEY,
//       "Content-Type": "octet-stream",
//       "Content-Length": binaryData.length,
//     },
//     body: binaryData,
//   };
//   console.log(binaryData)

//   fetch(url, options)
//     .then((res) => res.json())
//     .then((json) => console.log(json))
//     .catch((err) => console.error("error:" + err));
// };

generateRandomFileName = function (extension, length = 8) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result + "." + extension;
};

sanitizeFileName = (fileName) => {
  return fileName.replace(/ /g, "_").replace(/[^a-zA-Z0-9.]/g, "");
}

module.exports = {
  isAdminOrModerator,
  isAdmin,
  isModerator,
  generateRandomFileName,
  sanitizeFileName
};
