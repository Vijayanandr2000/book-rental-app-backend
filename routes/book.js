const { 
    create,
    deleteBook,
    findAll,
    rent,
    getRentBook
} = require('../controllers/book');
const { validate, authJwt } = require('../middleware')

module.exports = function(app) {
    app.post('/book/api/v1/create', [validate.validateBookReq, validate.validateBookisbnReq, authJwt.verifyToken, authJwt.isAdmin], create)

    app.delete('/book/api/v1/book/:id',[authJwt.verifyToken ,authJwt.isAdmin], deleteBook)

    app.get('/book/api/v1/list', findAll)

    // USER routes
    app.post('/book/api/v1/rent',[authJwt.verifyToken], rent)
    app.get('/book/api/v1/rent/:id',[authJwt.verifyToken], getRentBook)
}