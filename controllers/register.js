const handleRegister = (req, res, db, bcrypt) => {
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
		.catch(err => res.status(400).json('Unable to register'))
	}

	module.exports = {
		handleRegister: handleRegister
	}