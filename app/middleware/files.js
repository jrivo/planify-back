const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const { CDN_URL, CDN_STORAGE_ZONE, CDN_ACCESS_KEY, CDN_STORAGE_PATH } = require("../const/const");
const { generateRandomFileName, sanitizeFileName } = require("../utils/utils");

uploadFiles = (req, res, next) => {
  console.log("FILES MIDDLEWARE");
  fileNames = [];
  if (req.files) {
    req.files.forEach((file) => {
      // futureName = generateRandomFileName(file.originalname.split(".")[1]);
      const url =
        CDN_URL +
        CDN_STORAGE_ZONE +
        "/" +
        CDN_STORAGE_PATH +"/" +
        sanitizeFileName(file.originalname);
      //TODO: handle case where file name contains multiple dots
      // const url = CDN_URL + CDN_STORAGE_ZONE + "/default/" + futureName;
      console.log(url)
      const options = {
        method: "PUT",
        headers: {
          AccessKey: CDN_ACCESS_KEY,
          "Content-Type": "octet-stream",
          "Content-Length": file.buffer.length,
        },
        body: file.buffer,
      };

      fetch(url, options)
        .then((res) => {
          res.json();
        })
        .then((json) => console.log(json))
        .catch((err) => console.error("error:" + err));
    });
  }
  next();
};

const fileMiddlewares = {
  uploadFiles,
};

module.exports = fileMiddlewares;
