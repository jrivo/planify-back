// import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
// import { Reflector } from "@nestjs/core";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();
// @Injectable()
// export class OwnerAdminGuard implements CanActivate {
//   constructor(private reflector: Reflector) {}
//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     let entity = this.reflector.get<any>("entity", context.getHandler());
//     switch (entity) {
//       case "User":
//         entity = prisma.user;
//         break;
//       case "Place":
//         entity = prisma.place;
//         break;
//     }

//     const data = entity.findUnique({
//       where: { id: entity.id },
//     });
//     const request = context.switchToHttp().getRequest();
//     if (request?.user) {
//       console.log("USER", request.user);
//       return roles.includes(request.user.role);
//     }
//     return false;
//   }
// }
