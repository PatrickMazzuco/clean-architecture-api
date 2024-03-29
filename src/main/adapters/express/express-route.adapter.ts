import { Request, Response } from 'express';

import { IController, HttpRequest } from '@/presentation/protocols';

export class ExpressRouteAdapter {
  static adapt(
    controller: IController
  ): (req: Request, res: Response) => Promise<void> {
    return async (req: Request, res: Response) => {
      const httpRequest: HttpRequest = {
        body: req.body
      };

      const httpResponse = await controller.handle(httpRequest);
      if (httpResponse.statusCode >= 200 && httpResponse.statusCode <= 299) {
        res.status(httpResponse.statusCode).json(httpResponse.body);
      } else {
        res.status(httpResponse.statusCode).json({
          error: httpResponse.body.message
        });
      }
    };
  }
}
