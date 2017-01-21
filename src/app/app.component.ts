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

  datasetUrl = 'http://data.ssb.no/api/v0/dataset/1088.json';
  // datasetUrl = 'https://coconut-cloud-service-dot-sntc-hackathon-vii.appspot.com/api/subscriptions';
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

  // Create the XHR object.
  createCORSRequest(method, url) {
    var xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr) {
      // XHR for Chrome/Firefox/Opera/Safari.
      xhr.open(method, url, true);
    // } else if (typeof XDomainRequest != "undefined") {
    //   // XDomainRequest for IE. --> though this is obselete and f.i.e.
    //   xhr = new XDomainRequest();
    //   xhr.open(method, url);
    } else {
      // CORS not supported.
      xhr = null;
    }
    return xhr;
  }
  
  // helper method
  getTitle(text){
    return text.match('<title>(.*)?</title>')[1];
  }

  makeCorsRequest(){
    let xhr = this.createCORSRequest('GET', this.datasetUrl);
    if (!xhr) {
      alert('CORS not supported');
      return;
    }

    console.log("CORS is successfully done, data is coming!!");

    xhr.onload = () => {
      let text = xhr.responseText;
      // let title = text.match('<title>(.*)?</title>')[1];
      var jsonObject = JSON.parse(text);
      this.datasetInfo = jsonObject;

      console.log(this.datasetInfo);
      // console.log("her er response fra CORS request " + text);
    }

    xhr.onerror = function() {
      alert('poop happened');
    }

    xhr.send();

  }

  getJsonFromWeb() {
    console.log("fetching data");

    this.makeCorsRequest();

    // var xmlHttp = new XMLHttpRequest();
    
    // xmlHttp.open( "GET", this.datasetUrl, false ); // false for synchronous request
    // xmlHttp.setRequestHeader("Content-Type", "application/json");
    // xmlHttp.send( null );

    // var jsonObject = JSON.parse(xmlHttp.responseText);
    // this.datasetInfo = jsonObject;

    // console.log(this.datasetInfo);

    console.log("fetching completed");
  }

}
