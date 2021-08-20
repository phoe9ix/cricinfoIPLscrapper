
  
const url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595";
const request = require("request"); // require request for getting data from url
const cheerio = require("cheerio"); //require cheerio for scrapping and loading data
const fs = require("fs");
const path = require("path");   
let matchDetailsObj = require("./matchDetails");
let folderPath = path.join(__dirname,"IPL");
createDir(folderPath);
request(url , cb );
function cb(error , response , html) {
    if(error){
        console.log(error);
    }
    else if(response.statusCode == 404){
        console.log("Page NOt Found");
    }
    else{
        dataExtractor(html); //extracts the required data form html ;
    }
}
function dataExtractor(html){
    let searchTool = cheerio.load(html);
    let scorePageData = searchTool('a[data-hover="View All Results"]');
    let link_to_match_page = scorePageData.attr('href'); //.attr of cheerio helps in 
    // getting link to multiple pages we can provide the anchor tag href in it it will revert back with link of that page
    let link_to_match_results =`https://www.espncricinfo.com/${link_to_match_page}`;
    
    request(link_to_match_results , cbToMatchPage);
}
function cbToMatchPage(error , response , html){
    if(error){
        console.log(error);
    }
    else if(response.statusCode == 404){
        console.log("Page NOt Found");
    }
    else{
        allMatchScoreCardLink(html);
    }
}
function allMatchScoreCardLink(html){
    let search = cheerio.load(html);
    let getScoreCardData = search('a[data-hover="Scorecard"]');
    let homePageUrl = "https://www.espncricinfo.com/";
    for(let i=0 ; i<getScoreCardData.length; i++){
        let linkToMatchScorecard = homePageUrl+search(getScoreCardData[i]).attr('href');
        // console.log(linkToMatchScorecard);
        matchDetailsObj.psmd(linkToMatchScorecard);
    } 
}
function createDir(folderpath){
    if(fs.existsSync(folderPath)==false){
        fs.mkdirSync(folderPath);
    }
}