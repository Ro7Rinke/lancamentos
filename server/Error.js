class Error {
    constructor(code, message, details, date, id) {
        this.code = code
        this.message = message
        this.details = details
        this.date = date
        this.is_error = true
        this.id = id
    }
}

module.exports = Error