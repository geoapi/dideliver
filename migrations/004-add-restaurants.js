var db = require('../db');
var ddAPI = db.api;

exports.up = function(next){

    ddAPI.adapter.create('restaurant', {
        name:"Sandeep's Palace",
        email:'contact@thepalace.com',
        phone:'123456789',
        address:'101 Main Street',
    }).then(function (restaurant) {
        ddAPI.adapter.find('restaurantType', {name:'Indian'}).then(function(type) {
            ddAPI.adapter.update('restaurant', restaurant.id, {restaurantTypes:[type.id]});
        });

        ddAPI.adapter.find('university', {name:'UNSW'}).then(function(uni) {
            ddAPI.adapter.update('restaurant', restaurant.id, {university:uni.id});
        });
    });

    ddAPI.adapter.create('restaurant', {
        name:"Gabby's Yum Cha",
        email:'contact@yumcha.com',
        phone:'123456789',
        address:'102 Main Street',
    }).then(function (restaurant) {
        ddAPI.adapter.find('restaurantType', {name:'Chinese'}).then(function(type) {
            ddAPI.adapter.update('restaurant', restaurant.id, {restaurantTypes:[type.id]});
        });

        ddAPI.adapter.find('university', {name:'Sydney University'}).then(function(uni) {
            ddAPI.adapter.update('restaurant', restaurant.id, {university:uni.id});
        });
    });

    
    next();
};

exports.down = function(next){
    ddAPI.adapter.findMany('restaurant').next(function(resources) {
        resources.forEach(function(resource) {
            ddAPI.adapter.delete('restaurant', resource.id); 
        }); 
    });
    next();
};
