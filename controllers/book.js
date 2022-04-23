/*
- This contain all logic for category controller.
- Whenever user will make a CRED ,that req will be called in controller
*/
const jwt = require('jsonwebtoken')
const db = require('../models');
const authConfig = require('../config/auth');


const secretKey = authConfig.secretKey;
const Book = db.book;
const User = db.user;

// create and save a category
const create = async(req,res) => {
    let { ISBN,name, author, publishedOn, addedOn} = req.body
    
    //create category object in db
    let book = {
        ISBN,
        name, 
        author, 
        publishedOn, 
        addedOn
    }; 

    Book.create(book).then((resp) => {
        res.status(201).send({ 
            message:'Book is created successfully',
            data: book,
            resp
        })
    }).catch((err) => {
        res.status(500).send({
            message: err.message,
        })
    })


}

// Delete an existing category
const deleteBook = async(req, res) => {
    let id = req.params.id; 

    Book.destroy({
        where: { id },
        returing: true,
    }).then((resp) => {
        if(resp === 0){
            return res.status(403).send({ 
                message: `No book found with this ID ${id}`
            })
        }
        res.status(201).send({ 
            message:'Book is deleted successfully',
            resp
        })
    }).catch((err) => {
        res.status(500).send({
            message: err.message,
        })
    })
}


// Find by findAll
const findAll = async(req, res) => {
    
    Book.findAll().then((resp) => {
        
        if(resp.length == 0){
            return res.status(200).send({
                message:'NO BOOKS FOUND.....!'
            });
        }
        res.status(200).send(resp);
    }).catch(err => {
        res.status(500).send({
            message: err.message
        })
    })

    
}

// USER controller
const rent = async(req, res) => {
    let { ISBN, id} = req.body;
    console.log('--------------> 1',id)
    console.log('--------------> 11',user_Id)
    let Id;
    let token = req.headers['x-access-token'];
    if(!ISBN){
        return res.status(403).send({
            message: 'ISBN number is required' 
        })
    }

    Book.findOne({
        where: { 
            ISBN: ISBN
        }
    }).then((resp) => {
        console.log('-------------->',id)
        jwt.verify(token, secretKey, (err,decoded) => {
            if(err){
                return res.status(401).send({
                    message: 'Unauthorized',
                    err:err.message
                });
            }
    
            if(!resp){
                return res.status(200).send({
                    message:'NO BOOKS FOUND.....!'
                });
            }
            let userId = decoded.id;
            Id = decoded.id;
            User.findOne({
                where: {
                    id: userId
                }
            }).then(async(user) => {
                let data = await user.getBooks();
                data.map(book => {
                    if(book.ISBN == ISBN){
                        return res.status(400).send({
                            message: `This book ${'"'}${book.name}${'"'} already you have rented with ISBN ->${book.ISBN}...!`
                        })
                    }
                })
                console.log('--------------> 2',Id)
                if(data.length < 2){
                    user.addBooks(resp).then(()=>{
                        res.status(200).send({
                            message:"Book rent Successfully",
                        })
        
                    }).catch(err => {
                        res.status(500).send({
                            message: err.message
                        })
                    })
                } else {
                    res.status(400).send({
                        message:"Already rent book count is 2.You can't rent more than two books..\nThank you..!"
                    })
                }
            }).catch(err => {
                res.status(500).send({
                    message: err.message
                })
            })    
            
        })
       
    }).catch(err => {
        res.status(500).send({
            message: err.message
        })
    })

    
}

const getRentBook = async(req, res) => {
    let  id  = req.params.id;
    if(!id){
        return res.status(400).send({
            message: "Invalid UserId"
        })
    }
    User.findOne({
        where: {
            id
        }
    }).then(async(user) => {
        let data = await user.getBooks();
        res.status(200).send(data)
    }).catch(err => {
        res.status(500).send({
            message: err.message
        })
    })    

    
}

module.exports = { 
    create,
    deleteBook,
    findAll,
    rent,
    getRentBook
};