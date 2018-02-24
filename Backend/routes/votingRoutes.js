var express = require('express'),
    router = express.Router(),
    request = require('request'),
    requestpromise = require('request-promise'),
    Web3 = require('web3'),
    EthereumTx = require('ethereumjs-tx'),
    BigNumber = require('bignumber.js');

const   voting_ABI = require('../services/abi/votingABI.json'), 
        user_public_address = process.env.USER_PUBLIC_ADDRESS,
        user_private_key = process.env.USER_PRIVATE_KEY,
        voting_address = process.env.VOTING_ADDRESS,
        web3 = new Web3(new Web3.providers.HttpProvider(process.env.HOST_ENDPOINT));

router.get('/get', (req, res) => {
});

router.post('/create', (req, res) => {
});
        
module.exports = router