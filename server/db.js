const sqlite3 = require('sqlite3').verbose()
const Error = require('./Error')
const uuidv4 = require('uuid').v4

const paths = {
    db: `${__dirname}/db.db`,
}

const errors = {
    'db-1': {
        message: 'Error opening database'
    },
    'db-2': {
        message: 'Error reading from database'
    }, 
    'db-3': {
        message: 'Error inserting from database'
    }, 
}

const logToFile = (error) => {
    fs.writeFileSync(`${paths.log_dir}/${Date.now()}.log`, JSON.stringify(error))
}

const openDatabase = (path) => {
    let response = null

    let db = new sqlite3.Database(path, (error) => {
        if (error) {
            let date = Date.now()
            let code = 'db-1'
            let message = `${errors[code].message}`
            let details = JSON.stringify(error)
            let error_id = 'openDatabase'
            logToFile(new Error(code, message, details, date, error_id))
            response = new Error(code, message, details, date, error_id)
            return
        }
    })

    // if (response == null)
    //     return db

    return response
}

const readLancamentos = (mes, ano) => {
    return new Promise((resolve, reject) => {
        let db = openDatabase(paths.db)

        if(!db)
            reject()

        let sql = `SELECT * FROM lancamentos WHERE mes = (?) AND ano = (?)`
        let params = [mes, ano]

        db.all(sql, params, (error, rows) => {
            if(error){
                let date = Date.now()
                let code = 'db-2'
                let message = `${errors[code].message}`
                let details = JSON.stringify(error)
                let error_id = 'readLancamentos'
                logToFile(new Error(code, message, details, date, error_id))
                reject()
            }
            resolve(rows)
        })
    })
}

const createLancamento = (lancamento) => {
    return new Promise((resolve, reject) => {
        let db = openDatabase(paths.db)

        if(!db)
            reject()

        let sql = `INSERT INTO lancamentos(id, dia, mes, ano, titulo, valor_total, parcelas, debito, categoria_id) values (?,?,?,?,?,?,?,?,?)`
        let params = [
            uuidv4(),
            lancamento.dia,
            lancamento.mes,
            lancamento.ano,
            lancamento.titulo,
            lancamento.valor_total,
            lancamento.parcelas,
            lancamento.debito,
            lancamento.categoria_id
        ]

        db.run(sql, params, (error) => {
            if (error) {
                let date = Date.now()
                let code = 'db-3'
                let message = `${errors[code].message}`
                let details = JSON.stringify(error)
                let error_id = 'createLancamento'
                logToFile(new Error(code, message, details, date, error_id))
                reject()
            }
            resolve()
        })

    })
}

const readCategoria = (id) => {
    return new Promise((resolve, reject) => {
        let db = openDatabase(paths.db)

        if(!db)
            reject()

        let sql = `SELECT * FROM categoria WHERE id = (?)`
        let params = [id]

        db.get(sql, params, (error, row) => {
            if(error){
                let date = Date.now()
                let code = 'db-2'
                let message = `${errors[code].message}`
                let details = JSON.stringify(error)
                let error_id = 'readCategoria'
                logToFile(new Error(code, message, details, date, error_id))
                reject()
            }
            resolve(row)
        })
    })
}

module.exports = {
    paths,
    readLancamentos,
    createLancamento,
    readCategoria,
}