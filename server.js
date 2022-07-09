const express = require('express');
const es6Renderer = require('express-es6-template-engine');
const app = express();
const pool = require("./db");

app.engine('html', es6Renderer)
app.set('views','templates')
app.set('view engine','html');
app.use(express.urlencoded({extended:false}))
app.use(express.json()); //=> req.body
//app.use(express.static(__dirname+'/public'));

let loggedUser;
//ROUTES//

// HOME PAGE
app.get('/home', function(req, res){
    res.render('home.html');
    //res.sendFile(__dirname+'/frontend/index.css');
})

//SIGN UP PAGE
app.get('/signup', function(req,res){
    res.render('signup.html');
    //res.sendFile(__dirname+'/frontend/index.css');
})

//create a user
app.post("/signup",async(req,res)=>{
    try {
        const username = req.body.username;
        const password = req.body.password;
        const email = req.body.email;
        console.log(username)
        const newUser = await pool.query(
            "insert into userinfo (username, password, email) values ($1,$2,$3)",[username,password,email]
        );
        //res.json(newUser);
        loggedUser=username;
        res.redirect('/home')
        console.log(loggedUser);
    } catch (error) {
        console.error(error.message);
    }
})

//log into user

app.get('/loginUser',async(req,res)=>{
    try {
        const username = req.query.logInUsername
        const password = req.query.logInPassword
        console.log(username)
        console.log(password)
        const loggedInUser = await pool.query(
            "SELECT (username, password) from userinfo WHERE username = ($1) and password = ($2)",[username,password]
        )
        res.redirect('/home')
    } catch (error) {
        console.log(error.message);
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

app.listen(3001,()=>{
    console.log("Server is listening on port 3001")
});