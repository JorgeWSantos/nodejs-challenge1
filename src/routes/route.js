export const routes = [
    {
        method: 'GET',
        path: '/tasks',
        handler: (req, res) => {
            return res.end('GET Tasks')
        }
    },
    {
        method: 'POST',
        path: '/tasks',
        handler: (req, res) => {
            return res.end('POST Tasks')
        }
    }
]