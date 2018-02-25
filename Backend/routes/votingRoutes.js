var express = require('express'),
    router = express.Router(),
    twilio = require('../services/twilio'),
    request = require('request'),
    requestpromise = require('request-promise'),
    Web3 = require('web3'),
    EthereumTx = require('ethereumjs-tx'),
    BigNumber = require('bignumber.js');

const   voting_ABI = require('../services/abi/votingABI.json'), 
        erc20_ABI = require('../services/abi/erc20ABI.json'), 
        erc20_address = process.env.ERC20_ADDRESS,
        user_public_address = process.env.USER_PUBLIC_ADDRESS,
        user_private_key = process.env.USER_PRIVATE_KEY,
        token_public_address = process.env.TOKEN_PUBLIC_ADDRESS,
        token_private_address = process.env.TOKEN_PRIVATE_ADDRESS,
        voting_address = process.env.VOTING_ADDRESS,
        web3 = new Web3(new Web3.providers.HttpProvider(process.env.HOST_ENDPOINT));

const MessagingResponse = require('twilio').twiml.MessagingResponse;

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
                         var age_type = "M";

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
                                web3.eth.getTransactionCount(token_public_address, (err, count_val) => {
                                    if(err)
                                        res.status(500).send(err);
                                    else {
                                        var token_contract = new web3.eth.Contract(erc20_ABI, erc20_address)
                                        
                                        var amount = new BigNumber(2).mul(new BigNumber(10).pow(18));
                                        var rawTransactionObj = {
                                            from: token_public_address,
                                            to: erc20_address,
                                            nonce: count_val,
                                            gasPrice: web3.utils.toHex(99000000000),
                                            gasLimit: web3.utils.toHex(150000),
                                            value: "0x0",
                                            data : token_contract.methods.transfer(user_public_address, amount).encodeABI(),
                                        }
                                        var privKey = new Buffer(token_private_address.toLowerCase().replace('0x', ''), 'hex');
                                        var tx = new EthereumTx(rawTransactionObj);

                                        tx.sign(privKey);
                                        var serializedTx = tx.serialize();
                                        web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), (err, token_hash) => {
                                            if (err)
                                                res.status(500).send(err.toString())
                                            else
                                                res.status(200).json({message:"your vote has been processed", hash: hash})
                                        });
                                    }
                                });
                            }
                        }); 
                     }
                });
            }
        });
    }
})

router.post('/sms', (req, res) => {
    console.log(req.body.Body);
    const twiml = new MessagingResponse();
    var text = req.body.Body.split(" ");
    console.log(text);
    if(text[0] == "show" || text[0] == "Show") {
        var voting_contract = new web3.eth.Contract(voting_ABI, voting_address);
        voting_contract.methods.getImprovmentList().call({from: user_public_address}).then(improvments => {
            if(improvments.length > 0) {
                var actions = improvments.map((improvment) => {
                    var results = voting_contract.methods.getImprovmentsInformation(improvment).call({from: user_public_address}).then(details => {
                        return `(${web3.utils.hexToUtf8(improvment)}) ${web3.utils.hexToUtf8(details["title"])} `
                    })
                    return results;
                });

                return Promise.all(actions).then((improvmentsList) => {
                    twilio.send(req.body.From,"Hey George, here is the latest suggested district improvement list \n\ " + improvmentsList.join("\n"), (err, is_send) => {
                        if(err)
                            console.log(`Error occured: ${err}`);
                    });
                }).catch(error => {
                    console.log(error);
                })
            }
        })
    }
    else if(text[0] == "improvement" || text[0] == "Improvement") {
        var voting_contract = new web3.eth.Contract(voting_ABI, voting_address);
        voting_contract.methods.getImprovmentsInformation(web3.utils.fromAscii(text[1])).call({from: user_public_address}).then(details => {
            twilio.send(req.body.From, web3.utils.hexToUtf8(details["description"]), (err, is_send) => {
                if(err)
                    console.log(`Error occured: ${err}`);
            });
        });
    }
    else if(text[0] == "vote" || text[0] == "Vote") {
        var vote_type = "";
        var age_type = "M";
        if(text[2] == 'Yes' || text[2] == 'yes') {
            var vote_type = "Y";
        }
        else if(text[2] == 'No' || text[2] == 'no') {
            var vote_type = "N"
        }
        
        var voting_contract = new web3.eth.Contract(voting_ABI, voting_address);
        voting_contract.methods.checkImprovment(web3.utils.fromAscii(text[1])).call().then(improvment_exist => {
            if(!improvment_exist)
                console.log("Improvment doesnt exist")
            else {
                web3.eth.getTransactionCount(user_public_address, (err, count_val) => {
                    var rawTransactionObj = {
                        from: user_public_address,
                        to: voting_address,
                        nonce: count_val,
                        gasPrice: web3.utils.toHex(99000000000),
                        gasLimit: web3.utils.toHex(50000),
                        value: "0x0",
                        data : voting_contract.methods.voteImprovment(
                            web3.utils.fromAscii(text[1]),
                            web3.utils.fromAscii(vote_type),
                            web3.utils.fromAscii(age_type)
                        ).encodeABI()
                    }
                    var privKey = new Buffer(user_private_key.toLowerCase().replace('0x', ''), 'hex');
                    var tx = new EthereumTx(rawTransactionObj);

                    tx.sign(privKey);
                    var serializedTx = tx.serialize();
                    web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), (err, hash) => {
                        if(err)
                            console.log(err);
                        else {
                            web3.eth.getTransactionCount(token_public_address, (err, count_val) => {
                                if(err)
                                    console.log(err)
                                else {
                                    var token_contract = new web3.eth.Contract(erc20_ABI, erc20_address)
                                    var amount = new BigNumber(2).mul(new BigNumber(10).pow(18));
                                    
                                    var rawTransactionObj = {
                                        from: token_public_address,
                                        to: erc20_address,
                                        nonce: count_val,
                                        gasPrice: web3.utils.toHex(99000000000),
                                        gasLimit: web3.utils.toHex(150000),
                                        value: "0x0",
                                        data : token_contract.methods.transfer(user_public_address, amount).encodeABI(),
                                    }
                                    
                                    var privKey = new Buffer(token_private_address.toLowerCase().replace('0x', ''), 'hex');
                                    var tx = new EthereumTx(rawTransactionObj);

                                    tx.sign(privKey);
                                    var serializedTx = tx.serialize();
                                    web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), (err, token_hash) => {
                                        if (err)
                                            console.log(err.toString())
                                        else {
                                            twilio.send(req.body.From, "Your district thanks you for your vote. You just increse your balance by 2 District Tokens", (err, is_send) => {
                                                if(err)
                                                    console.log(`Error occured: ${err}`);
                                            });
                                        }

                                    });
                                }
                            });
                        }
                    });
                });
            }
        });
        
    }
    else if(text[0] == 'my' || text[0] == 'My') {
        var token_contract = new web3.eth.Contract(erc20_ABI, erc20_address)
        token_contract.methods.balanceOf(user_public_address).call({from: user_public_address}).then(balance => {
            var convert_balance = new BigNumber(balance).div(new BigNumber(10).pow(18));
             twilio.send(req.body.From, `Your District Token Balance is ${convert_balance} DTC`, (err, is_send) => {
                if(err)
                    console.log(`Error occured: ${err}`);
            });
        });
    }
});



module.exports = router