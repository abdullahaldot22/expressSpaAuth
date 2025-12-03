const { redirectTo, hashPassword, mapJoiErrorsByField, generateRandomHash, setCookie } = require("../libries/helper");
const bcrypt                                                                           = require('bcryptjs');
const { query }                                                                        = require("../libries/mysql");
const { unique }                                                                       = require("../libries/mysqlORMWrapper");
const { die }                                                                          = require("../libries/debugHelper");
const Joi                                                                              = require('joi');
const db                                                                               = require("../libries/mysqlORM");

const homePageHandler = (req, res) => {
    return redirectTo(req, res, 'index');
}

const loginUserHandler = async (req, res) => {

    const schema = Joi.object({
        email: Joi.string().email().required().messages({
            "any.required": "Email address is required.",
            "string.empty": "Email field is required",
            "string.email": "The email provided is invalid."
        }),
        password: Joi.string().min(6).required().messages({
            "any.required": "Password is required.",
            "string.empty": "Password field is required",
            "string.min": "Password must be at least {#limit} characters long."
        })
    }).unknown(true);

    try {
        await schema.validateAsync(req.body, { abortEarly: false });
        let user = await db('users').where({ email : req.body.email }).first();
        if (!user) {
            return redirectTo(req, res, "index", {
                message : { message : "No user found" }
            })
        } else {
            let passMatch = await comparePassword(req.body.password, user.password);
            if (!passMatch) {
                return redirectTo(req, res, "index", {
                    message : { message : "Password Mismatch" }
                })
            } else {
                let hashString = generateRandomHash(80);
                await db('sessions').where({ user_id : user.id }).del();
                await db('sessions').insert({
                    user_id   : user.id,
                    name      : "auth_token",
                    token     : hashString,
                    created_at: new Date(),
                    expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
                });
                
                setCookie(res, "auth_token", hashString, 6);
                return res.redirect('/dashboard');
            }
        }

    } catch (err) {
        if (err.isJoi) {
            return redirectTo(req, res, "index", {
                error : mapJoiErrorsByField(err)
            });
        }
        return redirectTo(req, res, "index", {
            error : err
        });
    }
}

async function comparePassword(plaintextPassword, storedHash) {
    try {
        const isMatch = await bcrypt.compare(plaintextPassword, storedHash);
        return isMatch;
    } catch (error) {
        console.error("Error during password comparison:", error);
        return false;
    }
}

const registerPageHandler = async (req, res) => {
    return redirectTo(req, res, "auth/register", {
        data : {users : ''}
    });
};

const registerUserHandler = async (req, res) => {

    const schema = Joi.object({
        name: Joi.string().required().min(5).messages({
            "any.required": "Name field is required",
            "string.empty": "Name field is required",
            "string.min": "Name field must contain at least 5 character"
        }),
        phone: Joi.number().min(11).messages({
            "number.base": "Phone number must be a valid number.",
            "number.min": "Phone number must be at least {#limit} digits."
        }),
        email: Joi.string().email().required().concat(unique('users', 'email')).messages({
            "any.required": "Email address is required.",
            "string.empty": "Email field is required",
            "string.email": "The email provided is invalid."
        }),
        password: Joi.string().min(6).required().messages({
            "any.required": "Password is required.",
            "string.empty": "Password field is required",
            "string.min": "Password must be at least {#limit} characters long."
        }),
        confirm_password: Joi.string().required().valid(Joi.ref('password')).messages({
            "any.required": "Confirm Password is required.",
            "string.empty": "Confirm Password field is required",
            "any.only": "Confirmation password does not match the password."
        })
    }).unknown(true);

    try {
        await schema.validateAsync(req.body, { abortEarly: false });
        let userId = await db('users').insert({
            name      : req.body.name,
            phone     : req.body.phone,
            email     : req.body.email,
            password  : await hashPassword(req.body.password),
            created_at: new Date(),
        });

        let hashString = generateRandomHash(80);

        await db('sessions').insert({
            user_id   : userId,
            name      : "auth_token",
            token     : hashString,
            created_at: new Date(),
            expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
        });
        
        setCookie(res, "auth_token", hashString, 6);

        return res.redirect('/dashboard');

    } catch (err) {
        if (err.isJoi) {
            return redirectTo(req, res, "auth/register", {
                error : mapJoiErrorsByField(err)
            });
        }
        return redirectTo(req, res, "auth/register", {
            error : err
        });
    }
}



module.exports = {
    homePageHandler,
    registerPageHandler,
    registerUserHandler,
    loginUserHandler
}