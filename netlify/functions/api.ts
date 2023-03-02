import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import serverless from 'serverless-http';
import expressApp from './app/index.mjs';

const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext,
) => {
  const app = expressApp();
  const result = await serverless(app)(event, context);

  return {
    statusCode: 200,
    body: JSON.stringify(result),
  };
};

export { handler };
