const fs = require('fs');
const { info, error } = require('../modules/logs');

const filePath = './data/tokens.txt';
const deadfilePath = './data/deadtokens.txt';
const abovefilePath = './data/large_accounts.txt';
const savefilePath = './data/all_accounts.txt';

function getTokens() {
    return fs.readFileSync(filePath, 'utf-8')
    .split('\n')
    .map(token => token.trim())
    .filter(token => token.length > 0);
}

function saveDeadToken(token) {
    fs.appendFile(deadfilePath, `${token}\n`, (err) => {
        if (err) {
            error('Error saving dead token:', err);
        } else {
            info('Dead token saved in deadTokens.txt');
        }
    });
}

function saveTokenData(token, guildCount, guilds, config) {
    fs.appendFileSync(savefilePath, `Token: ${token} - Guilds: ${guildCount}\n`);
    if (config.save_ids) {
        guilds.forEach(guild => {
            fs.appendFileSync(savefilePath, `  Guild ID: ${guild}\n`);
        });
    }
    fs.appendFileSync(savefilePath, `\n`);

    if (guildCount >= config.server_limit) {
        fs.appendFileSync(abovefilePath, `Token: ${token} - Guilds: ${guildCount}\n`);
        if (config.save_ids) {
            guilds.forEach(guild => {
                fs.appendFileSync(abovefilePath, `  Guild ID: ${guild}\n`);
            });
        }
        fs.appendFileSync(abovefilePath, `\n`);
    }
}

module.exports = { getTokens, saveDeadToken, saveTokenData };
