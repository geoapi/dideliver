var fortune = require('fortune');
var ddAPI = fortune({
    db: './db/dddb',
    baseUrl: 'http://gentle-forest-1449.herokuapp.com',
    adapter: 'nedb'
});

exports.up = function(next){
    ddAPI.adapter.create('userType', {name:'driver'});
    ddAPI.adapter.create('userType', {name:'customers'});
    ddAPI.adapter.create('userType', {name:'managers'});
    next();
};

exports.down = function(next){
    ddAPI.adapter.findMany('userType').next(function(types) {
        types.forEach(function(type) {
            ddAPI.adapter.delete('userType', type.id); 
        }); 
    });    
    next();
};
