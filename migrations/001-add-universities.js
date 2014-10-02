var fortune = require('fortune');
var ddAPI = fortune({
    db: './db/dddb',
    baseUrl: 'http://gentle-forest-1449.herokuapp.com',
});

exports.up = function(next){
    ddAPI.adapter.create('university', {name:'UNSW'});
    ddAPI.adapter.create('university', {name:'Sydney University'});
    next();
};

exports.down = function(next){
    ddAPI.adapter.findMany('university').next(function(unis) {
        unis.forEach(function(uni) {
            ddAPI.adapter.delete('university', uni.id); 
        }); 
    });
    next();
};
