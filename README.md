该脚本仅供测试使用，请勿用于商业用途。

该脚本仅供测试使用，请勿用于商业用途。

该脚本仅供测试使用，请勿用于商业用途。



### 如何使用

#### Node

```javascript
const ltzj = require('./leitingzhanji');
// 加密
ltzj.encrypt(json_payload, cmdSequence);
// 解密
ltzj.decrypt(result_buffer);
```


### Node 例子

```javascript
import axios from 'axios';
const ltzj = require('./leitingzhanji');

const url = 'https://wxmini.jj5agame.com/p.f';
const json_payload = {
    head: {
        cmdDataSplitLength: 0,
        cmdId: 96,
        cmdLength: 0,
        cmdSequence: 179, // 该值需要与加密函数传入的cmdSequence值保持一致
        cmdVersion: 4,
        headVersion: 0,
        timestamp: Math.floor(Date.now()),
        crcVerify: 0,
        platform: 0,
        reconnect: false,
        sid,  // sid
        uid  // uid
    },
    id: 1
}
let payload = ltzj.encrypt(json_payload, 179)
const result = await axios({
    method: 'POST',
    url: url,
    data: payload,
    headers: headers,
    responseType: 'arraybuffer'
});
// 返回结果
console.log(ltzj.decrypt(result.data));
```