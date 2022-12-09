import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { PrismaClient } from '@prisma/client';
import { SelfDecoratorParams } from './self.decorator';

const prisma = new PrismaClient();

@Injectable()
export class SelfGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = await prisma.user.findUnique({
            where: { id: request.user.id },
        }) //Use passport authentication strategy

        //Priority on method meta
        let selfParams = this.reflector.get<SelfDecoratorParams>(
            'selfParams',
            context.getHandler(),
        );
        if (!selfParams)
            //Check for class meta
            selfParams = this.reflector.get<SelfDecoratorParams>(
                'selfParams',
                context.getClass(),
            );
        //If still no meta, pass
        if (!selfParams) return true;

        let allowAdmins = selfParams.allowAdmins || true;
        let userIdParam = selfParams.userIdParam;

        if (!user) return false;
        if (request.params[userIdParam] == user.id) return true;
        if (allowAdmins && user.role == Role.ADMIN) return true;
    }
}