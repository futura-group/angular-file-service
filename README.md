# angular-file-service

angular service for File manipulation

## Installation

- 'npm install angular-file-service'
- usable scripts are under your 'node_modules/angular-file-service/dist'

**Important note**: this module is not in commonJS format

## Usage

use the service as a function to get a file interface for getting data from
a file.

```javascript
// Declare 'angluar.file' as your dependency
var app = angular.module('myApp', [
    'angular.file'
]);

app.controller('myController', ['$document', 'fileOperator', function ($document, fileOperator) {

    // get File from Dom or somewhere else
    var fileOnDom = $document.getElementById('input-file').files[0];

    // pass to fileOperator, now you got the file interface
    var file = fileOperator(fileOnDom);

    // read the file, it will return a promise
    file.read().then(function () {
        // once the promise resolved, you start to get data
        var b64_content = file.getBase64();
        // ...
    });

}]);
```

file interface has these operators:

- `read([start, [end]])`: read a chunk start from `start` to `end` (excluded),
   return a promise which will be resolved once the file is fully loaded,
   and will be rejected if something goes wrong
- `abort`: cancel the loading process and **resolve** the promise.

and these getters:

- `getBase64([start, [legth]])`
- `getMd5([start, [legth]])`
- `getUint8Array([start, [legth]])`
- `getArrayBuffer([start, [legth]])` (**May cause memory copy if `length` and `start` are given,
   use carefully if file is huge**)

one important detail is that `start` and `length` in getters are based on the
current slice, not the whole file. So if you:

```javascript
// Read part of the file
file.read(100, 500).then(function () {
    var base64 = file.getBase64(50, 100);
    // the base64 string is the data from (50th to 100th) byte
    // of current slice, so it is the (100+50)th to (100+50+100)th byte
    // in the original file
});
```

## Credit

In order to avoid uneccesary memory copy, some modification has been 
done to the modules below, so a modified version is packed in thie moudle
instead of the original one.

- base64 encoder is from [base64-bufferarray]()
- md5 encoder is from [SparkMD5]()

[base64-bufferarray]: https://github.com/niklasvh/base64-arraybuffer
[SaprkMD5]: https://github.com/satazor/SparkMD5

## Author
- Chriest Yu <jcppman@gmail.com>

**Issues & PRs are welcome!**

