import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { FormControl,FormBuilder, FormsModule , FormGroup, Validators } from '@angular/forms'
import { UserService } from '../../services/user.service'

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.css']
  })

  export class UserComponent implements OnInit {
    addPersonForm: FormGroup;
    personMessageClass;
    personMessage;
    person_tx_hash;
    token_balance;
    personDetails;
    improvementList = [];

    constructor(  
        private userService: UserService,
        private formBuilder: FormBuilder,
        private router: Router
    ){

    }

    ngOnInit() {
        this.addKYCForm();
        this.getPersonDetails();
    }
    addKYCForm() {
        this.addPersonForm =  this.formBuilder.group({
            first_name: ['George', Validators.compose([
                Validators.required
            ])],
            last_name : ['Lambrianides', Validators.compose([
                Validators.required
            ])],
            id_number : ['999999', Validators.compose([
                Validators.required
            ])],
            phone_number : ['+35799780894', Validators.compose([
                Validators.required
            ])],
            birth_year : ['1992', Validators.compose([
                Validators.required
            ])],
            district : ['LIM', Validators.compose([
                Validators.required
            ])],
            post_code : ['3320', Validators.compose([
                Validators.required
            ])],
            home_address : ['Odysseos 5, Flat 208', Validators.compose([
                Validators.required
            ])],   
        });
    }

    addKYC() {
        const data = {
            first_name : this.addPersonForm.get('first_name').value,
            last_name: this.addPersonForm.get("last_name").value,
            id_number: this.addPersonForm.get("id_number").value,
            phone_number: this.addPersonForm.get("phone_number").value,
            birth_year: 26,
            district: this.addPersonForm.get("district").value,
            post_code: this.addPersonForm.get("post_code").value,
            home_address: this.addPersonForm.get("home_address").value
        }
        this.userService.addPersonDetails(data).subscribe(res => {
            this.personMessageClass = 'alert alert-success';
            this.personMessage = res.message;
            this.person_tx_hash = res.tx_hash;
        }, (err) => {
            this.personMessageClass = 'alert alert-danger';
            this.personMessage = err._body;
        })
    }

    getPersonDetails() {
        this.userService.getPersonDetails().subscribe(personDetails => {
            this.personDetails = personDetails
            this.getTokenBalance();
            this.getImprovementDetails();
        },err => {
            console.log(err);
        })
    }

    getTokenBalance() {
        this.userService.getTokenBalance().subscribe(balance => {
            if(balance)
                this.token_balance = balance;
        })
    }

    getImprovementDetails() {
        this.userService.getImprovementDetails().subscribe(improvementlist => {
            this.improvementList = improvementlist;
        },(err) => {
            console.log(err._body);
        });
    }

   
    addVote(reference_no,vote_type, event) {
        const data = {
            reference_no: reference_no,
            vote_type: vote_type
        }

        this.userService.addVoteDetails(data).subscribe(res => {
            document.getElementById(reference_no).innerHTML = "";
            document.getElementById(reference_no).innerHTML = `<div class="text_center">${res.message} <br><a href="https://ropsten.etherscan.io/tx/${res.hash}" target='_blank'">Transaction</a><br> Thank You</div>`;
        }, (err) => {

        })

    }

}