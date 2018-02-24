import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';


@Injectable()
export class UserService {
    apiUrl = "http://localhost:8000";
    constructor(
        private http: Http,
    ) {}

    getPublicAddress() {
        return this.http.get(
            this.apiUrl + '/user/publicaddress'
        ).map(res => res.json());
    }

    getEtherBalance() {
        return this.http.get(
            this.apiUrl + '/user/balance'
        ).map(res => res.json());
    }

    getPersonDetails() {
        return this.http.get(
            this.apiUrl + '/user/persondetails'
        ).map(res => res.json());
    }

    getCarDetails() {
        return this.http.get(
            this.apiUrl + '/user/cardetails'
        ).map(res => res.json());
    }

    getInvestDetails() {
        return this.http.get(
            this.apiUrl + '/user/investdetails'
        ).map(res => res.json());
    }


    addPersonDetails (data) {
        return this.http.post(
            this.apiUrl + '/user/persondetails',
            data
        ).map(res => res.json());
    }

    addCarDetails (data) {
        return this.http.post(
            this.apiUrl + '/user/cardetails',
            data
        ).map(res => res.json());
    }

    addInvestDetails(data) {
        return this.http.post(
            this.apiUrl + '/user/investdetails',
            data
        ).map(res => res.json());
    }
};