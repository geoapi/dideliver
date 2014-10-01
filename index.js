var fortune = require('fortune'), express = fortune.express;
var container = express(), port = process.env.PORT || 4000;
var ddAPI = fortune({
    db: './db/dddb',
    baseUrl: 'http://gentle-forest-1449.herokuapp.com',
    adapter: 'nedb'
});

var driverType = "";

if (!('DRIVER_TYPE' in process.env)) {
    ddAPI.find('userType', {name:'driver'}).next(function(driverType) {
        driverType = driverType.id;
    });
}

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
    menuItems: ['menuItem']
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
    userType: 'userType'
});


ddAPI.resource('userType', {
    name:String,
}).readOnly();


ddAPI.resource('university', {
    name:String,
}).readOnly();


ddAPI.resource('order', {
    restaurant:'restaurant',
    menuItems:['menuItem'],
    customer:{ref:'user', inverse:'ordersMade'},
    driver:{ref:'user', inverse:'ordersToDeliver'},
    university:'university',
    delivery_address: String,
    delivery_cost: Number,
    cost:Number,
    created:Date,
    statusCode:String
}).transform(
    //before storing in database
    function() {
        var order = this;
        order.created = new Date();
        ddAPI.adpater.findMany('user', {userType:driverType, university:this.university}).then(
            //Found
            function(users) {
                //Find driver with lowest delivery count, and assign delivery to them
                var orderCount = Number.MAX_VALUE;
                var leastUser;
                users.forEach(function(user) {
                    if (user.ordersToDeliver.length < orderCount) {
                        leastUser = user;
                        orderCount = user.ordersToDeliver.length;
                    }
                }
                order.driver = user.id;
            },
            //Error
            function() {
                throw new Error("Couldn't find driver for university");
            }
        );
        return order;
    },
    //After order insertion -- probably broadcast on websocket
    //TODO add socketIO for order updates
    function() {
        return this;
    }
);


//TODO Create custom queries


container.use(ddAPI.router);
container.get('/', function(req, res) {
    res.send('Hello, you have reached the API.');
});

container.get('/restaurants', function(req,res){
    res.send(req.body.text );
});


container.get('/drivers', function(req,res){
    res.send(req.body.text);
});

container.listen(port);

console.log('Listening on port ' + port + '...');

