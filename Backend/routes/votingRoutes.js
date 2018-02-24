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
        token_public_address = process.env.TOKEN_PUBLIC_ADDRESS,
        token_private_address = process.env.TOKEN_PRIVATE_ADDRESS,
        voting_address = process.env.VOTING_ADDRESS,
        web3 = new Web3(new Web3.providers.HttpProvider(process.env.HOST_ENDPOINT));

router.get('/get', (req, res) => {
    var voting_contract = new web3.eth.Contract(voting_ABI, voting_address);
    voting_contract.methods.improvmentList().call({from: user_public_adddress}).then(improvments => {
        if(improvments.length > 0) {
            var actions = addresses.map((improvment) => {
                var results = voting_contract.methods.getImprovmentsInformation(web3.utils.hexToutf8(improvment["referenceNo"])).then(details => {
                    var votings = voting_contract.methods.improvmentVotes(web3.utils.hexToutf8(improvment["referenceNo"])).then(votes => {
                        return {
                            title: web3.utils.hexToUtf8(details["title"]),
                            description: web3.utils.hexToUtf8(details["description"]),
                            young: web3.utils.hexToUtf8(details["young"]),
                            middle: web3.utils.hexToUtf8(details["middle"]),
                            elder: web3.utils.hexToUtf8(details["elder"]),
                            total_yes: web3.utils.hexToUtf8(details["total_yes"]),
                            total_no: web3.utils.hexToUtf8(details["total_no"]),
                            total_votes: web3.utils.hexToUtf8(details["total_votes"]),
                        };
                    });
                    return votings;
                })
                return results;
            });
            
            return Promise.all(actions).then((improvmentsList) => {
                res.status(200).send(improvmentsList)  
            }).catch(error => {
                res.status(500).send("Error : "+ error)
            })
        }
    })
})

router.post('/create', (req, res) => {
});
        
module.exports = router