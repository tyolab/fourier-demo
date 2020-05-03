var fs = require("fs"),
  PNG = require("pngjs").PNG;

const ImageArray = require('./lib/image_array');
const block = require('./block');
 
fs.createReadStream("public/images/demo.png")
  .pipe(
    new PNG({
      filterType: 4,
    })
  )
  .on("parsed", function () {

    console.log("image height: " + this.height + ", width: " + this.width);

    var array = ImageArray.to(this.data, this.width, this.height);
 
    // this.pack().pipe(fs.createWriteStream("out.png"));
  });

  