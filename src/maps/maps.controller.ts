import { Controller, Get, Param, Query, Res, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { Roles } from "src/auth/roles.decorator";
import { RolesGuard } from "src/auth/roles.guard";
import { MapsService } from "./maps.service";

@Controller("address-details")
export class MapsController {
    constructor(private readonly mapsService: MapsService) {}
  @Get()
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles("ADMIN","MERCHANT","MODERATOR")
  async getAll(@Res() res, @Query() queries: any) {
    this.mapsService.fetchAddressinfo(queries).then((response) => {
        res.status(200).send(response.data);
    }).catch((error) => {
        res.status(400).send(error)
    })
  }
}
