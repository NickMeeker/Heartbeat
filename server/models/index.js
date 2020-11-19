var fs = require('fs');

fs.readdirSync('./models').forEach(function (file) {
  if (file.indexOf(".js") > -1 && file != "index.js")
    exports[file.replace('.js', '')] = require('./' + file);
});