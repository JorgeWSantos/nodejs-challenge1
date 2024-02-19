import { createServer } from 'node:http';
import { routes } from './routes/route.js';

const server = createServer((req, res) => {

    const { method, url } = req;

    const route = routes.find(r => r.method === method && r.path === url)

    console.log(method, url)

    if (route) {
        return route.handler(req, res);
    }

    res.end('hello world')
});

server.listen(3333)