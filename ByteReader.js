// 假设 t 是一个包含相关转换方法的库
const t = {
    byteArrayToInteger: (buffer, offset, length) => {
        let value = 0;
        for (let i = 0; i < length; i++) {
            value |= (buffer[offset + i] << (8 * (length - 1 - i)));
        }
        return value;
    },
    byteArrayToFloat: (buffer, offset) => {
        let array = new Float32Array(buffer.buffer, offset, 1);
        return array[0];
    },
    byteArrayToDouble: (buffer, offset) => {
        let array = new Float64Array(buffer.buffer, offset, 1);
        return array[0];
    },
    byteArrayToString: (buffer, offset, length) => {
        let array = new Uint8Array(buffer.buffer, offset, length);
        return new TextDecoder().decode(array);
    }
};

function ByteReader(e) {
    this.buffer = null;
    this.index = 0;
    this.buffer = e;
    this.index = 0;
}

var proto = ByteReader.prototype;

proto.checkSize = function(e) {
    return !(this.index + e > this.buffer.length);
};

proto.readByte = function() {
    if (this.checkSize(1)) {
        var e = this.buffer[this.index];
        this.index += 1;
        return e;
    }
    return 0;
};

proto.readShort = function() {
    return this.readInteger(2);
};

proto.readInt = function() {
    return this.readInteger(4);
};

proto.readLong = function() {
    return this.readInteger(8);
};

proto.readInteger = function(e) {
    if (this.checkSize(e)) {
        var r = t.byteArrayToInteger(this.buffer, this.index, e);
        this.index += e;
        return r;
    }
    return 0;
};

proto.readFloat = function() {
    if (this.checkSize(4)) {
        var e = t.byteArrayToFloat(this.buffer, this.index);
        this.index += 4;
        return e;
    }
    return 0;
};

proto.readDouble = function() {
    if (this.checkSize(8)) {
        var e = t.byteArrayToDouble(this.buffer, this.index);
        this.index += 8;
        return e;
    }
    return 0;
};

proto.readBytes = function(e) {
    if (this.checkSize(e)) {
        var r = this.buffer.subarray(this.index, this.index + e);
        this.index += e;
        return r;
    }
    return new Uint8Array(0);
};

proto.readUtf = function() {
    var e = this.readShort();
    if (e > 0) {
        var r = t.byteArrayToString(this.buffer, this.index, e);
        this.index += e;
        return r;
    }
    return "";
};

// 导出ByteReader，以便在其他文件中使用
module.exports = ByteReader;
