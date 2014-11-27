(function () {
'use strict';
angular.module('angular.file', [])
    .factory('fileOperator', ['$window', '$q', function ($window, $q) {
        var fileReader = new $window.FileReader();

        function FileOperator (file) {
            this.file = file;
            this.buffer = null;
            this.fileSize = 0;
            this.status = 'init';
            this.messages = [];
        }
        FileOperator.prototype.read = function () {
            var that = this;
            return $q(function (resolve, reject) {
                if(!that.file) {
                    return reject(new Error('read','invalid file instance'));
                }
                // bind onloadend handler 
                fileReader.onloadend = function (msg) {
                    that.buffer = fileReader.result;
                    that.fileSize = that.buffer.byteLength;
                    resolve('file loaded');
                };
                fileReader.onerror = function (msg) {
                    reject(new Error('read', msg));
                };
                fileReader.onabort = function (msg) {
                    resolve(msg);
                };
                fileReader.readAsArrayBuffer(that.file);
            });
        };
        FileOperator.prototype.abort = function () {
            fileReader.abort();
        };
        FileOperator.prototype.getArrayBuffer = function (start, length) {
            if(start === 0 && length === this.fileSize) {
                // if user request for the whole arraybuffer, return it 
                // directly to avoid memory copy
                return this.buffer;
            }
            return this.buffer.slice(start, start + length);
        };
        FileOperator.prototype.getUint8Array = function (start, length) {
            var range = getRange(start, length, this.fileSize);
            return new Uint8Array(this.buffer, range[0], range[1]);
        };
        FileOperator.prototype.getBase64 = function (start, length) {
            return toBase64(this.getUint8Array(start, length));
        };
        FileOperator.prototype.getMd5 = function (start, length) {
            return md5(this.getUint8Array(start, length));
        };

        return function ServiceConstructor(file) {
            // When invoke this service, it will return a function,
            // service user can use it as a file loader, which will
            // return a file operator instance 
            return new FileOperator(file);
        };

        // Private Functions
        function getRange (start, length, fileSize) {
            start = (start && (start > 0)) ? start : 0;
            length = (length && (start + length < fileSize)) ? length : fileSize - start;
            return [start, length];
        }
        // Function below is from base64-arraybuffer
        //   https://github.com/niklasvh/base64-arraybuffer
        function toBase64 (bytes) {
            var i, len = bytes.length, base64 = "",
                chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

            for (i = 0; i < len; i+=3) {
              base64 += chars[bytes[i] >> 2];
              base64 += chars[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)];
              base64 += chars[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)];
              base64 += chars[bytes[i + 2] & 63];
            }

            if ((len % 3) === 2) {
              base64 = base64.substring(0, base64.length - 1) + "=";
            } else if (len % 3 === 1) {
              base64 = base64.substring(0, base64.length - 2) + "==";
            }

            return base64;
        }
        function md5 (bytes) {
            return SparkMD5.hash(bytes);
        }
    }]);
})();
