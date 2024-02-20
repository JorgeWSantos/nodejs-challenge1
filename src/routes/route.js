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
            const { search } = req.query;
            const tasks = database.select(
                table,
                search ? {
                    title: search,
                    description: search
                } : null)

            return res.writeHead(200).end(JSON.stringify(tasks))
        }
    },
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { title, description } = req.body

            if (!title || !description)
                return res.writeHead(404)
                    .end(
                        JSON.stringify({ mensagem: 'title and description são parâmetros necessários' })
                    )

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

            const [task] = database.select(table, { id })

            if (!task)
                return res.writeHead(404)
                    .end(
                        JSON.stringify({ mensagem: 'task not fount' })
                    )

            const now = Date.now();

            const taskUpdated = database.update(
                table,
                id,
                {
                    ...task,
                    title,
                    description,
                    updated_at: now
                }
            )

            return res.writeHead(200).end(JSON.stringify(taskUpdated))
        }
    },
    {
        method: 'DELETE',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params;

            const [task] = database.select(table, { id })

            if (!task)
                return res.writeHead(404)
                    .end(
                        JSON.stringify({ mensagem: 'task not fount' })
                    )

            database.delete(table, id)

            return res.writeHead(204).end()
        }
    },
    {
        method: 'PATCH',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params;
            const { completed } = req.body;

            const [task] = database.select(table, { id })

            if (!task)
                return res.writeHead(404)
                    .end(
                        JSON.stringify({ mensagem: 'task not fount' })
                    )
            const now = Date.now()

            const taskUpdated = database.update(table, id, {
                ...task,
                id,
                completed_at: completed ? now : null
            })

            return res.writeHead(200)
                .end(
                    JSON.stringify(taskUpdated)
                )
        }
    }
]