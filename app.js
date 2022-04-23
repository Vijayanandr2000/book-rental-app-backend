const express = require('express');
const serverConfig = require('./config/server.config');
const db = require('./models');

var user_Id = 0;

const app = express();

app.use(express.json());

const init = () =>{
    var rolesdata = [
        {
            id: 1,
            name: "user"
        },
        {
            id: 2,
            name:"admin"
        },
        
    ]
    db.role.bulkCreate(rolesdata).then(()=>{
        console.log("Role's are created successfully");
    }).catch((err)=>{
        console.log("Role's are not created",err.message);
    })
}



db.sequelize.sync({force: true}).then(()=>{
    console.log(`DB Table's are updated`);
    init()
}).catch(err=>{
    console.log(err.message)
})

app.get('/',(req,res)=>{
    res.send('SERVER SIDE IS STARTED');
})

require('./routes/book')(app)
require('./routes/auth')(app)

app.listen(serverConfig.PORT,async() => {
    console.log(`server starts in PORT ${serverConfig.PORT}`);
    try {
        await db.sequelize.authenticate();
        console.log('DB connected successfully');
    } catch (error) {
        console.log("DB is not connected", error.message);
    }
});