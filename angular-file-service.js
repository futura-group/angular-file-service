(function () {
'use strict';
angular.module('angular.file')
    .factory(['$window', function ($window) {
        // get global vars
        var FileReader = $window.FileReader;

        function FileOperator (file) {
            this._file = file;
            this._buffer = FileReader.readAsBufferArray(file);
            this._fileSize = this._buffer.byteLength;
        }
        FileOperator.prototype.getBase64 = function (start, length) {
            return _btoa(this._buffer, start, length);
        };
        FileOperator.prototype.getMd5 = function (start, length) {
            return _md5(this._buffer, start, length);
        };

        return function ServiceConstructor(file) {
            // When invoke this service, it will return a function,
            // service user can use it as a file loader, which will
            // return a file operator instance 
            return new FileOperator(file);
        };

        // Private Functions
        function _btoa (arraybuffer, start, length) {
            // use != undefined to include both 'undefined' and 'null'
            start = (start != undefined) ? start : 0;
            length = (length != undefined) ? length : arraybuffer.byteLength - start;

            var bytes = new Uint8Array(arraybuffer, start, length),
            i, len = bytes.length, base64 = "";

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

        function _md5 (arraybuffer, start, length) {
        }

    }]);
})();
