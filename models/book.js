/*
==>Category Schema:
    1.id
    2.name
    3.description
*/

module.exports = (sequelize, Sequelize) => {
    const Book = sequelize.define('book', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        ISBN:{
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        author: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        publishedOn:{
            type: Sequelize.STRING,
            allowNull: false,
        },
        addedOn:{
            type: Sequelize.STRING,
            allowNull: false,
        }
    },
    {
        tableName: 'books'
    });
    return Book;
}