import { createServer } from 'node:http';

const server = createServer((req, res) => {

    const { method, url } = req;

    if (method === 'GET' && url.includes('/tasks'))
        return res.end('GET')

    if (method === 'POST' && url.includes('/tasks'))
        return res.end('POST')

    console.log(method, url)

    res.end('hello world')
});

server.listen(3333)