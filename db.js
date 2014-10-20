var fortune = require('fortune'),
    RSVP = fortune.RSVP,
    _ = require('lodash'),
    uristring = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/dd',
    ddAPI = fortune({
        adapter:'mongodb',
        connectionString:uristring,
        cors:false
    });

var driver = 1, manager = 2, customer = 3;


module.exports = {
    api:ddAPI, 
    express:fortune.express,
    rsvp:fortune.rsvp,
    DRIVER_TYPE:driver,
    MANAGER_TYPE:manager,
    CUSTOMER_TYPE:customer
};


ddAPI.resource('restaurant',{
    name:String,
    manager: 'user',
    email:String,
    phone:String,
    restaurantTypes: ['restaurantType'],
    address:String,
    university:'university',
    menuItems: ['menuItem'],
    orders : ['order']
});


ddAPI.resource('restaurantType', {
    name:String,
    restaurants: ['restaurant']
});


ddAPI.resource('menuItem', {
    name:String,
    price:Number,
    image:String,
    description:String,
    restaurant: 'restaurant'
});


ddAPI.resource('user', {
    username: String,
    firstname: String,
    lastname: String,
    email: String,
    phone: String,
    university: 'university',
    restaurant: 'restaurant', 
    ordersMade: [{ref:'order', inverse:'customer'}],
    ordersToDeliver: [{ref:'order', inverse:'driver'}],
    userType: Number //1 = driver, 2 = restaurant manager, 3 = user
});


ddAPI.resource('university', {
    name:String,
    restaurants:['restaurant']
});


ddAPI.resource('order', {
    restaurant:'restaurant',
    menuItems:['menuItem'],
    customer:{ref:'user', inverse:'ordersMade'},
    driver:{ref:'user', inverse:'ordersToDeliver'},
    university:'university',
    deliveryAddress: String,
    deliveryGPSPoint: String,
    deliveryCost: Number,
    cost:Number,
    created:Date,
    statusCode:String
});

ddAPI.before('order', function(request) {
    var order = this;
    return new RSVP.Promise(function(resolve, reject) {
        //get all drivers
        ddAPI.adapter.findMany('user', {'userType':1}).then(function(resource) {
            //Find all current orders for each driver
            var promises = _.zipObject(_.pluck(resource, 'id'), (resource || []).map(function(driver) {
                return ddAPI.adapter.findMany('order', {'driver':driver.id});
            }));
            RSVP.hash(promises).then(function(resources) {
                //Find driver with least amount of orders
                var size = false;
                var id = false;
                _.forIn(resources, function(value, key) {
                    if (!id) {
                        id = key;
                        size = value.length;
                    } else if (value.length < size) {
                        id = key;
                        size = value.length;
                    }
                });
                
                order.created = new Date();
                order.driver = id;
                resolve(order);
            });
        });
    });
});
