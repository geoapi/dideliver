var db = require('../db');
var ddAPI = db.api;

//New -> Prepared -> PickedUp -> Delivered
exports.up = function(next){
    ddAPI.adapter.create('order', {
        deliveryAddress: "Level 4, Room 403 Building K17",
        deliveryGPSPoint: '-33.918941, 151.231036',
        deliveryCost: 3.50,
        cost:23.00,
        created:new Date(),
        statusCode:"Prepared"
    }).then(function (order) {
        ddAPI.adapter.find('restaurant', {name:"Sandeep's Palace"}).then(function(resource) {
            ddAPI.adapter.update('order', order.id, { 
                restaurant:resource.id, 
                university:resource.university,
                menuItems:resource.menuItems
            });
        });

        ddAPI.adapter.find('user', {username:'cust1'}).then(function (resource) {
             ddAPI.adapter.update('order', order.id, { 
                 customer:resource.id
            });
        });

        ddAPI.adapter.find('user', {username:'driver1'}).then(function (resource) {
             ddAPI.adapter.update('order', order.id, { 
                 driver:resource.id
            });
        });
    });

    ddAPI.adapter.create('order', {
        deliveryAddress: "Level 2, Room 201 Building K17",
        deliveryGPSPoint: "-33.918941, 151.231036", 
        deliveryCost: 3.50,
        cost:23.00,
        created:new Date(),
        statusCode:"Prepared"
    }).then(function (order) {
        ddAPI.adapter.find('restaurant', {name:"Sandeep's Palace"}).then(function(resource) {
            ddAPI.adapter.update('order', order.id, { 
                restaurant:resource.id, 
                university:resource.university,
                menuItems:resource.menuItems
            });
        });

        ddAPI.adapter.find('user', {username:'cust2'}).then(function (resource) {
             ddAPI.adapter.update('order', order.id, { 
                 customer:resource.id
            });
        });

        ddAPI.adapter.find('user', {username:'driver2'}).then(function (resource) {
             ddAPI.adapter.update('order', order.id, { 
                 driver:resource.id
            });
        });
    });
    
    next();
};

exports.down = function(next){
  next();
};
