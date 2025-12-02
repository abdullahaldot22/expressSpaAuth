const Joi                                     = require("joi");
const Status                                  = require("../../enums/statusEnum");
const { redirectToAuth, mapJoiErrorsByField } = require("../../libries/helper");
const db                                      = require("../../libries/mysqlORM");
const { unique, uniqueExcept }                              = require("../../libries/mysqlORMWrapper");

const productPageHandler = async (req, res) => {
    try {
        let products = await db('products as p').select('p.*', 'u.name as creator_name', 'u.email as creator_email').join('users as u', 'p.creator_id', '=', 'u.id');

        return redirectToAuth(req, res, "app/dashboard", {
            data : { products : products },
            component : { path : "product/productList" }
        })
    } catch (err) {
        console.error(err);
    }
}

const productAddPageHandler = (req, res) => {
    try {
        let statusEnum = Status;
        return redirectToAuth(req, res, "app/dashboard", {
            component : { path : "product/productCreate"},
            data : { statusEnum : statusEnum }
        })
    } catch (error) {
        console.error(error);
    }
}

const productStoreHandler = async (req, res) => {

    let statusEnum = Status;
    const productSchema = Joi.object({
        name: Joi.string().trim().min(2).pattern(/^[A-Za-z0-9 ]+$/).max(100).concat(unique('products', 'name')).required().messages({
                'string.base'        : 'Name must be a string.',
                "string.pattern.base": "Only letters, numbers, and spaces are allowed.",
                'string.empty'       : 'Name cannot be empty.',
                'string.min'         : 'Name should have a minimum length of 2 characters.',
                'string.max'         : 'Name should have a maximum length of 100 characters.',
                'any.required'       : 'Name is required.'
            }),

        category_name: Joi.string().trim().min(2).max(50).required().messages({
                'string.base' : 'Category name must be a string.',
                'string.empty': 'Category name cannot be empty.',
                'any.required': 'Category name is required.'
            }),

        price: Joi.number().positive().precision(2).required().messages({
                'number.base'    : 'Price must be a number.',
                'number.positive': 'Price must be a positive number.',
                'any.required'   : 'Price is required.'
            }),

        status: Joi.number().integer().min(0).required().messages({
                'number.base'   : 'You must select a status option.',
                'number.integer': 'Status field is required.',
                'any.required'  : 'Status is required.'
            }),

        description: Joi.string().trim().max(500).required().messages({
                'string.base' : 'Description must be a string.',
                'string.empty': 'Description cannot be empty.',
                'string.max'  : 'Description should have a maximum length of 500 characters.',
                'any.required': 'Description is required.'
            })
    });

    try {
        await productSchema.validateAsync(req.body, { abortEarly: false });
        
        await db('products').insert({
            name         : req.body.name,
            category_name: req.body.category_name,
            price        : req.body.price,
            status       : req.body.status,
            creator_id   : req.user.id,
            description  : req.body.description,
            created_at   : new Date(),
        });
        
        let products = await db('products as p').select('p.*', 'u.name as creator_name', 'u.email as creator_email').join('users as u', 'p.creator_id', '=', 'u.id');

        return redirectToAuth(req, res, "app/dashboard", {
            component: { path : "product/productList" },
            data     : {products : products},
            message  : "Product Created Successfully"
        });

    } catch (err) {
        console.error(err);
        
        if (err.isJoi) {
            return redirectToAuth(req, res, "app/dashboard", {
                error : mapJoiErrorsByField(err),
                data : { statusEnum : statusEnum },
                component : { path : "product/productCreate" }
            });
        }
        return redirectToAuth(req, res, "app/dashboard", {
            component : { path : "product/productCreate" },
            data : { statusEnum : statusEnum },
            error : err,
        });
    }
    
}

const productEditPageHandler = async (req, res) => {
    try {
        let statusEnum = Status;
        let product = await db('products').where('id', req.params.id).first();

        return redirectToAuth(req, res, "app/dashboard", {
            data : { formData : product, statusEnum : statusEnum },
            component : { path : "product/productEdit" }
        })
    } catch (err) {
        console.error(err);
    }
}

const productUpdateHandler = async (req, res) => {

    let statusEnum = Status;
    const productSchema = Joi.object({
        name: Joi.string().trim().min(2).pattern(/^[A-Za-z0-9 ]+$/).max(100).concat(uniqueExcept('products', 'name', req.params.id)).required().messages({
                'string.base'        : 'Name must be a string.',
                "string.pattern.base": "Only letters, numbers, and spaces are allowed.",
                'string.empty'       : 'Name cannot be empty.',
                'string.min'         : 'Name should have a minimum length of 2 characters.',
                'string.max'         : 'Name should have a maximum length of 100 characters.',
                'any.required'       : 'Name is required.'
            }),

        category_name: Joi.string().trim().min(2).max(50).required().messages({
                'string.base' : 'Category name must be a string.',
                'string.empty': 'Category name cannot be empty.',
                'any.required': 'Category name is required.'
            }),

        price: Joi.number().positive().precision(2).required().messages({
                'number.base'    : 'Price must be a number.',
                'number.positive': 'Price must be a positive number.',
                'any.required'   : 'Price is required.'
            }),

        status: Joi.number().integer().min(0).required().messages({
                'number.base'   : 'You must select a status option.',
                'number.integer': 'Status field is required.',
                'any.required'  : 'Status is required.'
            }),

        description: Joi.string().trim().max(500).required().messages({
                'string.base' : 'Description must be a string.',
                'string.empty': 'Description cannot be empty.',
                'string.max'  : 'Description should have a maximum length of 500 characters.',
                'any.required': 'Description is required.'
            })
    });

    try {
        await productSchema.validateAsync(req.body, { abortEarly: false });
        
        await db('products').where('id', req.params.id).update({
            name         : req.body.name,
            category_name: req.body.category_name,
            price        : req.body.price,
            status       : req.body.status,
            description  : req.body.description,
            updated_at   : new Date(),
        });
        
        let products = await db('products as p').select('p.*', 'u.name as creator_name', 'u.email as creator_email').join('users as u', 'p.creator_id', '=', 'u.id');

        return redirectToAuth(req, res, "app/dashboard", {
            component: { path : "product/productList" },
            data     : {products : products},
            message  : "Product Updated Successfully"
        });

    } catch (err) {
        console.error(err);
        
        if (err.isJoi) {
            return redirectToAuth(req, res, "app/dashboard", {
                error : mapJoiErrorsByField(err),
                data : { statusEnum : statusEnum },
                component : { path : "product/productEdit" }
            });
        }
        return redirectToAuth(req, res, "app/dashboard", {
            component : { path : "product/productEdit" },
            data : { statusEnum : statusEnum },
            error : err,
        });
    }
    
}

const productDeleteHandler = async (req, res) => {
    try {
        await db('products').where('id', req.params.id).del();
        let products = await db('products as p').select('p.*', 'u.name as creator_name', 'u.email as creator_email').join('users as u', 'p.creator_id', '=', 'u.id');

        return redirectToAuth(req, res, "app/dashboard", {
            data : { products : products },
            component : { path : "product/productList" },
            message : "Product deleted successfully."
        })
    } catch (err) {
        console.error(err);
    }
}

module.exports = {
    productAddPageHandler,
    productStoreHandler,
    productPageHandler,
    productEditPageHandler,
    productUpdateHandler,
    productDeleteHandler
}