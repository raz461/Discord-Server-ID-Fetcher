# Discord SERVER ID FETCHER
This script allows you to get the server IDs of your tokens and save them.

## Configuration
1. Install the required packages with `npm install`.
2. Fill in the `config.json` file with the required information.
3. Add your bot token(s) to the `data/tokens.txt` file.
4. Run the script using `npm start`.

## Misc
- The tokens must be valid.
- Proxyless

## Config
```json
{
    "server_limit": 70, // If the account has more than this server it will add it to a seperate file. above.txt
    "save_only_for_above": false, // It will only save the server id if the account has more than the server_limit
    "save_ids": true // It will save the server ids to a file
}
```
#
### Example
![Example](https://i.imgur.com/wOxPMQj.png)

[Discord](https://discord.gg/undesync)
