import { Injectable } from "@nestjs/common";
import { GMAPS_API_KEY } from "src/const";
import axios from "axios";

@Injectable()
export class MapsService {
  async fetchAddressinfo(queries: any) {
    return await axios.get(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${queries.placeId}&fields=geometry&key=${GMAPS_API_KEY}`
    );
  }
}
