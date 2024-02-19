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
            this.#database[table].push()
        else
            this.#database[table] = [data]

        return data
    }

    delete(table) {
        this.#database[table] = {}
    }
}