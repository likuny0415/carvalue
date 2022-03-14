import { CallHandler, ExecutionContext, NestInterceptor, UseInterceptors } from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { map, Observable } from "rxjs";

export function Serialize(dto: any) {
    return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {

    constructor(private dto: any) {}

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        // run something before the request is handled

        
        return next.handle().pipe(
            map((data: any) => {
                // run something before the response is sent out
                
               return plainToClass(this.dto, data, {
                   excludeExtraneousValues: true
               })
            } )
        )
    }
    
} 