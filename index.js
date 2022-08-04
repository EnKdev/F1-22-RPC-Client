const RpcConfig = require("./config/RpcConfig.json")

const Client = require("discord-rich-presence")(`${RpcConfig.ClientId}`)
const {F122UDP} = require("f1-22-udp")
const {app, BrowserWindow} = require("electron")

const TrackList = require("./config/TrackList.json")
const SessionTypes = require("./config/SessionTypeList.json")
const LargeImages = require("./config/ImageKeyList.json")
const TeamsAndSupercars = require("./config/TeamAndSuperCarList.json")

const f1Client = new F122UDP();

let date = Date.now();
let interval;

f1Client.start();

let teamId = 0;
let teamName = "";
let raceCompletion = 0.0;
let lapNumber = 0;
let formulaType = 0;
let sessionType = "";

function resetStatus() {
    Client.updatePresence({
        state: "In the paddocks",
        largeImageKey: "backcover",
        startTimestamp: date
    });
};

function GetTeamNameFromId(id) {
    TeamsAndSupercars.some(function (idx) {
        if (idx.GameId === id) {
            teamName = idx.Name;
        }
    });
};

f1Client.on("participants", (pData) => {
    pData.m_participants.some(function (idx) {
        if (idx.m_aiControlled === 0) {
            teamId = idx.m_teamId;
        }
    });

    console.log(`TeamId: ${teamId}`);
    console.log(pData);

    GetTeamNameFromId(teamId);
});

f1Client.on("lapData", (lData) => {
    if (formulaType === 2) { // F2 check
        lapNumber = lData.m_lapData[21].m_currentLapNum;
    } else {
        lapNumber = lData.m_lapData[19].m_currentLapNum;
    }
    console.log(lData);
});

f1Client.on('session', (sData) => {
    if (interval) {
        clearInterval(interval);
    }

    formulaType = sData.m_formula;
    sessionType = `${SessionTypes[sData.m_sessionType].Type}`;

    raceCompletion = (100.0 / sData.m_totalLaps) * lapNumber;
    raceCompletion = raceCompletion.toFixed(2);

    if (sessionType === "Free Practice 1" ||
        sessionType === "Free Practice 2" ||
        sessionType === "Free Practice 3" ||
        sessionType === "Short Practice" ||
        sessionType === "Qualifying 1" ||
        sessionType === "Qualifying 2" ||
        sessionType === "Qualifying 3" ||
        sessionType === "Short Qualifying" ||
        sessionType === "One-Short Qualifying" ||
        sessionType === "Time Trial") {
        Client.updatePresence({
            details: `${sessionType} - ${TrackList[sData.m_trackId].Name}`,
            state: `Driving for ${teamName} - ${sData.m_totalLaps} Laps driven`,
            smallImageKey: "backcover",
            smallImageText: "F1 22",
            largeImageKey: `${LargeImages[sData.m_trackId].imageKey}`,
            largeImageText: `Racing on ${TrackList[sData.m_trackId].Name}`
        });
    } else if (sessionType === "Race" ||
               sessionType === "Race 2" ||
               sessionType === "Race 3") {
        Client.updatePresence({
            details: `${sessionType} - ${TrackList[sData.m_trackId].Name} - [${raceCompletion}% done]`,
            state: `Driving for ${teamName} - Lap ${lapNumber}/${sData.m_totalLaps}`,
            smallImageKey: "backcover",
            smallImageText: "F1 22",
            largeImageKey: `${LargeImages[sData.m_trackId].imageKey}`,
            largeImageText: `Racing on ${TrackList[sData.m_trackId].Name}`
        });
    }

    console.log(sData);

    interval = setInterval(() => {
        resetStatus();
    }, 5000);
});

Client.updatePresence({
    state: "In the paddocks",
    largeImageKey: "backcover",
    startTimestamp: date
});

// Electron
function createWindow() {
    const win = new BrowserWindow({
        width: 300,
        height: 150,
        resizable: false,
        webPreferences: {
            nodeIntegration: true
        },
        autoHideMenuBar: true,
        icon: "./assets/icon/win/icon.ico"
    });

    win.loadFile("index.html");
}

app.whenReady().then(createWindow);