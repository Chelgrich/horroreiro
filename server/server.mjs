import { createServer } from 'node:http';

import {
  createPortableRuntime,
  createRequestFromNodeMessage,
  writeResponseToNodeMessage
} from './runtime.js';

const port = Number(process.env.PORT || 4179);
const host = process.env.HOST || '0.0.0.0';
const runtime = createPortableRuntime();

const server = createServer(async (nodeRequest, nodeResponse) => {
  try {
    const request = await createRequestFromNodeMessage(nodeRequest);
    const response = await runtime.handleRequest(request);

    await writeResponseToNodeMessage(nodeResponse, response, {
      head: nodeRequest.method === 'HEAD'
    });
  } catch (error) {
    console.error('Portable runtime request failed:', error);
    nodeResponse.writeHead(500, {
      'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
      'Content-Type': 'text/plain; charset=utf-8'
    });
    nodeResponse.end('Internal Server Error');
  }
});

server.listen(port, host, () => {
  console.log(`Horroreiro portable runtime listening on http://${host}:${port}`);
});
