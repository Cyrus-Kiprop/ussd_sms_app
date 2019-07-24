const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));

// schema
const contactSchema = new mongoose.Schema({
	name: String,
	telephone_number: String
});

const ContactsModel = mongoose.model('ContactModel', contactSchema);


app.post(`/create-contacts`, (req, res) => {
	const data = new ContactsModel(req.body);
	console.log(req.body);
	data.save().then((result) => {
		res.status(200).json(result);
	}).catch((err) => {
		res.status(500).send({ message: 'could not save the data into the database' })
	});
})

app.get('/contacts', (req, res) => {
	ContactsModel.find().then((result) => {

		res.json(result);
	}).catch((err) => {
		res.json(err.stack);
	});

})

app.post('/send_sms', (req, res) => {
	const data = req.body;
	// console.log(data);

	ContactsModel.find({ telephone_number: data.telephone_number }).then((result) => {
		// console.log(result);
		var num = result; //unefined
		console.log(num)
		let tel = [];
		num.map(item => {
			tel.push(item.telephone_number);
		})
		// console.log(tel);
		const options = {
			username: 'loopedin',
			apiKey: '7309123852693bc2a7112f239eccc42521f2e4a0b134af8a0b6fe8935fa93efb'
		};

		// initialize africastalking gateway
		const africastalking = require('africastalking')(options);

		// sms object of africastalking package
		const sms = africastalking.SMS;

		// sending parameters
		const sending_options = {
			to: tel,
			message: 'Dev cheers!!!',
			from: 'LakeHub'
		};

		// send sms
		sms.send(sending_options)
			.then(response => {
				console.log(response);
				res.send(response);
			})
			.catch(error => {
				console.log(error);
				res.send(error);
			});
	}).catch((err) => {
		res.status(500).send({ message: `the number does not exist ${err}` })
		console.log(err);
	});


});
mongoose
	.connect('mongodb://localhost/sms-app', { useNewUrlParser: true })
	.then(() => {
		app.listen(port, () => console.log(`Academy app running on port ${port}`));
	})
	.catch(error => {
		console.log({
			message: `Unable to establish a connection to the server ${error}`
		});
	});


