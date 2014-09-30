var fortune = require('fortune'), express = fortune.express;
var container = express(), port = process.env.PORT || 4000;
var ddAPI = fortune({
    db: './db/restaurant',
    baseUrl: 'http://gentle-forest-1449.herokuapp.com'
});


//TODO comments

//TODO add authentication


ddAPI.resource('restaurant',{
    name:String,
    manager: {ref:'user', inverse:'restaurant'},
    email:String,
    phone:String,
    restaurantTypes: [{ref:'restaurantType', inverse:'restaurants'}],
    address:String,
    menuItems: [{ref:'menuItem', inverse:'restaurant'}]
    orders : [{ref:'order', inverse:'restaurant'}]
});


ddAPI.resource('restaurantType', {
    name:String,
    restaurants: [{ref:'restaurant', inverse:'restaurantTypes'}]
});


ddAPI.resource('menuItem', {
    name:String,
    price:Number,
    image:String,
    Description:String,
    restaurant: {ref:'restaurant', inverse:'menuItems'}
});


ddAPI.resource('user', {
    username: String,
    firstname: String,
    lastname: String,
    email: String,
    phone: String,
    university: String,
    restaurant: {ref:'restaurant', inverse:'manager'}, 
    ordersMade: [{ref:'order', inverse:'customer'}],
    ordersToDeliver: [{ref:'order', inverse:'driver'}],
    userType: {ref: 'userType', inverse:'users'}
});


ddAPI.resource('userType', {
    name:String,
    users: [{ref:'users', inverse:'userType'}]
});


//TODO assign driver on creation
ddAPI.resource('order', {
    restaurant:{ref:'restaurant', inverse:'orders'},
    menuItems:[{ref:'menuItem', inverse:null}],
    customer:{ref:'user', inverse:'ordersMade'},
    driver:{ref:'user', inverse:'ordersToDeliver'},
    delivery_address: String,
    delivery_cost: Number,
    cost:Number,
    created:Date,
    statusCode:String
});


//TODO add socketIO order updates

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

