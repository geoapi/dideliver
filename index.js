var db = require('./db'),
    Type = require('type-of-is'),
    express = db.express, 
    app = express(), 
    port = process.env.PORT || 4000,
    cors = require('cors'),
    rsvp = db.rsvp,
    ddAPI = db.api;

/*
var findMenuItems = function (ids, query, callback) {

    console.log('function called');
    var nameQuery = {'name': new RegExp(query, "i"), 'id': {$in : ids}};
    var descQuery = {'description': new RegExp(query, "i"), 'id': {$in : ids}};
    
    var promises = {
        name: ddAPI.adapter.find('menuItems', nameQuery),
        description: ddAPI.adapter.find('menuItems', descQuery)
    };
    
    console.log('Makes it above promises');
    rsvp.hash(promises).then(function(results) {
        console.log('Makes it to promises');
        var nameItems = results.name.menuItems;
        var descItems = results.description.menuItems;
        var items = {};

        nameItems.forEach(function(item) {
            items[item.id] = item;
        });

        descItems.forEach(function(item) {
            items[item.id] = item;
        });

        callback(items);
    });
    
};
*/
//Allow cors 
app.use(cors());


app.use(ddAPI.router);

//Query to get driver orders
app.get('/driver_orders/:id', function (req, res) {
    ddAPI.adapter.findMany('order', {driver:req.params.id}).then(function(orders) {
        res.json(orders);
    });
});


app.get('/uni_menu/:id', function(req, res) {

    ddAPI.adapter.find('university', {id:req.params.uni}).then(function(uni) {
        ddAPI.adapter.findMany('restaurant', uni.links.restaurants).then(function(rests) {
            var items = [];
            for (var i = 0; i<rests.length; i++) {
                items = items.concat(rests[i].links.menuItems);
            }
            ddAPI.adapter.findMany('menuItem', items).then(function(menuItems) {
                res.json(menuItems);
            });
        });
        /*
        console.log('rests found');
        console.log(restaurants);
        console.log('menuItems');
        console.log(restaurants.menuItems);
        ddAPI.adapter.findMany('menuItems', restaurants.menuItems).then(function(items) {
            res.json(items);
        });
        */
    });
});

//Query to search menu items
/*
app.get('/search/menuItems', function(req,res) {
    console.log('hits query');
    //If restaurant parameter
    if (req.query.restaurants) {
        ddAPI.adapter.find('restaurant', req.query.restaurants).then(function(restaurant) {
            findMenuItems(restaurant.restaurants[0].links.menuItems, req.query.search, function(items) {
                res.json(items);
            });
        });
    //If restaurant type parameter
    } else if (req.query.types) {
        ddAPI.adapter.find('restaurantType', req.query.types).then(function(types) {
            ids = [];
            types.restaurantTypes.forEach(function(type) {
                ids.concat(type.links.restaurants);
            });
            ddAPI.adapter.findMany('restaurant', ids).then(function(restaurants) {
                menuIds = [];
                restaurants.restaurants.forEach(function(rest) {
                    menuIds.concat(rest.links.menuItems);
                });
                findMenuItems(ids, req.query.search, function(items) {
                    res.json(items);
                }); 
            });
        });
    //Search query
    } else {
        console.log('hits search');
        console.log('uni-query ' +req.query.uni);
        ddAPI.adapter.find('university', req.query.uni).then(function(uni) {
            console.log('uni found');
            findMenuItems(uni.universities[0].links.restaurants, req.query.search, function(items) {
                console.log('makes it to callback');
                res.json(items);
            });
        });
    }
});
*/

app.get('/', function(req, res) {
    res.send('Hello, you have reached the API.');
});

app.listen(port);

console.log('Listening on port ' + port + '...');



