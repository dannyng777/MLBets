const express = require('express');
const es6Renderer = require('express-es6-template-engine');
const app = express();
const pool = require("./db");
const session = require('express-session')

app.engine('html', es6Renderer)
app.set('views','templates')
app.set('view engine','html');
app.use(express.urlencoded({extended:false}))
app.use(express.json()); //=> req.body
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
  }))
//app.use(express.static(__dirname+'/public'));

let loggedUser;
let loggedUserId;
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

//BET HISTORY PAGE
app.get('/bethistory', function(req, res){
    res.render('bet_history.html');
    //res.sendFile(__dirname+'/frontend/index.css');
})

//create a user
app.post("/signup",async(req,res)=>{
    try {
        const username = req.body.username;
        const password = req.body.password;
        const email = req.body.email;
        
        //console.log(username)
        const newUserID = await pool.query(
            "insert into userinfo (username, password, email) values ($1,$2,$3) returning user_id",[username,password,email]
        );
        console.log(newUserID.rows[0].user_id);
        req.session.username = newUserID.rows[0].user_id;
        res.redirect('/home')
        //console.log(loggedUser);
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
        const id = req.params;
        const deleteUser = await pool.query(
            "DELETE FROM userinfo WHERE user_id = $1",[id]
        )
        res.json(`User id = ${id} was deleted`)
    } catch (error) {
        console.error(error.message);
    }
})


/* GET home page. */
// app.get('/users/:', function (req, res, next) {
//     res.render('index', {
//       user: req.session.user,
//       menus: req.session.menus,
//       menu_active: req.session.menu_active['/'] || {},
//       title: '首页'
//     });
//   });


//Log in to user
app.get('/loggedinUser', async (req,res)=>{
    try {
        // console.log('hello world');
        const correctUser = req.query.loggedusername
        const correctPass = req.query.loggedpassword
        
        console.log(correctUser,correctPass)
        const loggedinAcc = await pool.query(
            "SELECT * FROM userinfo where username = ($1) and password = ($2)",[correctUser,correctPass]
        )
        console.log(loggedinAcc.rows[0].user_id);
        loggedUserId=loggedinAcc.rows[0].user_id
        // console.log(loggedUserId)
        res.render('useraccount.html');
        return loggedUserId
    } catch (error) {
        console.error(error.message);
    }
})

//Get bet history

app.get("/bethistory11", async (req,res)=>{
    try {
        console.log(loggedUserId,'DANs')
        const history = await pool.query(
            `SELECT * FROM history WHERE user_id = ($1)`,[loggedUserId]
        )
        console.log(history.rows[0].user_id, 'user_id');
        console.log(history.rows[0].winnings, 'winnings');
        console.log(history.rows[0].losses, 'losses');
        console.log(history.rows[0].bets, 'bets');
        // res.send('Hellooo');

        res.render('bet_history',{
            locals: {
                userwin:history.rows[0].winnings,
                userloss: history.rows[0].losses,
                userbets:history.rows[0].bets
            }
        })
    } catch (error) {
        console.error(error.message);
    }
})

//user wallet
app.get("/wallet",async(req,res)=>{
    const {id} = req.params
    try {
        const userwallet = await pool.query(
            "SELECT (wallet) from walletinfo WHERE user_id = ($1)",[req.session.username]
        )
        console.log(userwallet)
        console.log(req.session.username)
        res.render('wallet',{
            locals: {
                walletValue: userwallet
            }
        })
    } catch (error) {
        console.error(error.message);
    }
    console.log(req.params);
})
app.listen(3001,()=>{
    console.log("Server is listening on port 3001")
});