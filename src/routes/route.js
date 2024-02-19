import { Database } from "../database/database.js";

const database = new Database();
const table = 'tasks'

export const routes = [
    {
        method: 'GET',
        path: '/tasks',
        handler: (req, res) => {
            const tasks = database.select(table)
            return res.writeHead(200).end(JSON.stringify(tasks))
        }
    },
    {
        method: 'POST',
        path: '/tasks',
        handler: (req, res) => {
            console.log('req', req.body)
            database.insert(table, req.body)
            return res.writeHead(200).end('POST Tasks')
        }
    },
    {
        method: 'DELETE',
        path: '/tasks',
        handler: (req, res) => {
            // console.log('req', req.body)
            database.delete(table)
            return res.writeHead(200).end('DELETE Tasks')
        }
    }
]