import fs from 'node:fs/promises'

const databasePath = new URL('db.json', import.meta.url)

export class Database {
    #database = {}

    constructor() {
        fs.readFile(databasePath, 'utf-8')
            .then(data => this.#database = JSON.parse(data))
            .catch(() => {
                this.#persist()
            })
    }

    #persist() {
        fs.writeFile(databasePath, JSON.stringify(this.#database))
    }

    select(table) {
        return this.#database[table] ?? []
    }

    insert(table, data) {
        if (Array.isArray(this.#database[table]))
            this.#database[table].push(data)
        else
            this.#database[table] = [data]

        return data
    }

    delete(table, id) {
        const rowIndex = this.#database[table]
            ? this.#database[table].findIndex(row => row.id === id)
            : -1

        if (rowIndex > -1)
            this.#database[table].splice(rowIndex, 1)

        return rowIndex > -1 ? true : false
    }

    update(table, id, data) {
        const rowIndex = this.#database[table]
            ? this.#database[table].findIndex(row => row.id === id)
            : -1

        if (rowIndex > -1) {
            const task = this.#database[table][rowIndex];

            const newTask = {
                ...task,
                id,
                title: data.title ?? task.title,
                description: data.description ?? task.description,
                updated_at: data.updated_at
            }

            this.#database[table][rowIndex] = newTask

            return newTask
        }

        return null
    }
}