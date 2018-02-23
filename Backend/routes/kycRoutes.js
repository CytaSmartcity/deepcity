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
    var kyc_contract = new web3.eth.Contract(kyc_ABI, kyc_address);
    kycContract.methods.getPersonDetails().call({from: user_public_address}).then(details => {
        res.status(200).json({
            first_name: web3.utils.hexToUtf8(details["first_name"]),
            last_name: web3.utils.hexToUtf8(details["last_name"]),
            id_number: web3.utils.hexToUtf8(details["id_number"]),
            phone_number: web3.utils.hexToUtf8(details["phone_number"]),
            district: web3.utils.hexToUtf8(details["district"]),
            post_code: web3.utils.hexToUtf8(details["post_code"],
            home_address: web3.utils.hexToutf8(details["home_address"]),
            status:  web3.utils.hexToUtf8(details["status"])
        });
    })
});

router.post('/create', (req, res) => {

})


module.exports = router