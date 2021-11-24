// server.js
const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('./api/db.json');
const middlewares = jsonServer.defaults();

router.render = (req, res) => {
    let data = res.locals.data;
    if (req.method === 'GET' && req.url.indexOf("/products") === 0) {
        if(Array.isArray(data)) {
            data = data.map(product => {
                // For the general list of products we don't need the details below, we remove them from the response
                delete product.option;
                delete product.saloon;
                delete product.specification;
                return product;
            });
        }
        else {
            const options = router.db.get("options").value();
            data.option = options.find(option => data.option === option.id)
            // Remove unneccessary information
            delete data.option.categories;
            delete data.saloon;
            delete data.producer;
        }
    }

    if (req.method === 'GET' && req.url.indexOf("/options") === 0) {
        const queries = req.url.split('?')[1] ? req.url.split('?')[1].split('&') : [];
        const categoriesQuery = queries.find(q => q.includes('categories')) ? queries.find(q => q.includes('categories')).slice(11) : null;

        const optionCategories = categoriesQuery ? categoriesQuery.split(',').map(id => Number(id)) : [];

        if(Array.isArray(data)) {
            if(optionCategories.length) {
                data = data.filter(option => {
                    return option.category.some(option => optionCategories.includes(option));
                });
            }
        }
    }

    if (req.method === 'GET' && req.url.indexOf("/cart") === 0) {
        let data = res.locals.data;
        data = data.map(cartItem => {
            const product = router.db.get("products").value().find(product => product.id === cartItem.productId);
            cartItem.name = product.name;
            cartItem.description = product.description;
            cartItem.thumbnail = product.photos[0];
        });
    }
    res.jsonp(data);
}

// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonServer.bodyParser);
server.use((req, res, next) => {
    if (req.method === 'PATCH' && req.url.indexOf("/favorites") === 0) {
        res.status(405).jsonp({
            error: "Method not allowed"
        });
    }
    if (req.method === 'POST' && req.url.indexOf("/favorites") === 0) {
        const id = router.db.get("favorites").value().find(fav => fav.id === req.body.id);
        if(id) {
            res.status(403).jsonp({
                error: "Product was already added to favorites"
            });
        }
    }
    // Continue to JSON Server router
    next()
})

server.use(middlewares)
server.use(router)
server.listen(3000, () => {
    console.log('JSON Server is running')
});
