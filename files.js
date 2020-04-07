'use strict';

module.exports = function(app){
  app.get('/user-images/:filename', function(req, res) {
    var filename = req.params.filename.replace(/'/g, '');
    res.sendFile(path.resolve('./dist/App/assets/images/user/' + filename));
  });
}
