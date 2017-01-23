import { Component, Pipe, PipeTransform } from '@angular/core';
import { Http, Response, RequestOptions, Headers, Request, RequestMethod } from '@angular/http';
import "rxjs/Rx";
import { DatasetTemplate } from './datasetTemplate';
import { OrderByPipe } from './app.component.pipe';
// import { OrderByPipe } from 'fuel-ui/fuel-ui';
import {DataTableModule} from "angular2-datatable";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  constructor(private http: Http){}

  tableNumber = 1086;
  tableNumberString = this.tableNumber.toString();

  datasetUrl = 'http://data.ssb.no/api/v0/dataset/'+this.tableNumberString+'.json?lang=en';
  datasetUrl2 = 'https://coconut-cloud-service-dot-sntc-hackathon-vii.appspot.com/api/subscriptions';


  // alright, let's begin. it's gonna be tremendous. 
  // decided to start with: 1088, link: http://data.ssb.no/api/v0/dataset/1088.json?lang=en
  title = 'Hello!';

  dataModel = [];

  ngOnInit(){
    this.getJsonFromWeb(); 
  }

  datasetInfo = {};
  datasetInfo2 = {};

  numberOfRows;

  getJsonFromWebWithAngular2(){
    console.log("reading data began");

    this.http.get(this.datasetUrl)
              .map((res: Response) => res.json())
              .subscribe(res => this.datasetInfo = res,
                        () => console.log("dataset is read"));
  }

  convertToDataModel(r: any) {
    // so the point is that the json that comes from the site is too raw, therefore i decided to make my own datatype
    // and do procurement on it to make it into a table. may not be the best solution, but i think it's ok
    let size = Math.max(...r.dataset.dimension.size); //wow spread operator
    let sizeValues = r.dataset.value.length;
    let numberOfRows = sizeValues/3;
    this.numberOfRows = numberOfRows;
    console.log('number of values: ' + sizeValues);
    console.log('number of rows: ' + numberOfRows);

    // let convertedData = <DatasetTemplate>({
    //   groupName: r.dataset.dimension.id[0],
    //   time: r.dataset.dimension.Tid.category.label["2016M11"],
    //   cpi: r.dataset.value[0],
    //   monthlyChange: r.dataset.value[1],
    //   twelveMonthRate: r.dataset.value[2],
    // })

    // type NewArrayType = Array<DatasetTemplate>;
    // let newArrayData: NewArrayType = [
    //   {
    //     groupName: r.dataset.dimension.id[0],
    //     time: r.dataset.dimension.Tid.category.label["2016M1"+"4"],
    //     cpi: r.dataset.value[0],
    //     monthlyChange: r.dataset.value[1],
    //     twelveMonthRate: r.dataset.value[2],
    //   },
    //   {
    //     groupName: r.dataset.dimension.id[0],
    //     time: r.dataset.dimension.Tid.category.label["2016M12"],
    //     cpi: r.dataset.value[3],
    //     monthlyChange: r.dataset.value[4],
    //     twelveMonthRate: r.dataset.value[5],
    //   }
    // ];

    let dataArray = [];
    for (let i=0; i < numberOfRows ; i++){
      let tempType = Object.keys(r.dataset.dimension.Tid.category.index)[i];
      let convertedDataElement = <DatasetTemplate>({
        groupName: r.dataset.dimension.id[0],
        time: r.dataset.dimension.Tid.category.label[tempType],
        cpi: r.dataset.value[i],
        monthlyChange: r.dataset.value[i+1],
        twelveMonthRate: r.dataset.value[i+2],
      })
      
      dataArray.push(convertedDataElement);
    }

    return dataArray;
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
      var jsonObject = JSON.parse(xhr.responseText);
      // this.datasetInfo = jsonObject;

      // console.log(this.datasetInfo);
      // console.log("her er response fra CORS request " + text);

      // var xmlHttp = new XMLHttpRequest();
      
      // xmlHttp.open( "GET", this.datasetUrl, false ); // false for synchronous request
      // xmlHttp.setRequestHeader("Content-Type", "application/json");
      // xmlHttp.send( null );

      // var jsonObject = JSON.parse(xmlHttp.responseText);
      // this.datasetInfo = jsonObject;
    }

    xhr.onerror = function() {
      alert('poop happened');
    }

    xhr.send();

  }

  getJsonFromWeb() {
    console.log("fetching data");

    this.makeCorsRequest();

    var xmlHttp = new XMLHttpRequest();
    
    xmlHttp.open( "GET", this.datasetUrl, false ); // false for synchronous request
    xmlHttp.onreadystatechange = function() {
      if (xmlHttp.readyState === 4) {
          // console.log(xmlHttp.responseText);
      }
    };
    xmlHttp.setRequestHeader('Accept', 'application/json');
    xmlHttp.send();

    var jsonObject = JSON.parse(xmlHttp.responseText);
    this.datasetInfo = jsonObject;

    this.dataModel = this.convertToDataModel(this.datasetInfo);

    console.log(this.dataModel);

    console.log("fetching completed");
  }

}
