const csurf                                                                                                                                  = require("csurf");
const { dashboardPageHandler, logoutUserHandler }                                                                                            = require("../controllers/app/backendPageControllers");
const { productAddPageHandler, productStoreHandler, productPageHandler, productEditPageHandler, productUpdateHandler, productDeleteHandler } = require("../controllers/app/productControllers");
const { homePageHandler,registerPageHandler, registerUserHandler, loginUserHandler }                                                         = require("../controllers/PageControllers");
const { layoutComponentHandler }                                                                                                             = require("../libries/componentHelper");
const { authCheckMiddleware, loggedInSession }                                                                                               = require("../middlewares/authValidation");
// const { databaseSeedHandler }                                                                                                                = require("../utils/databaseSeeder");

const csrfProtection = csurf({ cookie: true });



module.exports = (app) => {
    // app.get('/database', databaseSeedHandler);

    app.get('/', loggedInSession, csrfProtection, homePageHandler);
    app.get('/register', loggedInSession, csrfProtection, registerPageHandler);
    app.post('/login', loggedInSession, csrfProtection, loginUserHandler);
    app.post('/register', loggedInSession, csrfProtection, registerUserHandler);
    app.post('/logout', authCheckMiddleware, csrfProtection, logoutUserHandler);
    
    app.get('/dashboard', authCheckMiddleware, dashboardPageHandler);

    app.get('/product', authCheckMiddleware, productPageHandler);
    app.get('/product/add', authCheckMiddleware, csrfProtection, productAddPageHandler);
    app.post('/product/add', authCheckMiddleware, csrfProtection, productStoreHandler);
    app.get('/product/edit/:id', authCheckMiddleware, csrfProtection, productEditPageHandler);
    app.post('/product/edit/:id', authCheckMiddleware, csrfProtection, productUpdateHandler);
    app.get('/product/delete/:id', authCheckMiddleware, productDeleteHandler);

    app.get('/component/:path', authCheckMiddleware, layoutComponentHandler);
}