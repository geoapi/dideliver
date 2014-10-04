var db = require('../db');
var ddAPI = db.api;

exports.up = function(next){
    ddAPI.adapter.create('restaurantType', {name:'Indian'});
    ddAPI.adapter.create('restaurantType', {name:'Chinese'});
    next();
};

exports.down = function(next){
    ddAPI.adapter.findMany('restaurantType').next(function(types) {
        types.forEach(function(type) {
            ddAPI.adapter.delete('restaurantType', type.id); 
        }); 
    });
    next();
};
