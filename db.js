var fortune = require('fortune')
var RSVP = fortune.RSVP
var uristring = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 
                'mongodb://localhost/dd';
var ddAPI = fortune({
    adapter:'mongodb',
    connectionString:uristring
});

var driver = 1, manager = 2, customer = 3;

module.exports = {
    api:ddAPI, 
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
    Description:String,
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
}).transform(
    //TODO generate cost of order
    //before storing in database assign driver
    function(request) {
        var order = this;

        return new RSVP.promise(function (resolve, reject) {
            ddAPI.adapter.findMany('user', {userType:driver, university:order.university})
                .then(function (users) {
                    setOrderDriver(users);
                });

            function setOrderDriver(users) {
                if (users.length == 0) {
                    reject();
                }
                var orderCount = Number.MAX_VALUE;
                var leastUser;
                users.forEach(function(user) {
                    if (user.ordersToDeliver.length < orderCount) {
                        leastUser = user;
                        orderCount = user.ordersToDeliver.length;
                    }
                });

                order.created = new Date();
                order.driver = leastUser.id;
                resolve(order);
            }
       });
    },
    //After order insertion -- probably broadcast on websocket
    //TODO add socketIO for order updates
    function() {
        return this;
    }
);
