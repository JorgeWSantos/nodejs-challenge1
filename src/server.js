import { createServer } from 'node:http';
import { json } from './middleware/json.js';
import { routes } from './routes/route.js';

const server = createServer(async (req, res) => {

    const { method, url } = req;

    await json(req, res);

    const route = routes.find(r => r.method === method && r.path === url)

    if (route) {
        return route.handler(req, res);
    }

    res.writeHead(400).end(JSON.stringify({ success: false }))
});

server.listen(3333)