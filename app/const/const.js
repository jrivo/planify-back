const CDN_URL = process.env.CDN_URL;
const CDN_STORAGE_ZONE = process.env.CDN_STORAGE_ZONE;
const CDN_STORAGE_PATH = process.env.CDN_STORAGE_PATH;
const CDN_ACCESS_KEY = process.env.CDN_ACCESS_KEY;
const TEMP_FILES_FOLDER = "/var/www/spaces/planify/temp/";

module.exports = {
  CDN_URL,
  CDN_STORAGE_ZONE,
  CDN_STORAGE_PATH,
  CDN_ACCESS_KEY,
  TEMP_FILES_FOLDER,
}