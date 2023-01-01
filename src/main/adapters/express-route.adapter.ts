import { Request, Response } from 'express';

import { Controller, HttpRequest } from '@/presentation/protocols';

export class ExpressRouteAdapter {
  static adapt(
    controller: Controller
  ): (req: Request, res: Response) => Promise<void> {
    return async (req: Request, res: Response) => {
      const httpRequest: HttpRequest = {
        body: req.body
      };

      const httpResponse = await controller.handle(httpRequest);
      res.status(httpResponse.statusCode).json(httpResponse.body);
    };
  }
}
