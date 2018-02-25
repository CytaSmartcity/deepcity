var express = require('express'),
router = express.Router(),
request = require('request'),
requestpromise = require('request-promise'),
Web3 = require('web3'),
EthereumTx = require('ethereumjs-tx'),
BigNumber = require('bignumber.js');

const   user_public_address = process.env.USER_PUBLIC_ADDRESS,
        user_private_key = process.env.USER_PRIVATE_KEY,
        erc20_ABI = require('../services/abi/erc20ABI.json'), 
        erc20_address = process.env.ERC20_ADDRESS,
        kyc_ABI = require('../services/abi/kycABI.json'),
        kyc_address = process.env.KYC_ADDRESS,
        web3 = new Web3(new Web3.providers.HttpProvider(process.env.HOST_ENDPOINT));

router.get('/balance', (req, res) => {
    var token_contract = new web3.eth.Contract(erc20_ABI, erc20_address)
    token_contract.methods.balanceOf(user_public_address).call({from: user_public_address}).then(balance => {
        res.status(200).send( new BigNumber(balance).div(new BigNumber(10).pow(18)));
    });
})

router.get('/get', (req, res) => {
    var kyc_contract = new web3.eth.Contract(kyc_ABI, kyc_address);
    kyc_contract.methods.getPersonDetails().call({from: user_public_address}).then(details => {
        if(web3.utils.hexToUtf8(details["first_name"]) != "") {
            res.status(200).json({
                first_name: web3.utils.hexToUtf8(details["first_name"]),
                last_name: web3.utils.hexToUtf8(details["last_name"]),
                id_number: web3.utils.hexToUtf8(details["id_number"]),
                phone_number: web3.utils.hexToUtf8(details["phone_number"]),
                birth_year: details["birth_year"],
                district: web3.utils.hexToUtf8(details["district"]),
                post_code: web3.utils.hexToUtf8(details["post_code"]),
                home_address: web3.utils.hexToUtf8(details["home_address"]),
                status:  web3.utils.hexToUtf8(details["status"])
            });
        }
        else
            res.status(400).send("Kyc not found")
    })
});

router.post('/create', (req, res) => {
    var kyc_contract = new web3.eth.Contract(kyc_ABI, kyc_address); 
    kyc_contract.methods.addPersonDetails(
        web3.utils.fromAscii(req.body.first_name),
        web3.utils.fromAscii(req.body.last_name), 
        web3.utils.fromAscii(req.body.id_number),
        web3.utils.fromAscii(req.body.phone_number),
        req.body.birth_year,
        web3.utils.fromAscii(req.body.district),
        web3.utils.fromAscii(req.body.post_code),
        web3.utils.fromAscii(req.body.home_address)
    ).estimateGas({from: user_public_address},(err, gasLimit) => {
        if(err)
            res.status(500).send("Oops! Something went wrong. Please try again!");
        else {
            web3.eth.getTransactionCount(user_public_address, (err, count_val) => {
                if(err)
                    res.status(500).send(err.toString());
                else {
                    var rawTransactionObj = {
                        from: user_public_address,
                        to: kyc_address,
                        nonce: count_val,
                        gasPrice: web3.utils.toHex(99000000000),
                        gasLimit: web3.utils.toHex(350000),
                        value: "0x0",
                        data : kyc_contract.methods.addPersonDetails(
                            web3.utils.fromAscii(req.body.first_name),
                            web3.utils.fromAscii(req.body.last_name), 
                            web3.utils.fromAscii(req.body.id_number),
                            web3.utils.fromAscii(req.body.phone_number),
                            req.body.birth_year,
                            web3.utils.fromAscii(req.body.district),
                            web3.utils.fromAscii(req.body.post_code),
                            web3.utils.fromAscii(req.body.home_address)
                        ).encodeABI()
                    }
                    var privKey = new Buffer(user_private_key.toLowerCase().replace('0x', ''), 'hex');
                    var tx = new EthereumTx(rawTransactionObj);
    
                    tx.sign(privKey);
                    var serializedTx = tx.serialize();
                    web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), (err, hash) => {
                        if (err)
                            res.status(500).send("Oops! Something went wrong. Please try again!");
                        else
                            res.status(200).json({tx_hash: hash,message:"Great! we will approve you within 24h"})
                    }); 
                }
            });
        }
    });
})


module.exports = router