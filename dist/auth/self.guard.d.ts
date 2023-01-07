import { CanActivate, ExecutionContext } from "@nestjs/common";
export declare class SelfGuard implements CanActivate {
    constructor();
    canActivate(context: ExecutionContext): Promise<boolean>;
}
