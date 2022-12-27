export const generateRandomFileName = function (extension, length = 8) {
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
};

//resrialization to reduce nested object elements
export const redeserialize = function (
  object: object,
  elements: Array<any>,
  keysToDelete: string[]
) {
  elements.forEach((element) => {
    object[element.newKey] = element.data;
  });
  keysToDelete.forEach((key) => delete object[key]);
  return object;
};

// export const flattenObjectMapping = function (obj, mapping, prefix = "") {
//   return Object.keys(obj).reduce((acc, key) => {
//     const newKey = mapping && mapping[key] ? mapping[key] : key;
//     if (typeof obj[key] === "object") {
//       Object.assign(
//         acc,
//         flattenObjectMapping(obj[key], mapping, `${prefix}${newKey}_`)
//       );
//     } else {
//       acc[`${prefix}${newKey}`] = obj[key];
//     }
//     return acc;
//   }, {});
// };

export const flattenObject = function (obj, prefix = "") {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }
  return Object.keys(obj).reduce((acc, key) => {
    if (typeof obj[key] === "object") {
      Object.assign(acc, flattenObject(obj[key], `${prefix}${key}_`));
    } else {
      acc[`${prefix}${key}`] = obj[key];
    }
    return acc;
  }, {});
};

export const removeObjectKeys = function (obj, keys) {
  keys.forEach((key) => delete obj[key]);
  return obj;
};

export const getPagination = function (
  page: number,
  limit: number,
  defaultLimit: number
) {
  let pagination = {};
  if (page) {
    limit
      ? (pagination["take"] = Number(limit))
      : (pagination["take"] = defaultLimit);
    pagination["skip"] = Number((page - 1) * pagination["take"]);
  }
  return pagination;
};
