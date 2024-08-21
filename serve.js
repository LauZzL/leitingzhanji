const { buffer } = require('stream/consumers')
const ltzj = require('./leitingzhanji.js')
const express = require('express')
const sendPostRequests = require('./requests.js')

// 获取args
// const args = process.argv.slice(2)

// if (args[1] == '-d') console.log(ltzj.decrypt4bs64(args[0]))

// if (args[1] == '-e') console.log(ltzj.encrypt2bs64(args[0], args[3]))

const app = express()
const port = 3000

// 创建json编码的body解析器
app.use(express.json())

app.post('/d', (req, res) => {
    console.log(req.body)
    const data = ltzj.decrypt4bs64(req.body.data)

    console.info(`解密结果:${data}`)
    res.send(data)
})

app.post('/e', (req, res) => {
    let payload = req.body
    let cmdSequence = payload.head.cmdSequence
    const data = ltzj.encrypt2bs64(JSON.stringify(payload), cmdSequence)
    console.info(`加密结果:${data}`)
    res.send(data)
})

app.post('/x', (req, res) => {
    res.send('1')
})

app.post('/r', async (req, res) => {
    const result = await sendPostRequests(req.body)
    res.send(result)
})


app.listen(port, () => {
    console.log(`Node 服务启动成功,端口:${port}`)
})
