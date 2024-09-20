const ws = require('ws');
const fs = require('fs');
const { getTokens, saveDeadToken, saveTokenData } = require('./modules/tokenManager');
const { info, error } = require('./modules/logs');

const config = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));

const gatewayURL = 'wss://gateway.discord.gg/?v=10&encoding=json';
const tokens = getTokens();
console.clear();

info(`UNDESYNC SERVER ID FETCHER | Total Tokens: ${tokens.length}\n`);

tokens.forEach(token => {
    const socket = new ws(gatewayURL, {
        headers: {
            Authorization: token
        }
    });

    socket.on('open', () => {
        const identifyPayload = {
            op: 2,
            d: {
                token: token,
                properties: {
                    $os: 'linux',
                    $browser: 'my_library',
                    $device: 'my_library',
                },
                compress: false,
                large_threshold: 250,
                shard: [0, 1],
            },
        };

        socket.send(JSON.stringify(identifyPayload));
    });

    socket.on('message', (data) => {
        const payload = JSON.parse(data);
        
        if (payload.op === 10) {
            const heartbeatInterval = payload.d.heartbeat_interval;
            setInterval(() => {
                socket.send(JSON.stringify({ op: 1, d: null }));
            }, heartbeatInterval);
        } else if (payload.op === 0 && payload.t === 'READY') {

            const guildCount = payload.d.guilds.length;
            const guildsData = payload.d.guilds.map(guild => guild.id);

            info(`Token connected to ${guildCount} guilds. Details: ${guildsData}`);

            saveTokenData(token, guildCount, guildsData, config);

        }
    });

    socket.on('error', (err) => {
        error(`WebSocket error for token ${token}: ${err.message}`);
    });

    socket.on('close', () => {
        info(`Connection closed for token: ${token}`);
        saveDeadToken(token);
    });
});
