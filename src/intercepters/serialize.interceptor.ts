import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';

export class SerializeInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    // Run something before a request is handled by the request handler
    console.log("I'm running before the handler", context);

    return next.handle().pipe(
      map((data) => {
        // Run something before the response is sent out
        console.log("I'm running before response is sent out", data);
      }),
    );
  }
}
