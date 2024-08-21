const ByteArray = require('./ByteArray.js');
const ByteReader = require('./ByteReader.js');

function decodeText(r) {
    for (var t = "", e = 0, n = r.length; e < n;) {
        var i = r[e++];
        if (i < 128) {
            t += String.fromCharCode(i);
        } else if (i > 191 && i < 224) {
            var o = r[e++];
            t += String.fromCharCode((31 & i) << 6 | 63 & o)
        } else if (i > 223 && i < 240) {
            var u = r[e++]
                , c = r[e++];
            t += String.fromCharCode((15 & i) << 12 | (63 & u) << 6 | 63 & c)
        } else if (i > 239 && i < 248) {
            var f = (7 & i) << 18 | (63 & r[e++]) << 12 | (63 & r[e++]) << 6 | 63 & r[e++];
            f -= 65536,
                t += String.fromCharCode(55296 + (f >> 10), 56320 + (1023 & f))
        }
    }
    return t
}


function encodeText(r) {
    for (var t = [], e = 0; e < r.length; e++) {
        var n = r.charCodeAt(e);
        n < 128 ? t.push(n) : n < 2048 ? t.push(192 | n >> 6, 128 | 63 & n) : n < 65536 ? t.push(224 | n >> 12, 128 | n >> 6 & 63, 128 | 63 & n) : (e++,
            n = 65536 + ((1023 & n) << 10 | 1023 & r.charCodeAt(e)),
            t.push(240 | n >> 18, 128 | n >> 12 & 63, 128 | n >> 6 & 63, 128 | 63 & n))
    }
    return new Uint8Array(t)
}

