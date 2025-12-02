const { dashboardPageHandler, logoutUserHandler }                                                                                            = require("../controllers/app/backendPageControllers");
const { productAddPageHandler, productStoreHandler, productPageHandler, productEditPageHandler, productUpdateHandler, productDeleteHandler } = require("../controllers/app/productControllers");
const { homePageHandler,registerPageHandler, registerUserHandler, loginUserHandler }                                                         = require("../controllers/PageControllers");
const { layoutComponentHandler }                                                                                                             = require("../libries/componentHelper");
const { authCheckMiddleware, loggedInSession }                                                                                               = require("../middlewares/authValidation");
const { databaseSeedHandler }                                                                                                                = require("../utils/databaseSeeder");

module.exports = (app) => {
    app.get('/database', databaseSeedHandler);

    app.get('/', loggedInSession, homePageHandler);
    app.get('/register', loggedInSession, registerPageHandler);
    app.post('/login', loggedInSession, loginUserHandler);
    app.post('/register', loggedInSession, registerUserHandler);
    app.post('/logout', authCheckMiddleware, logoutUserHandler);
    
    app.get('/dashboard', authCheckMiddleware, dashboardPageHandler);

    app.get('/product', authCheckMiddleware, productPageHandler);
    app.get('/product/add', authCheckMiddleware, productAddPageHandler);
    app.post('/product/add', authCheckMiddleware, productStoreHandler);
    app.get('/product/edit/:id', authCheckMiddleware, productEditPageHandler);
    app.post('/product/edit/:id', authCheckMiddleware, productUpdateHandler);
    app.get('/product/delete/:id', authCheckMiddleware, productDeleteHandler);

    app.get('/component/:path', authCheckMiddleware, layoutComponentHandler);
}