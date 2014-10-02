var fortune = require('fortune');
var ddAPI = fortune({
    db: './db/dddb',
    baseUrl: 'http://gentle-forest-1449.herokuapp.com',
});

exports.up = function(next){
    next();
};

exports.down = function(next){
    next();
};