var p = function() {
    function r() {}
    return r.shortToByteArray = function(t) {
        return r.integerToByteArray(t, 2)
    }
    ,
    r.intToByteArray = function(t) {
        return r.integerToByteArray(t, 4)
    }
    ,
    r.longToByteArray = function(t) {
        return r.integerToByteArray(t, 8)
    }
    ,
    r.integerToByteArray = function(r, t) {
        for (var e = new Uint8Array(t), n = 0; n < t; n++) {
            var o = 255 & r;
            e[t - n - 1] = o,
            r = (r - o) / 256
        }
        return e
    }
    ,
    r.byteArrayToShort = function(t, e) {
        return r.byteArrayToInteger(t, e, 2)
    }
    ,
    r.byteArrayToInt = function(t, e) {
        return r.byteArrayToInteger(t, e, 4)
    }
    ,
    r.byteArrayToLong = function(t, e) {
        return r.byteArrayToInteger(t, e, 8)
    }
    ,
    r.byteArrayToInteger = function(r, t, e) {
        for (var n = 0, o = t + e, a = t; a < o; a++)
            n = 256 * n + r[a];
        return n
    }
    ,
    r.floatToByteArray = function(r) {
        return new Uint8Array(new Float32Array([r]).buffer).reverse()
    }
    ,
    r.byteArrayToFloat = function(r, t) {
        var e = r.slice(t, t + 4);
        return e.reverse(),
        new Float32Array(e.buffer,0,1)[0]
    }
    ,
    r.doubleToByteArray = function(r) {
        return new Uint8Array(new Float64Array([r]).buffer).reverse()
    }
    ,
    r.byteArrayToDouble = function(r, t) {
        var e = r.slice(t, t + 8);
        return e.reverse(),
        new Float64Array(e.buffer,0,1)[0]
    }
    ,
    r.utf16ToUtf8Array = function(r) {
        for (var t = [], e = 0; e < r.length; e++) {
            var n = r.charCodeAt(e);
            n < 128 ? t.push(n) : n < 2048 ? t.push(192 | n >> 6, 128 | 63 & n) : n < 55296 || n >= 57344 ? t.push(224 | n >> 12, 128 | n >> 6 & 63, 128 | 63 & n) : (e++,
            n = 65536 + ((1023 & n) << 10 | 1023 & r.charCodeAt(e)),
            t.push(240 | n >> 18, 128 | n >> 12 & 63, 128 | n >> 6 & 63, 128 | 63 & n))
        }
        return new Uint8Array(t)
    }
    ,
    r.stringToByteArray = function(t) {
        return r.utf16ToUtf8Array(t)
    }
    ,
    r.byteArrayToString = function(r, t, e) {
        var n = r.subarray(t, t + e)
          , o = String.fromCharCode.apply(null, n);
        return decodeURIComponent(escape(o))
    }
    ,
    r.convertToByte = function(r) {
        return 255 & r
    }
    ,
    r.printByteArray = function(r) {
        for (var t = "", n = 0; n < r.length; n++)
            t = 0 == n ? r[n].toString() : t + "," + r[n].toString();
        e("Print byte array with length:" + r.length + "\n" + t)
    }
    ,
    r.crc32FromUint8Array = function(t) {
        r.crcTable || (r.crcTable = new Uint32Array([0, 1996959894, 3993919788, 2567524794, 124634137, 1886057615, 3915621685, 2657392035, 249268274, 2044508324, 3772115230, 2547177864, 162941995, 2125561021, 3887607047, 2428444049, 498536548, 1789927666, 4089016648, 2227061214, 450548861, 1843258603, 4107580753, 2211677639, 325883990, 1684777152, 4251122042, 2321926636, 335633487, 1661365465, 4195302755, 2366115317, 997073096, 1281953886, 3579855332, 2724688242, 1006888145, 1258607687, 3524101629, 2768942443, 901097722, 1119000684, 3686517206, 2898065728, 853044451, 1172266101, 3705015759, 2882616665, 651767980, 1373503546, 3369554304, 3218104598, 565507253, 1454621731, 3485111705, 3099436303, 671266974, 1594198024, 3322730930, 2970347812, 795835527, 1483230225, 3244367275, 3060149565, 1994146192, 31158534, 2563907772, 4023717930, 1907459465, 112637215, 2680153253, 3904427059, 2013776290, 251722036, 2517215374, 3775830040, 2137656763, 141376813, 2439277719, 3865271297, 1802195444, 476864866, 2238001368, 4066508878, 1812370925, 453092731, 2181625025, 4111451223, 1706088902, 314042704, 2344532202, 4240017532, 1658658271, 366619977, 2362670323, 4224994405, 1303535960, 984961486, 2747007092, 3569037538, 1256170817, 1037604311, 2765210733, 3554079995, 1131014506, 879679996, 2909243462, 3663771856, 1141124467, 855842277, 2852801631, 3708648649, 1342533948, 654459306, 3188396048, 3373015174, 1466479909, 544179635, 3110523913, 3462522015, 1591671054, 702138776, 2966460450, 3352799412, 1504918807, 783551873, 3082640443, 3233442989, 3988292384, 2596254646, 62317068, 1957810842, 3939845945, 2647816111, 81470997, 1943803523, 3814918930, 2489596804, 225274430, 2053790376, 3826175755, 2466906013, 167816743, 2097651377, 4027552580, 2265490386, 503444072, 1762050814, 4150417245, 2154129355, 426522225, 1852507879, 4275313526, 2312317920, 282753626, 1742555852, 4189708143, 2394877945, 397917763, 1622183637, 3604390888, 2714866558, 953729732, 1340076626, 3518719985, 2797360999, 1068828381, 1219638859, 3624741850, 2936675148, 906185462, 1090812512, 3747672003, 2825379669, 829329135, 1181335161, 3412177804, 3160834842, 628085408, 1382605366, 3423369109, 3138078467, 570562233, 1426400815, 3317316542, 2998733608, 733239954, 1555261956, 3268935591, 3050360625, 752459403, 1541320221, 2607071920, 3965973030, 1969922972, 40735498, 2617837225, 3943577151, 1913087877, 83908371, 2512341634, 3803740692, 2075208622, 213261112, 2463272603, 3855990285, 2094854071, 198958881, 2262029012, 4057260610, 1759359992, 534414190, 2176718541, 4139329115, 1873836001, 414664567, 2282248934, 4279200368, 1711684554, 285281116, 2405801727, 4167216745, 1634467795, 376229701, 2685067896, 3608007406, 1308918612, 956543938, 2808555105, 3495958263, 1231636301, 1047427035, 2932959818, 3654703836, 1088359270, 936918e3, 2847714899, 3736837829, 1202900863, 817233897, 3183342108, 3401237130, 1404277552, 615818150, 3134207493, 3453421203, 1423857449, 601450431, 3009837614, 3294710456, 1567103746, 711928724, 3020668471, 3272380065, 1510334235, 755167117]));
        for (var e = -1, n = 0; n < t.length; n++)
            e = e >>> 8 ^ r.crcTable[255 & (e ^ t[n])];
        return (-1 ^ e) >>> 0
    }
    ,
    r.getRandomIntInclusive = function(r, t) {
        r = Math.ceil(r),
        t = Math.floor(t);
        var e = Math.random();
        return Math.floor(e * (t - r)) + r
    }
    ,
    r.test = function() {
        var t = r.floatToByteArray(1);
        e("float32 bytes : "),
        e(t);
        var n = r.byteArrayToFloat(t, 0);
        e("float32 value : " + n)
    }
    ,
    r
}()



