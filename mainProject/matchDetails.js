// let link ="https://www.espncricinfo.com//series/ipl-2020-21-1210595/delhi-capitals-vs-mumbai-indians-final-1237181/full-scorecard";
let request = require("request");
let cheerio = require("cheerio");
let fs = require("fs");
const path = require("path");

function processSingleMatchData(url){
    request(url , cbmatch);
}

function cbmatch(error , response , html){
    if(error){
        console.log(error);
    }
    else if(response.statusCode == 404){
        console.log("Page NOt Found");
    }
    else{
        matchDetailsExtractor(html); //extracts the required data form html ;
    }
}

function matchDetailsExtractor(html){
    let search = cheerio.load(html);
    // let detailsFirsTteam = search('.header-title.label');
    let result = search('.event .status-text');
    let matchDescription = search('.event .description');
    let matchDesc = matchDescription.text().split(",");
    let venue = matchDesc[1].trim();
    let date = matchDesc[2].trim();
    let textResult = result.text();
    let bothInningsDetail = search('.Collapsible');
    
    console.log(`MATCH RESULT-${textResult} |MATCH VENUE- ${venue} |MATCH DATE - ${date}`);
    console.log("____________________________________________________________________________________________________")
    let id ='1st'
    for( let j=0 ; j< bothInningsDetail.length ;j++){
        let name = search(bothInningsDetail[j]).find("h5");
        let teamName = name.text();
        let idx = j == 0 ? 1 : 0;
        let opponenetName = search(bothInningsDetail[idx]).find("h5").text();
        opponenetName=opponenetName.split("INNINGS")[0].trim();
        teamName = teamName.split("INNINGS")[0].trim();
        console.log(`Team batting ${id} -${teamName}`);
        id='2nd'
        console.log("____________________________________________________________________________________________________")
        let completeBatsmanTableRows = search(bothInningsDetail[j]).find('.table.batsman tbody tr');
        for(i of completeBatsmanTableRows){
            let totalNoOFCOLS = search(i).find("td");
            if(totalNoOFCOLS.length == 8){
                let playerName = search(totalNoOFCOLS[0]).text(); //For doing anything with the cheerio response array 
                // kindly wrap it first with the search tool to avoid errors ;
                let run =search(totalNoOFCOLS[2]).text(); 
                let balls =search(totalNoOFCOLS[3]).text();
                let fours = search(totalNoOFCOLS[5]).text();
                let sixes = search(totalNoOFCOLS[6]).text();
                let sr =  search(totalNoOFCOLS[7]).text();

                let playerDetails = `Appending Data of ${playerName}, For Match ${teamName} VS ${opponenetName}`;
                console.log(playerDetails); 
                processPlayerData(teamName , opponenetName , playerName , run , balls , fours , sixes , sr);
            }
        }
        console.log("_____________________________________________________________________________________________________")
        
    }

}

function processPlayerData(teamName , opponenetName , playerName , run , balls , fours , sixes , sr){
    teamPath = path.join(__dirname,"IPL",teamName);
    createDir(teamPath);
    let filePath = path.join(teamPath,playerName+".json");
    let dataArray = [];
    let playerInfo ={
    "Player Name"     :playerName,
    "Opponent Name"   :opponenetName,
    "Runs"            :run,
    "Balls"           :balls,
    "Fours"           :fours,
    "Sixes"           : sixes,
    "StrikeRate"      :sr,
    };
    if(fs.existsSync(filePath)){
        let data = fs.readFileSync(filePath);
        dataArray = JSON.parse(data);
    }
    dataArray.push(playerInfo);
    let sData = JSON.stringify(dataArray);
    fs.writeFileSync(filePath, sData);
}


function createDir(fpath){
    if(fs.existsSync(fpath)==false){
        fs.mkdirSync(fpath);
    }
}

module.exports = {
    psmd : processSingleMatchData
}