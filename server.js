const express = require('express');
const app = express();
const pool = require("./db");

app.use(express.json()); //=> req.body

//ROUTES//

// HOME PAGE
app.get('/home', function(req, res){
    res.sendFile(__dirname+'/frontend/index.html');
    //res.sendFile(__dirname+'/frontend/index.css');
})

//SIGN UP PAGE
app.get('/', function(req,res){
    res.sendFile(__dirname+'/frontend/signup.html');
    //res.sendFile(__dirname+'/frontend/index.css');
})

//create a user
app.post("/newUsers",async(req,res)=>{
    try {
        console.log(req.body.username)
        const username = req.body.username;
        const password = req.body.password;
        const email = req.body.email;
        console.log(username)
        const newUser = await pool.query(
            "insert into userinfo (username, password, email) values ($1,$2,$3)",[username,password,email]
        );
        res.json(newUser);
    } catch (error) {
        console.error(error.message);
    }
})

//get all users
app.get('/users',async(req,res)=>{
    try {
        const allUsers = await pool.query(
            "SELECT * FROM userinfo");
        res.json(allUsers.rows); // <-- rows[] first
    } catch (error) {
        console.error(error.message)
    };
})

//get one user
app.get("/users/:id",async(req,res)=>{
    const {id} = req.params
    try {
        const user = await pool.query(
            "select * from userinfo where user_id = $1",[id]
        )
        console.log(user.rows)
        res.json(user.rows);
    } catch (error) {
        console.error(error.message);
    }
    console.log(req.params);
})

//update a user (username/pass/email)

//delete a user
app.delete("/users/:id",async(req,res)=>{
    try {
        const {id} = req.params;
        const deleteUser = await pool.query(
            "DELETE FROM userinfo WHERE user_id = $1",[id]
        )
        res.json(`User id = ${id} was deleted`)
    } catch (error) {
        console.error(error.message);
    }
})
//

app.listen(3000,()=>{
    console.log("Server is listening on port 3000")
});