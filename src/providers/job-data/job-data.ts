import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch'

import { jobInformation, skillInformation } from '../../assets/data/dataModel';

@Injectable()
export class JobDataProvider {

  private _dataAtWork_url: string;
  private _url: string;
  private _server_url: string;

  currentJob = [ {'title': '', 'id': ''},  {'title': '', 'id': ''}, {'title': '', 'id': ''}, {'title': '', 'id': ''}, {'title': '', 'id': ''}, {'title': '', 'id': ''} ];
  dreamJob = {'title': '', 'id': ''};
  location = '';

	constructor(public http: HttpClient) {
    	console.log('Hello JobDataProvider Provider');
		this._dataAtWork_url = "https://api.dataatwork.org/v1/";
		this._server_url = "http://localhost:8081/";
        // this._url = "http://localhost:8000/api/v1/";
        this._url = "http://dreamgig.me:5000/api/v1/"
  	}


    setCurrentJob(currentJob: any){
      this.currentJob = currentJob;
    }

    setDreamJob(dreamJob: any){
      this.dreamJob = dreamJob;
    }

    // Get job title autocompletion by calling Dataatwork autocomplete API

    getJobAutocomplete(jobTitle: string, lang: string){
		return this.http.get(this._server_url + "autocomplete/" + jobTitle + "/" + lang).map((res:any) => res);
    }

    getSkillset(id: string, lang: string) {
		return this.http.get(this._server_url + "relatedskills/" + id + "/" + lang).map((res:any) => res);
    }

    writeLog(dj: string, pj1: string, pj2: string, pj3: string, pj4: string, time: string) {
      let url = this._server_url + 'writelog';
      console.log(dj + pj1 + pj2 + pj3 + pj4 + time);
      this.http.get(url, {
        params: {
          dream: dj,
          past1: pj1,
          past2: pj2,
          past3: pj3,
          past4: pj4,
          ts: time
        },
        observe: 'response'
      }).toPromise()
      .then(response => {
        console.log(response);
      })
      .catch(console.log);
    }
}
