// 假设 i 是一个包含相关转换方法的库
const i = {
    // 示例实现，具体实现需要根据实际情况来
    convertToByte: (value) => value & 0xFF,
    shortToByteArray: (value) => new Uint8Array([(value & 0xFF00) >> 8, value & 0xFF]),
    intToByteArray: (value) => new Uint8Array([(value & 0xFF000000) >>> 24, (value & 0xFF0000) >>> 16, (value & 0xFF00) >>> 8, value & 0xFF]),
    longToByteArray: (value) => {
        // JavaScript中通常使用Number来表示64位整数，这里只是一个示例
        let high = Math.floor(value / 0x100000000);
        let low = value & 0xFFFFFFFF;
        return new Uint8Array([
            (high & 0xFF000000) >>> 24, (high & 0xFF0000) >>> 16, (high & 0xFF00) >>> 8, high & 0xFF,
            (low & 0xFF000000) >>> 24, (low & 0xFF0000) >>> 16, (low & 0xFF00) >>> 8, low & 0xFF
        ]);
    },
    floatToByteArray: (value) => {
        let buffer = new ArrayBuffer(4);
        (new Float32Array(buffer))[0] = value;
        return new Uint8Array(buffer);
    },
    doubleToByteArray: (value) => {
        let buffer = new ArrayBuffer(8);
        (new Float64Array(buffer))[0] = value;
        return new Uint8Array(buffer);
    },
    utf16ToUtf8Array: (value) => {
        // 这里需要一个实际的UTF-16到UTF-8的转换实现
        // 以下代码只是一个占位符
        return new TextEncoder().encode(value);
    }
};

function ByteArray(t) {
    this.buffer = null;
    this.index = 0;
    this.length = 0;
    this.buffer = new Uint8Array(t);
    this.length = t;
}

var proto = ByteArray.prototype;

proto.writeBytes = function(t) {
    this.checkSize(t.length);
    this.buffer.set(t, this.index);
    this.index += t.length;
};

proto.writeByte = function(t) {
    this.checkSize(1);
    this.buffer[this.index] = i.convertToByte(t);
    this.index += 1;
};

proto.writeShort = function(t) {
    var e = i.shortToByteArray(t);
    this.writeBytes(e);
};

proto.writeInt = function(t) {
    var e = i.intToByteArray(t);
    this.writeBytes(e);
};

proto.writeLong = function(t) {
    var e = i.longToByteArray(t);
    this.writeBytes(e);
};

proto.writeFloat = function(t) {
    var e = i.floatToByteArray(t);
    this.writeBytes(e);
};

proto.writeDouble = function(t) {
    var e = i.doubleToByteArray(t);
    this.writeBytes(e);
};

proto.writeUtf = function(t) {
    var e = i.utf16ToUtf8Array(t);
    this.writeShort(e.length);
    this.writeBytes(e);
};

proto.checkSize = function(t) {
    if (this.index + t > this.length) {
        this.expandBuffer();
    }
};

proto.expandBuffer = function() {
    var t = new Uint8Array(2 * this.length);
    t.set(this.buffer, 0);
    this.length *= 2;
    this.buffer = t;
};

proto.readByte = function() {
    if (this.checkSize(1)) {
        var e = this.buffer[this.index];
        return this.index += 1,
        e
    }
    return 0
}
,
proto.readShort = function() {
    return this.readInteger(2)
}
,
proto.readInt = function() {
    return this.readInteger(4)
}
,
proto.readLong = function() {
    return this.readInteger(8)
}
,
proto.readInteger = function(e) {
    if (this.checkSize(e)) {
        var r = t.byteArrayToInteger(this.buffer, this.index, e);
        return this.index += e,
        r
    }
    return 0
}
,
proto.readFloat = function() {
    if (this.checkSize(4)) {
        var e = t.byteArrayToFloat(this.buffer, this.index);
        return this.index += 4,
        e
    }
    return 0
}
,
proto.readDouble = function() {
    if (this.checkSize(8)) {
        var e = t.byteArrayToDouble(this.buffer, this.index);
        return this.index += 8,
        e
    }
    return 0
}
,
proto.readBytes = function(e) {
    if (this.checkSize(e)) {
        var r = this.buffer.subarray(this.index, e);
        return this.index += e,
        r
    }
    return new Uint8Array(0)
}
,
proto.readUtf = function() {
    var e = this.readShort();
    if (e > 0) {
        var r = t.byteArrayToString(this.buffer, this.index, e);
        return this.index += e,
        r
    }
    return ""
}

proto.getBytes = function() {
    return this.buffer.subarray(0, this.index);
};

// 导出ByteArray，以便在其他文件中使用
module.exports = ByteArray;
