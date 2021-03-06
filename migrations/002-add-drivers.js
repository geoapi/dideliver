var db = require('../db');
var ddAPI = db.api;

exports.up = function(next){
    ddAPI.adapter.find('university', {name:'UNSW'}).then(function(uni) {
        ddAPI.adapter.create('user', {
            username:'driver1', 
            firstname:'John',
            lastname:'Doe',
            email:'john.doe@domain.com',
            phone:'123456789',
            university:uni.id,
            userType:db.DRIVER_TYPE
        });
        ddAPI.adapter.create('user', {
            username:'driver2', 
            firstname:'James',
            lastname:'Doe',
            email:'james.doe@domain.com',
            phone:'123456789',
            university:uni.id,
            userType:db.DRIVER_TYPE
        });
    });
    ddAPI.adapter.find('university', {name:'Sydney University'}).then(function(uni) {
        ddAPI.adapter.create('user', {
            username:'driver3', 
            firstname:'Jimmy',
            lastname:'Doe',
            email:'jimmy.doe@domain.com',
            phone:'123456789',
            university:uni.id,
            userType:db.DRIVER_TYPE
        });
        ddAPI.adapter.create('user', {
            username:'driver4', 
            firstname:'Dante',
            lastname:'Doe',
            email:'dante.doe@domain.com',
            phone:'123456789',
            university:uni.id,
            userType:db.DRIVER_TYPE
        });
    });
    next();
};

exports.down = function(next){
    ddAPI.adapter.findMany('user', {userType:db.DRIVER_TYPE}).next(function(users) {
        users.forEach(function(user) {
            ddAPI.adapter.delete('user', user.id); 
        }); 
    });
    next();
};
