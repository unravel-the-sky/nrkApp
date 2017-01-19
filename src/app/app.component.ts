import { Component } from '@angular/core';
import { Http, Response, RequestOptions, Headers, Request, RequestMethod } from '@angular/http';
import "rxjs/Rx";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  constructor(private http: Http){}

  datasetUrl = "http://data.ssb.no/api/v0/dataset/1088.json?lang=en";
  datasetInfo = [];

  // alright, let's begin. it's gonna be tremendous. 
  // decided to start with: 1088, link: http://data.ssb.no/api/v0/dataset/1088.json?lang=en
  title = 'Dataset 1088!';

  ngOnInit(){
    this.getJsonFromWeb();
  }

  getJsonFromWebWithAngular2(){

    console.log("reading data began");

    this.http.get(this.datasetUrl)
              .map((res: Response) => res.json())
              .subscribe(res => this.datasetInfo = res,
                        () => console.log("dataset is read"));
  }

  getJsonFromWeb() {
    console.log("fetching data");

    var xmlHttp = new XMLHttpRequest();
    
    xmlHttp.open( "GET", this.datasetUrl, false ); // false for synchronous request
    //xmlHttp.setRequestHeader("Content-Type", "application/json");

    var jsonObject = JSON.parse(xmlHttp.responseText);
    this.datasetInfo = jsonObject;

    console.log(this.datasetInfo);

    console.log("fetching completed");
  }

}
