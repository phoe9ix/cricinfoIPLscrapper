// npm i request 
let request = require("request");
// npm i cheerio 
let cheerio = require("cheerio");
// data extract-> cheerio  
let fs = require("fs");
let url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595/royal-challengers-bangalore-vs-sunrisers-hyderabad-eliminator-1237178/full-scorecard";
console.log("Before");
request(url, cb);
function cb(error, response, html) {
    // console.error('error:', error); // Print the error if one occurred
    // console.log('body:', html); // Print the HTML for the Google homepage.
    if (error) {
        console.log(error); // Print the error if one occurred
    } else if (response.statusCode == 404) {
        console.log("Page Not Found")
    }
    else {
        // console.log(html); // Print the HTML for the request made 
        dataExtracter(html);
    }
}
// insights -> You don't get all the  data initially  
function dataExtracter(html) {
    // search tool
    let searchTool = cheerio.load(html);
    let bowler_table = searchTool(".table.bowler");
    let bowlers = searchTool(".table.bowler tbody tr");
    let hwt_bowler ="";
    let hwt_wickets = 0;
    for(let i =0 ;i<bowlers.length;i++){
        let bowler_details = searchTool(bowlers[i]).find("td");
        //find fn helps you to find something in specific parts  , 
        let name= searchTool(bowler_details[0]).text(); //wrapping in searchTools is compulsory 
        // to allow data to be used as text html or other things;
        let wicket = searchTool(bowler_details[4]).text();

        console.log("Bowler name is   ",name + "   and he took  ",wicket+"   wickets");

        if(wicket>hwt_wickets){
            hwt_wickets=wicket;
            hwt_bowler=name;
        }

    }
    console.log("---------------------------------------------------------------------");
    console.log("The highest wicket taker is " , hwt_bowler +"  with " ,hwt_wickets +" wickets");


    //let htmlData = "";
    // for(let i =0 ;i<bowler_table.length;i++){
    //     // if the data coming is of the form of arrays or similar you need to wrap 
    //     // that data into your searchfunction you made using load fn of cheerio 
    //     // to make the data work and extractable as a text / html
    //     htmlData+= searchTool(bowler_table[i]).html();
    // }
    // fs.writeFileSync("bowlerTable.html", htmlData);





}
console.log("After");