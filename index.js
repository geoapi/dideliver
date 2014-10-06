var fortune = require('fortune'), 
    express = fortune.express, 
    app = express(), 
    port = process.env.PORT || 4000,
    cors = require('cors'),
    uristring = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/dd';

var driver = 1, manager = 2, customer = 3;
//Allow cors 
app.use(cors());


var ddAPI = fortune({
    adapter:'mongodb',
    connectionString:uristring,
    cors:true
});


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
}, {cors:true});


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
})/*.transform(
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
)*/;

app.use(ddAPI.router);

//Query to get driver orders
app.get('/driver_orders/:id', function (req, res) {
    ddAPI.adapter.findMany('order', {driver:req.params.id}).then(function(orders) {
        res.json(orders);
    });
});


app.get('/', function(req, res) {
    res.send('Hello, you have reached the API.');
});

app.listen(port);

console.log('Listening on port ' + port + '...');

