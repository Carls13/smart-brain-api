const express = require('express')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt-nodejs')
const cors = require('cors')


const app = express();

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

db.select('*').from('users').then(data => {
	console.log(data)
})

db.select('*').from('login').then(data => {
	console.log(data)
})

app.use(bodyParser.json());
app.use(cors())

app.get('/', (req, res)=>{
	res.json(database.users)
})

app.post('/signin', (req, res) => {
	db.select('email', 'hash')
	.from('login')
	.where(
		'email', '=', req.body.email)
	.then(data=>{
		console.log(data)
		const isValid = bcrypt.compareSync(req.body.password, data[0].hash)
		if (isValid){
			return db.select('*').from('users').
			where('email', '=', req.body.email)
			.then(user => {
				res.json(user[0])
			})
			.catch(err => res.status(400).json('Unable to get user'))
		} else {
			res.status(400).json('Wrong credentials')
		}
	})
})

app.post('/register', (req, res) => {
	const { email, name, password } = req.body




	//Async way
	// bcrypt.hash(password, null, null, function(err, hash){
	// 	console.log(hash)
	// 	password = hash

	// })

	//Sync way
	const hash = bcrypt.hashSync(password)
	db.transaction(trx => {
		trx.insert({
			hash: hash,
			email: email
		})
		.into('login')
		.returning('email')
		.then(loginEmail => {
			console.log(loginEmail)
			console.log('here')
			return trx('users')
			.returning('*')
			.insert({
				email: loginEmail[0],
				name: name,
				joined: new Date()
			}).then(user => {
				res.json(user[0]);
			})
		})
		.then(trx.commit)
		.then(trx.rollback)
		})
		.catch(err => res.status(400).json('PLEAAASE Unable to register'))
	})

app.get('/profile/:id', (req, res)=>{
	const { id } = req.params;
	let found = false;
	db.select('*')
	.from('users')
	.where({id})
	.then(user =>{
		if (user.length){
			res.json(user[0])
		 } else{
			res.status(404).json('User not found')
		 }
		})
	})	
	

app.put('/image', (req, res) => {
	const { id } = req.body;
	db('users').where('id', '=', id)
	.increment('entries', 1)
	.returning('entries')
	.then(entries => {
		res.json(entries[0])
	})
	.catch( err => res.status(400).json("Unable to get entries"))
})





// bcrypt.compare("veggies", hash, function(err, res) {

// })


app.listen(4000, () => {
	console.log('App is running on port 4000')
})