// npm i request // this will help in data request 
let request = require("request");
// now for data extraction from the responsed html file we need cheerio module from npn(node package manager)
let cheerio = require("cheerio");
request('https://www.npmjs.com/package/cheerio' , cb );
function cb (error , response , html){
        if(error){
            console.log(error); // print the error if occoured
        }
        else{
            // console.log(html); -------> it will extract the whole html of that page 
            data_extractor(html);
            //print the html for the response
        }
}

function data_extractor(html){
    // cheerio search functionality with help of load function of cheerio
    let searchTool = cheerio.load(html);
    // searches with help of css selectors;
    let get_element = searchTool("#readme>h1");

    let module_name = get_element.text().trim();
    console.log("Module naeme is " , module_name);
}