var db = require('./db'),
    express = db.express, 
    app = express(), 
    port = process.env.PORT || 4000,
    ddAPI = db.api;


//Allow cors 
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Accept, Content-Type, Authorization, X-Requested-With');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, PATCH, DELETE');

    if (req.method === 'OPTIONS') {
      res.send(200);
    } else {
      next();
    }
});

app.use(ddAPI.router);

//Query to get driver orders
app.get('/driver_orders/:id', function (req, res) {
    ddAPI.adapter.findMany('order', {driver:req.params.id}).then(function(orders) {
        res.json(orders);
    });
});


app.get('/uni_menu/:id', function(req, res) {
    var id = req.params.id;
    ddAPI.adapter.find('university', id).then(function(uni) {
        console.log(uni);
        ddAPI.adapter.findMany('restaurant', uni.links.restaurants).then(function(rests) {
            console.log(rests);
            var items = [];
            for (var i = 0; i<rests.length; i++) {
                items = items.concat(rests[i].links.menuItems);
            }
            ddAPI.adapter.findMany('menuItem', items).then(function(menuItems) {
                console.log(items);
                res.json(menuItems);
            });
        });
    });
});

app.get('/', function(req, res) {
    res.send('Hello, you have reached the API.');
});

app.listen(port);

console.log('Listening on port ' + port + '...');



