/* eslint-disable @typescript-eslint/no-floating-promises */
import env from './config/env';
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongodb.helper';

MongoHelper.connect(env.mongoUrl)
  .then(async () => {
    const app = (await import('./config/app')).default;
    app.listen(env.port, () => {
      console.log(`Server running at http://localhost:${env.port}`);
    });
  })
  .catch(console.error);
