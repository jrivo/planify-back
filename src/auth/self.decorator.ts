import { SetMetadata } from '@nestjs/common';

export interface SelfDecoratorParams {
    userIdParam: string;
    allowAdmins?: boolean;
}

export const Self = (params: SelfDecoratorParams | string) =>
    SetMetadata(
        'selfParams',
        typeof params == 'string' ? { userIdParam: params } : params,
    );