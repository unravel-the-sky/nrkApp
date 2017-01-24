import { Component, Pipe, PipeTransform } from '@angular/core';
import { Http, Response, RequestOptions, Headers, Request, RequestMethod } from '@angular/http';
import "rxjs/Rx";
import { DatasetTemplate } from './datasetTemplate';
import { OrderByPipe } from './app.component.pipe';
// import { OrderByPipe } from 'fuel-ui/fuel-ui';
import {DataTableModule} from "angular2-datatable";
import { SlimLoadingBarService } from "ng2-slim-loading-bar";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  constructor(private http: Http, 
              private slimLoadingBarService: SlimLoadingBarService){}

  tableNames = [];
  tableNumbers = ['1088', '1086', '130297', '45590', '95134', '1114'];
  tableNumber = 1088;
  tableNumberString = this.tableNumber.toString();

  datasetUrl = 'http://data.ssb.no/api/v0/dataset/'+this.tableNumberString+'.json?lang=en';

  // alright, let's begin. it's gonna be tremendous. 
  // decided to start with: 1088, link: http://data.ssb.no/api/v0/dataset/1088.json?lang=en
  title = 'Hello!';

  label1: string;
  label2: string;
  label3: string;

  dataLabels = [];

  dataModel = [];

  numberOfContentColumns: number;

  startLoading() {
    this.slimLoadingBarService.start(() => {
      console.log('Loading complete');
    });
  }

  stopLoading() {
    this.slimLoadingBarService.stop();
  }

  completeLoading() {
    this.slimLoadingBarService.complete();
  }


  ngOnInit(){
    this.startLoading();
    this.getJsonFromWeb(); 
  }

  getDataOnDemand(dataTableNumber: string){
    this.startLoading();
    this.tableNumberString = dataTableNumber;
    console.log('dataset number: ' + dataTableNumber);
    this.datasetUrl = 'http://data.ssb.no/api/v0/dataset/'+this.tableNumberString+'.json?lang=en';
    this.dataLabels = [];
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
    console.log(r.dataset.dimension.size[0]);
    let numberOfFirstItem = r.dataset.dimension.size[0];
    let valueOfLastItem = r.dataset.dimension.size[r.dataset.dimension.size.length-1];
    console.log('value of last item: ' + valueOfLastItem);

    let numberOfDataRows = (sizeValues/valueOfLastItem)/numberOfFirstItem;
    let numberOfRows = sizeValues/valueOfLastItem * r.dataset.dimension.size[0];
    this.numberOfRows = numberOfRows;
    console.log('number of values: ' + sizeValues);
    console.log('number of data rows: ' + numberOfDataRows);
    console.log('value of first item: ' + numberOfFirstItem);

    for (let i = 0 ; i < valueOfLastItem ; i++){
      let keyForContent = Object.keys(r.dataset.dimension.ContentsCode.category.index)[i];
      let label = r.dataset.dimension.ContentsCode.category.label[keyForContent];

      console.log('label name: ' + label)
      this.dataLabels.push(label);
    }

    this.label1 = r.dataset.dimension.id[0];
    
    this.numberOfContentColumns = valueOfLastItem;

    let dataArray = [];
    let k = 0;
    let contentNumber = 0;
    for (let i=0; i < numberOfFirstItem ; i++){
      for (let j=0; j < numberOfDataRows ; j++){
        let tempType = Object.keys(r.dataset.dimension.Tid.category.index)[j];

        let tempContentCodeName = r.dataset.dimension.id[0];
        // console.log(tempContentCodeName);
        let tempTypeForConsumerGroup = Object.keys(r.dataset.dimension[tempContentCodeName].category.index)[i];
        // console.log(tempTypeForConsumerGroup);
        let dataToFill = [];
        for (let a = 0; a < valueOfLastItem ; a++){
          dataToFill.push(r.dataset.value[k+a]);
        }
        let convertedDataElement = <DatasetTemplate>({
          groupName: r.dataset.dimension[tempContentCodeName].category.label[tempTypeForConsumerGroup],
          time: r.dataset.dimension.Tid.category.label[tempType],
          cpi: r.dataset.value[k],
          monthlyChange: r.dataset.value[k+1],
          twelveMonthRate: r.dataset.value[k+2],
          contentData: dataToFill
        })
        k = k + valueOfLastItem;
        dataArray.push(convertedDataElement);
      }
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

    this.completeLoading();

    // console.log(this.dataModel);

    console.log("fetching completed");
  }

}
