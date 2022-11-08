import { SetMetadata } from "@nestjs/common";

export const Entity = (entity: any) => SetMetadata('entity', entity);