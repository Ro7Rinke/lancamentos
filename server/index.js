const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser')
const {
    createLancamento,
    readCategoria,
} = require('./db')

app.use(bodyParser.urlencoded({ extended: false }))

app.post('/lancamento/criar', (req, res) => {

    
})

app.get('/categoria/read', (req, res) => {
    readCategoria(req.query.id)
        .then((data) => {
            res.status(200).send(data)
        })
        .catch((error) => {
            res.status(404).send(error)
        })
})

app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`)
})