var f = function () {
    function e() { }
    return e.handleRawData = function (e, r, o, u, h, p) {
        void 0 === h && (h = null),
            void 0 === p && (p = null);
        var f = u.createResponse()
            , g = null;
        try {
            if (null != e) {
                e || (e = "{}");
                var v = JSON.parse(e);
                f.initWithJson(o, v)
            } else
                f.initWithBytes(o, r);
            if (p && p(f),
                void 0 !== f.errorCode && f.errorCode != s.Success)
                i.isShowLog && (y && !d || t("HandleRawData.Get ServerException Response:\n" + f)),
                    g = a.createWithResponse(f, c.ServerException),
                    f.release();
            else if (f.isDecryptException)
                (g = a.createWithResponse(f, c.DecodeError)).errorMsg = "通讯数据解析失败",
                    g.setHandleType(l.KickToLogin),
                    g.addHandleType(l.Disconnect),
                    f.release();
            else if (f.isCrcCheckFail)
                (g = a.createWithResponse(f, c.CrcFail)).errorMsg = "通讯数据校验失败",
                    g.setHandleType(l.KickToLogin),
                    g.addHandleType(l.Disconnect),
                    f.release();
            else
                try {
                    h && h(f) || u && u.handleResponse(f),
                        f.release()
                } catch (e) {
                    (g = a.createWithResponse(f, c.DecodeError)).errorMsg = "处理数据时遇问题\n" + e,
                        g.setHandleType(l.ShowMsg),
                        f.release(),
                        n("处理数据时遇问题\n" + e.stack)
                }
        } catch (e) {
            (g = a.createWithResponse(f, c.HandleDataException)).errorMsg = "解析数据时遇问题\n" + e,
                g.setHandleType(l.ShowMsg),
                null == f || f.release(),
                n("解析数据时遇问题\n" + e.stack)
        }
        return g
    }
        ,
        e.xorBytes = function (e) {
            var r = e.length
                , t = [];
            r > 255 ? (t.push(255 & r),
                r >>= 8,
                t.push(255 & r)) : (t.push(r),
                    t.push(255 - r));
            for (var n = 0; n < e.length; ++n)
                e[n] = e[n] ^ t[n % t.length]
        }
        ,
        e.encrypt = function (r, t) {
            var n = new ByteArray(e.VERIFY_LENGTH + r.length);
            n.writeBytes(e.MAGIC),
                n.writeInt(t),
                n.writeLong(p.crc32FromUint8Array(r));
            var o = Math.max(1, Math.floor(r.length / 10))
                , a = Math.max(1, Math.floor(r.length / 3))
                , s = p.getRandomIntInclusive(o, a);
            (s = Math.max(0, s)) > 0 && (r = e.encryptData(r, s)),
                n.writeShort(s),
                n.writeInt(r.length),
                n.writeBytes(r);
            var i = n.getBytes();
            return this.xorBytes(i),
                i
        }
        ,
        e.encryptData = function (r, t) {
            var n = r.length;
            if (t <= 0 || t >= n)
                return r;
            var o = new Uint8Array(n)
                , a = Math.floor(n / t)
                , s = n % t
                , i = n
                , c = 0;
            0 != s && (i -= s,
                e.arrayCopy(r, i, o, c, s),
                c += s);
            for (var l = a - 1; l >= 0; l--)
                i -= t,
                    e.arrayCopy(r, i, o, c, t),
                    c += t;
            return o
        }
        ,
        e.decrypt = function (r) {
            if (r.length < e.VERIFY_LENGTH) {
                var t = new Error("decrypt error, length must be at least " + e.VERIFY_LENGTH + " but got " + r.length);
                t
            }
            this.xorBytes(r);
            for (var n = new ByteReader(r), o = n.readBytes(e.MAGIC.length), a = 0; a < o.length; a++)
                if (o[a] !== e.MAGIC[a]) {
                    var s = new Error("decrypt error, magic not equal.");
                    s
                }
            n.readInt();
            var i = n.readLong()
                , l = n.readShort();
            l = Math.max(1, l);
            var u = n.readInt()
                , y = e.decryptData(r, l, n.index, u)
                , d = p.crc32FromUint8Array(y);
            if (d != i) {
                var f = new Error("decrypt error, crc not equal, client:" + d + " server:" + i);
                f
            }
            return y
        }
        ,
        e.decryptData = function (r, t, n, o) {
            var a = o;
            if (t <= 0 || t >= a)
                return r.slice(n, n + o);
            var s = new Uint8Array(a)
                , i = Math.floor(a / t)
                , c = a % t
                , l = n
                , u = a;
            0 != c && (u -= c,
                e.arrayCopy(r, l, s, u, c),
                l += c);
            for (var h = i - 1; h >= 0; h--)
                u -= t,
                    e.arrayCopy(r, l, s, u, t),
                    l += t;
            return s
        }
        ,
        e.arrayCopy = function (e, r, t, n, o) {
            for (var a = 0; a < o; a++)
                t[a + n] = e[a + r]
        }
        ,
        e.httpGetText = function (e, r, t) {
            var n = new XMLHttpRequest;
            n.timeout = 1e3 * i.HTTP_TIMEOUT_SECS,
                n.open("GET", e, !0),
                n.onreadystatechange = function () {
                    if (4 == n.readyState)
                        if (n.status >= 200 && n.status < 400) {
                            var e = n.responseText;
                            r(null, e, t)
                        } else {
                            var o = "网络异常[" + n.status + "]";
                            r(o, null, t)
                        }
                }
                ,
                n.onerror = function () {
                    var e = "网络异常[" + n.status + "]";
                    r(e, null, t)
                }
                ,
                n.ontimeout = function () {
                    var e = "网络异常[" + n.status + "]";
                    r(e, null, t)
                }
                ;
            try {
                n.setRequestHeader("Content-Type", "application/json"),
                    n.responseType = "text",
                    n.send()
            } catch (e) {
                console.error(e),
                    r(e.message, null, t)
            }
        }
        ,
        e.getNetworkType = function (e) {
            e(o.getNetworkType())
        }
        ,
        e
}()


