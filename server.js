const express = require('express');
const bodyParser = require('body-parser');
var multer  = require('multer')
var upload = multer({ dest: 'public/uploads' })
var mailgun = require('mailgun-js');

const mg = mailgun({apiKey: API_KEY, domain: DOMAIN});
const app = express();

const PORT = process.env.PORT || 8080;

var fs = require('fs');
var path = require('path')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));


var storage = multer.diskStorage({
	destination: function(req, file, callback) {
		callback(null, './uploads')
	},
	filename: function(req, file, callback) {
		console.log(file)
		callback(null, file.originalname)
	}
})

console.log(__dirname);
app.use( express.static( `${__dirname}/client/build` ) );

app.post('/api/form', upload.single('attachment'), (req, res) => {
  console.log("sending mail to" ,req.body, req.at);
  var filepath = path.join(__dirname, `uploads/${req.body.fileName}`);
    
    const data = {
      from: 'Excited User <me@samples.mailgun.org>',
      to: req.body.recipient,
      subject: req.body.subject,
      text: req.body.message,
      attachment: filepath
    };
    mg.messages().send(data, (resp, two) => {
      console.log(resp, two);
      res.send({'success': true});
    })
  
 
 
});
var type = upload.single('image');
app.post('/api/upload_file',  (req, res) => {
  console.log("sending mail to" ,req.file);
  var upload = multer({
		storage: storage
	}).single('image')
	upload(req, res, function(err) {
		res.end('File is uploaded')
	})
 
 
});


app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});