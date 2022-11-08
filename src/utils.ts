export const  generateRandomFileName = function (extension, length = 8) {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result + "." + extension;
  };
  
  export const sanitizeFileName = (fileName) => {
    return fileName.replace(/ /g, "_").replace(/[^a-zA-Z0-9.]/g, "");
  }