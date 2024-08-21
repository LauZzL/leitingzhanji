const ltzj = require('./leitingzhanji')
const axios = require('axios')

async function sendPostRequests(payload) {
    const headers = {
        'Content-Type': 'application/octet-stream'
    };
    let cmdSequence = payload.head.cmdSequence
    payload = ltzj.encrypt(JSON.stringify(payload), cmdSequence)
    const response = await axios({
        method: 'POST',
        url: 'https://wxmini.jj5agame.com/p.f',
        data: payload,
        headers: headers,
        responseType: 'arraybuffer'
    });
    return ltzj.decrypt(response.data)
}


module.exports = sendPostRequests

