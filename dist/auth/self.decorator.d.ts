export interface SelfDecoratorParams {
    userIdParam: string;
    allowAdmins?: boolean;
}
export declare const Self: (params: SelfDecoratorParams | string) => import("@nestjs/common").CustomDecorator<string>;
