const express = require('express');
const app = express();
const port = 3000;

app.post('/send_sms', (req, res) => {
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
		to: ['0726158347','0718714785', '0773787543'],
		message: 'Hey guys this is a test message from LH Academy',
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
});


app.listen(port, () => console.log(`Academy app running on port ${port}`));

