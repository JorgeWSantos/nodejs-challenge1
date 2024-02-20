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
            const { title, description } = req.body

            const now = Date.now();

            const task = {
                id: randomUUID(),
                title,
                description,
                completed_at: null,
                created_at: now,
                updated_at: now,
            }

            const taskCreated = database.insert(table, task)
            return res.writeHead(200).end(JSON.stringify(taskCreated))
        }
    },
    {
        method: 'PUT',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params;
            const { title, description } = req.body;

            if (!title && !description)
                return res.writeHead(404)
                    .end(
                        JSON.stringify({ mensagem: 'title ou description são parâmetros necessários' })
                    )

            const now = Date.now();

            const taskUpdated = database.update(
                table,
                id,
                {
                    title,
                    description,
                    updated_at: now
                }
            )

            if (taskUpdated)
                return res.writeHead(200).end(JSON.stringify(taskUpdated))

            return res.writeHead(404).end()
        }
    },
    {
        method: 'DELETE',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params;
            const taskDeleted = database.delete(table, id)

            if (taskDeleted) {
                return res.writeHead(204).end()
            }

            return res.writeHead(404).end('Task Not Found')
        }
    }
]