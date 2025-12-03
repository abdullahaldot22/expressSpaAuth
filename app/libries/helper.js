const path = require('path')
const fs = require("fs");
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { die } = require('./debugHelper');

function pagePath(relativePath) {
    if (typeof relativePath !== 'string') {
        console.error("pagePath received non-string value:", relativePath);
        relativePath = String(relativePath); 
    }
    
    if (!relativePath.endsWith(".html")) {
        relativePath += ".html";
    }
    return path.join(__dirname, "../../public/pages", relativePath);
}

function redirectTo(req, res, file, data = {}) {
    if (!res) throw new Error("Express response object 'res' is required");
    const filePath = path.resolve(pagePath(file));
    let html;
    try {
        html = fs.readFileSync(filePath, "utf8");
    } catch (err) {
        console.error("File read error:", err);
        return res.status(404).send("Page not found");
    } 
    
    data.data            = data.data || {};
    data.data.csrf_token = req.csrfToken();

    // if (data !== null) {
        let keys = ['message', 'data', 'error'];
        for (let i = 0; i < keys.length; i++) {
            if (data[keys[i]] !== null && data[keys[i]] !== undefined) {
                switch (keys[i]) {
                    case 'message':
                        html = html.replace(/{{MESSAGE}}/g, JSON.stringify(data[keys[i]]))
                        break;
                    case 'data':
                        html = html.replace(/{{DATA}}/g, JSON.stringify(data[keys[i]]))
                        break;
                    case 'error':
                        html = html.replace(/{{ERROR}}/g, JSON.stringify(data[keys[i]]) ) 
                        break;
                    default:
                        break;
                }
            } else {
                switch (keys[i]) {
                    case 'message':
                        html = html.replace(/{{MESSAGE}}/g, "{}")
                        break;
                    case 'data':
                        html = html.replace(/{{DATA}}/g, "{}")
                        break;
                    case 'error':
                        html = html.replace(/{{ERROR}}/g, "{}" ) 
                        break;
                    default:
                        break;
                }
            }
        };
    // } else {
    //     html = html.replace(/{{MESSAGE}}/g, "{}")
    //     html = html.replace(/{{DATA}}/g, "{}")
    //     html = html.replace(/{{ERROR}}/g, "{}" ) 
    // }
    res.type("html").send(html);
}

function redirectToAuth(req, res, file, data = {}) {
    if (!res) throw new Error("Express response object 'res' is required");
    if (!req) throw new Error("Express response object 'req' is required");
    const filePath = path.resolve(pagePath(file));
    let html;
    try {
        html = fs.readFileSync(filePath, "utf8");
    } catch (err) {
        console.error("File read error:", err);
        return res.status(404).send("Page not found");
    } 

    data.data            = data.data || {};
    data.data.csrf_token = req.csrfToken();
    html = html.replace(/{{AUTHINFO}}/g, JSON.stringify(req.user))
    
    // if (data !== null) {
        let keys = ['message', 'data', 'error', 'component'];
        for (let i = 0; i < keys.length; i++) {
            if (data[keys[i]] !== null && data[keys[i]] !== undefined) {
                switch (keys[i]) {
                    case 'message':
                        html = html.replace(/{{MESSAGE}}/g, JSON.stringify(data[keys[i]]))
                        break;
                    case 'data':
                        html = html.replace(/{{DATA}}/g, JSON.stringify(data[keys[i]]))
                        break;
                    case 'error':
                        html = html.replace(/{{ERROR}}/g, JSON.stringify(data[keys[i]]) ) 
                        break;
                    case 'component':
                        html = html.replace(/{{COMPONENT}}/g, JSON.stringify(data[keys[i]]) ) 
                        break;
                    default:
                        break;
                }
            } else {
                switch (keys[i]) {
                    case 'message':
                        html = html.replace(/{{MESSAGE}}/g, "{}")
                        break;
                    case 'data':
                        html = html.replace(/{{DATA}}/g, "{}")
                        break;
                    case 'error':
                        html = html.replace(/{{ERROR}}/g, "{}" ) 
                        break;
                    case 'component':
                        html = html.replace(/{{COMPONENT}}/g, "{}" ) 
                        break;
                    default:
                        break;
                }
            }
        };
    // } else {
    //     html = html.replace(/{{COMPONENT}}/g, "{}" ) 
    //     html = html.replace(/{{MESSAGE}}/g, "{}")
    //     html = html.replace(/{{DATA}}/g, "{}")
    //     html = html.replace(/{{ERROR}}/g, "{}" ) 
    // }
    res.type("html").send(html);
}

async function hashPassword(password) {
    const hashed = await bcrypt.hash(password, 10);
    return hashed;
}

function mapJoiErrorsByField(joiError) {
    if (!joiError || !joiError.details) {
        return {};
    }

    const fieldErrors = {};

    joiError.details.forEach(detail => {
        const fieldName = detail.path[0];
        const errorMessage = detail.message;

        if (fieldName && !fieldErrors[fieldName]) {
            fieldErrors[fieldName] = errorMessage;
        }
    });

    return fieldErrors;
}


const SECURE_COOKIE_OPTIONS = (durationMs) => {
    const expiresDate = (durationMs > 0) ? new Date(Date.now() + durationMs) : new Date(0);
    return {
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production', 
        sameSite: 'Lax', 
        maxAge: durationMs,
        expires: expiresDate,
        path: '/',
    };
};

const setCookie = (res, name, tokenValue = null, hours = null) => {
    let durationMs;
    if (hours !== null) {
        durationMs = hours * 60 * 60 * 1000; 
    } else {
        durationMs = 0; 
    }
    res.cookie(name, tokenValue ?? '', SECURE_COOKIE_OPTIONS(durationMs));
    return true;
};

function generateRandomHash(length) {
    const bufferSize = Math.ceil(length / 2);
    const randomBytes = crypto.randomBytes(bufferSize);
    let hashString = randomBytes.toString('hex');
    return hashString.substring(0, length);
}


module.exports = {
    pagePath,
    setCookie,
    redirectTo,
    hashPassword,
    redirectToAuth,
    mapJoiErrorsByField,
    generateRandomHash,
};