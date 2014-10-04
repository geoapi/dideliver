var fortune = require('fortune');
var rsvp = fortune.RSVP;
var db = require('../db');
var ddAPI = db.api;


exports.up = function(next){
    ddAPI.adapter.find('restaurant', {name:"Sandeep's Palace"}).then(function(resource) {
        var item1 = ddAPI.adapter.create('menuItem', {
            name:"Beef Curry",
            price:10.00,
            description:"It's a curry.",
            restaurant:resource.id
        });
        var item2 = ddAPI.adapter.create('menuItem', {
            name:"Chicken Curry",
            price:10.00,
            description:"It's a curry.",
            restaurant:resource.id
        });
        var item3 = ddAPI.adapter.create('menuItem', {
            name:"Naan Bread",
            price:3.00,
            description:"It's a bread.",
            restaurant:resource.id
        });
        rsvp.all([item1, item2, item3]).then(function(results) {
            var itemIds = [];
            results.forEach(function(result) {
                itemIds.push(result.id);
            });
            ddAPI.adapter.update('restaurant', resource.id, {menuItems:itemIds});
        });
    });
    ddAPI.adapter.find('restaurant', {name:"Gabby's Yum Cha"}).then(function(resource) {
        var item1 = ddAPI.adapter.create('menuItem', {
            name:"BBQ Pork Buns",
            price:10.00,
            description:"Some Pork Buns.",
            restaurant:resource.id
        });
        var item2 = ddAPI.adapter.create('menuItem', {
            name:"Prawn Dumplings",
            price:10.00,
            description:"Some dumplings.",
            restaurant:resource.id
        });
        rsvp.all([item1, item2]).then(function(results) {
            var itemIds = [];
            results.forEach(function(result) {
                itemIds.push(result.id);
            });
            ddAPI.adapter.update('restaurant', resource.id, {menuItems:itemIds});
        });
    });
    next();
};

exports.down = function(next){
    ddAPI.adapter.findMany('menuItem').next(function(resources) {
        resources.forEach(function(resource) {
            ddAPI.adapter.delete('menuItem', resource.id); 
        }); 
    });
    next();
};
