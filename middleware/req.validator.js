const db = require('../models')

const validateBookReq = (req,res,next) => {
    let { ISBN,name, author, publishedOn, addedOn} = req.body
    if(!ISBN && !name && !author && !publishedOn && !addedOn){
        res.status(400).send({ 
            message: "Data's required"
        })
        return;
    }
    next();
}

const validateBookisbnReq = (req, res,next) => {
    let { ISBN } = req.body;

    if(ISBN){
        db.book.findOne({
            where:{
                ISBN
            }
        }).then(resp=>{
            if(resp){
                res.status(400).send({ 
                    message: "ISBN Already exist"
                })
                return;
            }
            next()
        }).catch(err=>{
            res.status(500).send({ 
                message: err.message
            })
            return;
        })
    } else{
        res.status(400).send({ 
            message: "ISBN is required"
        })
        return;
    }
}

module.exports = {
    validateBookReq,
    validateBookisbnReq
}