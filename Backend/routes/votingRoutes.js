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
    voting_contract.methods.getImprovmentList().call({from: user_public_address}).then(improvments => {
        if(improvments.length > 0) {
            var actions = improvments.map((improvment) => {
                var results = voting_contract.methods.getImprovmentsInformation(improvment).call({from: user_public_address}).then(details => {
                    var votings = voting_contract.methods.improvmentVotes(improvment).call({from: user_public_address}).then(votes => {
                        return {
                            reference_no: web3.utils.hexToUtf8(improvment),
                            title: web3.utils.hexToUtf8(details["title"]),
                            description: web3.utils.hexToUtf8(details["description"]),
                            young: votes["young"],
                            middle: votes["middle"],
                            elder: votes["elder"],
                            total_yes: votes["total_yes"],
                            total_no: votes["total_no"],
                            total_votes: votes["total_votes"]
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
    if(req.body.age < 14)
        res.status(400).send("not legit age");
    else {
        var voting_contract = new web3.eth.Contract(voting_ABI, voting_address);
        voting_contract.methods.checkImprovment(web3.utils.fromAscii(req.body.reference_no)).call().then(improvment_exist => {
            if(!improvment_exist)
                res.status(400).send("Improvment doesnt exist")
            else {
                web3.eth.getTransactionCount(user_public_address, (err, count_val) => {
                    if(err)
                        res.status(500).send(err.toString());
                     else {
                         var age_type = "";
                         if(req.body.age >= 14 && req.body.age < 18) {
                             age_type = "Y"
                         }
                         else if(req.body.age >=18 && req.body.age < 60) {
                            age_type = "M"
                         }
                         else if(req.body.age >= 60) {
                            age_type = "E"
                         }

                        var rawTransactionObj = {
                            from: user_public_address,
                            to: voting_address,
                            nonce: count_val,
                            gasPrice: web3.utils.toHex(99000000000),
                            gasLimit: web3.utils.toHex(100000),
                            value: "0x0",
                            data : voting_contract.methods.voteImprovment(
                                web3.utils.fromAscii(req.body.reference_no),
                                web3.utils.fromAscii(req.body.vote_type),
                                web3.utils.fromAscii(age_type)
                            ).encodeABI()
                        }
                        var privKey = new Buffer(user_private_key.toLowerCase().replace('0x', ''), 'hex');
                        var tx = new EthereumTx(rawTransactionObj);

                        tx.sign(privKey);
                        var serializedTx = tx.serialize();
                        web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), (err, hash) => {
                            if (err)
                                res.status(500).send("Oops! Something went wrong. Please try again!");
                            else {
                                res.status(200).json({tx_hash: hash,message:"Thank you.the vote now is proceed"})
                            }
                        }); 
                     }
                });
            }
        });
    }
})

module.exports = router