import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';


@Injectable()
export class UserService {
    apiUrl = "http://localhost:8000";
    constructor(
        private http: Http,
    ) {}

    getTokenBalance() {
        return this.http.get(
            this.apiUrl + '/kyc/balance'
        ).map(res => res.json());
    }

    getPersonDetails() {
        return this.http.get(
            this.apiUrl + '/kyc/get'
        ).map(res => res.json());
    }

    getImprovementDetails() {
        return this.http.get(
            this.apiUrl + '/vote/get'
        ).map(res => res.json());
    }

    addVoteDetails(data) {
        return this.http.post(
            this.apiUrl + '/vote/create',
            data
        ).map(res => res.json());
    }

    addPersonDetails (data) {
        return this.http.post(
            this.apiUrl + '/kyc/create',
            data
        ).map(res => res.json());
    }
};