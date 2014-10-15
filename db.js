var fortune = require('fortune'),
    RSVP = fortune.RSVP,
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

ddAPI.before('order', function() {
    var order = this;
    return new RSVP.promise(function (resolve, reject) {
        var query = {};
        query['userType'] = driver;
        ddAPI.adapter.findMany('user', query).then(function(users) {
            console.log(users);
            resolve(order);
        }); 
    });
});
