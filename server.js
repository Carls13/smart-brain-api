const express = require('express')

//Dependencies
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt-nodejs')
const cors = require('cors')

//Controllers
const register = require('./controllers/register')
const signin = require('./controllers/signin')
const profile = require('./controllers/profile')
const image = require('./controllers/image')

const app = express();

//Database
const knex = require('knex')
const db = knex({
	client: 'pg',
	connection: {
		host: '127.0.0.1',
		user: 'postgres',
		password: 'secret',
		database: 'smart-brain'
	}
});

//Some testing
db.select('*').from('users').then(data => {
	console.log(data)
})

db.select('*').from('login').then(data => {
	console.log(data)
})

//Cors and parser
app.use(bodyParser.json());
app.use(cors())

//Endpoints
app.get('/', (req, res)=>{
	res.json(database.users)
})

app.post('/signin', (req, res) => {
	signin.handleSignin(req, res, db, bcrypt)
})

app.post('/register', (req, res) => {
	register.handleRegister(req, res, db, bcrypt)
})

app.get('/profile/:id', (req, res)=>{
	profile.handleProfile(req, res, db)
	})	
	

app.put('/image', (req, res) => {
	image.handleImage(req, res, db)
})

//Server running
app.listen(4000, () => {
	console.log('App is running on port 4000')
})