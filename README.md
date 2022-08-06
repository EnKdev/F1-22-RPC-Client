### F1 22 Rich Presence for Discord
Simple Discord RPC client for the game F1 22.

##### Features

- Displays the current track image when on track
- Displays the team the player is driving for
- (Disabled until further notice) ~~Display how many rounds the player has driven and how many rounds in a race are left [e.g Lap 13/52]~~
- (Disabled until further notice) ~~Display the percentage of completion of a race~~
- **NEW**: Distincts between F1 and F2 Gamemodes!

-----

**Remember to set the Client ID of your RPC inside the RpcConfig.json file and to set the UDP IP to 127.0.0.1! - Port: 20777**

**An example Client ID of a Rich Presence Client can be like this: 012345678901234567**

**If you have not yet setup an Rich Presence Client for F1 22, you can do that [here](https://discord.com/developers/applications)**

**Every resource you need for a complete RPC Client are provided in the rpcImg-directory. Please note however, that you should NOT change any of the image names, as that would require you to modify the Json-Configs for the circuits too!!!!**

**The UDP IP and Port have to be set in-game under the Telemetry Settings!**

**A precompiled binary build will also be provided for those that are lazy to do things themselves. (I feel you on that one)**

-----

##### Test the project
`npm start`

##### Build
`npm run package-win`

Current Version: 1.0.1

-----

##### Noteworthy info:
This repository is based on Flamehaze7's [F1 2020 Discord RPC Repository](https://github.com/Flamehaze7/F1-2020-Discord-RPC)