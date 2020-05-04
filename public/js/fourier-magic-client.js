(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const ImageArray = require('./lib/image_array');

},{"./lib/image_array":2}],2:[function(require,module,exports){
/**
 * To 8*8 arrays
 */

function ImageArray() {

}

function fitting(size) {
    return Math.ceil(size / 8) * 8;
}

ImageArray.to = function (image, width, height, includeAlpha) {

    var fW = fitting(width);
    var fH = fitting(height);
    var stepW = fW / 8, stepH = fH / 8;

    var array = new Array(stepH);

    for (var y = 0; y < stepH; y++) {
        array[y] = new Array(stepW);

        for (var x = 0; x < stepW; x++) {

            var imageH8 = new Array(8);
            for (var i = 0; i < 8; ++i) {
                var imageW8 = new Array(8);
                imageH8[i] = (imageW8);
            }

            array[y][x] = imageH8;
        }
    }

    console.debug("Array initialised");

    /**
     * @todo
     * performance enhancement
     */
    var y, x, xi, yi, ay, ax;
    try{
        for (y = 0; y < fH; y++) {
            for (x = 0; x < fW; x++) {
                var idx = (width * y + x) << 2;
                
                // the index for the big array (stepW * stepH)
                yi = Math.floor(y / 8);
                xi = Math.floor(x / 8);

                // the index for the small array (8*8)
                ay = y % 8;
                ax = x % 8;

                array[yi][xi][ay][ax] = [];
                if (x >= (width) || y >= height) {
                    array[yi][xi][ay][ax].push(-1);
                    array[yi][xi][ay][ax].push(-1);
                    array[yi][xi][ay][ax].push(-1);
                    if (includeAlpha)
                        array[yi][xi][ay][ax].push(-1);
                }
                else {
                    array[yi][xi][ay][ax].push(image[idx]);
                    array[yi][xi][ay][ax].push(image[idx + 1]);
                    array[yi][xi][ay][ax].push(image[idx + 2]);

                    if (includeAlpha)
                        array[yi][xi][ay][ax].push(image[idx + 3]);
                }
            }
        }
    }
    catch (ex) {
        console.error(ex);
    }

    console.debug("Array data assigned");

    return array;
}

module.exports = ImageArray;
},{}]},{},[1]);
