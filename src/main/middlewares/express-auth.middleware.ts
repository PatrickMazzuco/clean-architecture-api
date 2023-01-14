import {
  ExpressMiddleware,
  ExpressMiddlewareAdapter
} from '../adapters/express/express-middleware.adapter';
import { makeAuthMiddleware } from '../factories/middlewares/auth-middleware.factory';
import { AccountRole } from '@/domain/entities';

export { AccountRole as AuthRole };

export class ExpressAuthMiddlewareFactory {
  static create(role?: AccountRole): ExpressMiddleware {
    return ExpressMiddlewareAdapter.adapt(makeAuthMiddleware(role));
  }
}
