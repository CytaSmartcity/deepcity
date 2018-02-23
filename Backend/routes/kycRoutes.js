var express = require('express'),
router = express.Router(),
request = require('request'),
requestpromise = require('request-promise'),
Web3 = require('web3'),
EthereumTx = require('ethereumjs-tx'),
BigNumber = require('bignumber.js');

const   user_public_address = process.env.USER_PUBLIC_ADDRESS,
    user_private_key = process.env.USER_PRIVATE_KEY,
    kyc_ABI = require('../services/abi/kycABI.json'),
    kyc_address = process.env.KYC_ADDRESS,
    web3 = new Web3(new Web3.providers.HttpProvider(process.env.HOST_ENDPOINT));

router.get('/get', (req, res) => {

});

router.post('/create', (req, res) => {
    
})


module.exports = router