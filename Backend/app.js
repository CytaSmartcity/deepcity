var express = require('express'),
bodyParser = require('body-parser'),
helmet = require('helmet'),
cors = require('cors'),
app = express()

require('dotenv').config();

const port = process.env.PORT;

var kycRouter = require('./routes/kycRoutes');

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.use('/kyc', kycRouter);

app.listen(port, (err) => {
    console.log(`running server on port ${port}`);
});
