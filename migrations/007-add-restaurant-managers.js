var db = require('../db');
var ddAPI = db.api;

exports.up = function(next){
    ddAPI.adapter.find('restaurant', {name:"Sandeep's Palace"}).then(function(resource) {
        ddAPI.adapter.create('user', {
            username:'manager1', 
            firstname:'Sandeep',
            lastname:'Doe',
            email:'sandeep.doe@domain.com',
            phone:'123456789',
            university:resource.university,
            userType:db.MANAGER_TYPE,
            restaurant:resource.id
        });
    });
    ddAPI.adapter.find('restaurant', {name:"Gabby's Yum Cha"}).then(function(resource) {
        ddAPI.adapter.create('user', {
            username:'manager2', 
            firstname:'Gabby',
            lastname:'Doe',
            email:'gabby.doe@domain.com',
            phone:'123456789',
            university:resource.university,
            userType:db.MANAGER_TYPE,
            restaurant:resource.id
        });
    });
    next();
};

exports.down = function(next){
    ddAPI.adapter.findMany('user', {userType:db.MANAGER_TYPE}).next(function(users) {
        users.forEach(function(user) {
            ddAPI.adapter.delete('user', user.id); 
        }); 
    });
    next();
};
