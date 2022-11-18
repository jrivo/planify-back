import { Injectable } from "@nestjs/common";
import {
  CDN_ACCESS_KEY,
  CDN_STORAGE_PATH,
  CDN_STORAGE_ZONE,
  CDN_URL,
} from "src/const";
import { generateRandomFileName } from "src/utils";
import fetch from "cross-fetch";

@Injectable()
export class CdnService {
  async upload(req: any, files: any) {
    console.log("UPLOAD")
    files.forEach((file) => {
      const uploadName = generateRandomFileName(
        file.originalname.split(".")[1],
        20
      );
      file.uploadName = uploadName;
      const url =
        CDN_URL + CDN_STORAGE_ZONE + "/" + CDN_STORAGE_PATH + "/" + uploadName;
      //TODO: handle case where file name contains multiple dots
      // const url = CDN_URL + CDN_STORAGE_ZONE + "/default/" + futureName;
      const options = {
        method: "PUT",
        headers: {
          AccessKey: CDN_ACCESS_KEY,
          "Content-Type": "octet-stream",
          "Content-Length": file.buffer.length,
        },
        body: file.buffer,
      };
      console.log(url)
      fetch(url, options)
        .then((res) => {
          console.log(res)
          res.json();
        })
        .then((json) => {
          console.log(json);
          req.files.push(file);
        })
        .catch((err) => console.error("error:" + err));
    });
    return req;
  }
}
