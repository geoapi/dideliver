var fortune = require('fortune'), express = fortune.express;
var container = express(), port = process.env.PORT || 4000;
var RSVP = fortune.RSVP;
var ddAPI = fortune({
    db: './db',
    baseUrl: 'http://gentle-forest-1449.herokuapp.com',
});


//TODO comments

//TODO add authentication

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
}).readOnly();


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
    //before storing in database assign driver
    function(request) {
        var order = this;

        return new RSVP.promise(function (resolve, reject) {
            ddAPI.adapter.findMany('user', {userType:process.env.DRIVER_TYPE, university:order.university})
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

container.use(ddAPI.router);

//Query to get driver orders
container.get('/driver_orders/:id', function (req, res) {
    ddAPI.adapter.findMany('order', {driver:req.params.id}).then(function(orders) {
        res.json(orders);
    });
});


container.get('/', function(req, res) {
    res.send('Hello, you have reached the API.');
});

container.listen(port);

console.log('Listening on port ' + port + '...');

