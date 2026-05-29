import { CallHandler, ExecutionContext, NestInterceptor, UseInterceptors } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { plainToClass } from "class-transformer";

interface ClassConstrcutor {
    new (...args : any[]) : {}
}

export function Serialize(dto: ClassConstrcutor) { // This stops us from writing the whole signature
    return UseInterceptors(new SerializeInterceptor(dto))
}

export class SerializeInterceptor implements NestInterceptor {

    constructor(private dto : any) {} // Allows any DTOs instead of just one

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        // before the request is handled

        // Context is the representation of the route 
        // Next is the reprentation of the handler
        //  - A handler is a function or method responsible for processing specific incoming events or requests within the application
        
        return next.handle().pipe(
            map((data : any) => {
                // before the response is sent out

                return plainToClass(this.dto, data, {
                    excludeExtraneousValues: true
                }) 
            })
        )
    }
    
}