f.COLOR_REQUEST = "color:LightPink"
f.COLOR_RESPONSE = "color:lightgreen"
f.COLOR_PROTOCOL = "color:khaki"
f.COLOR_DATA = "color:LightSkyBlue"
f.VERIFY_LENGTH = 22
f.MAGIC = [76, 84, 90, 74]


// 请求协议头需指定 conten-type 为 application/octet-stream
// 支持将返回数据解密后加密
// 使用sunny net将返回数据解密得到json数据明文，修改json数据后，将json数据使用encrypt加密后替换即可

const ltzj = {

    // 传入json数据
    // 返回buffer数据
    encrypt: function (e, cmdSequence) {
        return f.encrypt(encodeText(e), cmdSequence)
    },

    // 传入json数据
    // 返回base64数据
    encrypt2bs64: function (e, cmdSequence) {
        const buffer = f.encrypt(encodeText(e), cmdSequence)
        return Buffer.from(buffer).toString('base64')
    },

    // 指定数据类型为arraybuffer
    // 类型错误则无法正常解密
    decrypt: function (e) {
        return decodeText(f.decrypt(e))
    },

    // 支持base64格式解密
    // 将返回的数据编码为base64后调用该方法
    // 返回json明文数据
    decrypt4bs64: function (e) {
        const buffer = Buffer.from(e, 'base64')
        return decodeText(f.decrypt(buffer))
    }
}

module.exports = ltzj
