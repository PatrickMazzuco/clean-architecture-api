import { NextFunction, Request, Response } from 'express';

import { IMiddleware, HttpRequest } from '@/presentation/protocols';

export type ExpressMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

export class ExpressMiddlewareAdapter {
  static adapt(middleware: IMiddleware): ExpressMiddleware {
    return async (req: Request, res: Response, next: NextFunction) => {
      const httpRequest: HttpRequest = {
        headers: req.headers
      };

      const httpResponse = await middleware.handle(httpRequest);
      if (httpResponse.statusCode >= 200 && httpResponse.statusCode <= 299) {
        Object.assign(req, httpResponse.body);
        next();
      } else {
        res.status(httpResponse.statusCode).json({
          error: httpResponse.body.message
        });
      }
    };
  }
}
