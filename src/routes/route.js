import { randomUUID } from 'node:crypto';
import { Database } from "../database/database.js";
import { buildRoutePath } from "../utils/build-route-path.js";

const database = new Database();
const table = 'tasks'

export const routes = [
    {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const tasks = database.select(table)
            return res.writeHead(200).end(JSON.stringify(tasks))
        }
    },
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            console.log('req.body', req.body)
            const { title } = req.body

            const task = {
                id: randomUUID(),
                title,
            }

            database.insert(table, task)
            return res.writeHead(200).end('POST Tasks')
        }
    },
    {
        method: 'DELETE',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params;
            database.delete(table, id)
            return res.writeHead(200).end('DELETE Tasks')
        }
    }
]