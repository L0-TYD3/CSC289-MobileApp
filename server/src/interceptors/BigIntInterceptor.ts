import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class BigIntInterceptor implements NestInterceptor {
  intercept(_: ExecutionContext, next: CallHandler<any>): Observable<any> {
    return next.handle().pipe(map((data) => this.reserializeBigInt(data)));
  }

  private reserializeBigInt(obj: any): any {
    if (obj === null || obj === undefined) return obj;

    //Handle BigInts
    if (typeof obj === 'bigint') return obj.toString();

    //Handle arrays recursively
    if (Array.isArray(obj))
      return obj.map((item) => this.reserializeBigInt(item));

    // Handle objects recursively
    if (typeof obj === 'object')
      return Object.keys(obj).reduce((acc, key) => {
        acc[key] = this.reserializeBigInt(obj[key]);
        return acc;
      }, {});

    return obj;
  }
}
