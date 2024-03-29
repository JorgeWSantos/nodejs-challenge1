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

    select(table, search) {
        let data = this.#database[table] ?? []

        if (search) {
            data = data.filter(row => {
                return Object.entries(search).some(([key, value]) => {
                    return row[key].toLowerCase().includes(value.toLowerCase())
                })
            })
        }

        return data
    }

    insert(table, data) {
        if (Array.isArray(this.#database[table]))
            this.#database[table].push(data)
        else
            this.#database[table] = [data]

        this.#persist()

        return data
    }

    delete(table, id) {
        const rowIndex = this.#database[table]
            ? this.#database[table].findIndex(row => row.id === id)
            : -1

        if (rowIndex > -1) {
            this.#database[table].splice(rowIndex, 1)
            this.#persist()
        }

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
                updated_at: data.updated_at,
                completed_at: data.completed_at ?? null,
            }

            this.#database[table][rowIndex] = newTask

            this.#persist()

            return newTask
        }

        return null
    }
}