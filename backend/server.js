const express = require('express')
const cors = require('cors')
const api = express()

api.use(cors())

api.get('/', (req, res) => {
    res.json({ message : "express server says hi!"})
})

api.get('/test', (req, res) => {
    res.json({ message : "testing route"})
})

api.listen(3000, () => {{
    console.log("server running on port 3000")
}})
