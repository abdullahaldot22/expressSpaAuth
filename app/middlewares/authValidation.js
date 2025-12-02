const { setCookie } = require("../libries/helper");
const db            = require("../libries/mysqlORM");

// The final middleware logic using Knex
async function authCheckMiddleware(req, res, next) {
    const token = req.cookies.auth_token;
    
    if (!token) {
        return res.redirect('/');
    }

    const dbSessionData = await db('sessions as st')
        .select('st.user_id', 'st.expires_at', 'u.name', 'u.email', 'u.phone', 'u.created_at')
        .join('users as u', 'st.user_id', '=', 'u.id')
        .where('st.token', token)
        .first();

    if (!dbSessionData) {
        setCookie(res, "auth_token", '');
        return res.redirect('/?reason=revoked');
    }

    const now = Date.now();
    const dbExpiresAt = new Date(dbSessionData.expires_at).getTime();

    if (now > dbExpiresAt) {
        await db('sessions').where('token', token).del(); 
        setCookie(res, "auth_token", '');
        return res.redirect('/?reason=expired');
    }

    // 3. Attach User Data
    req.user = {
        id        : dbSessionData.user_id,
        name      : dbSessionData.name,
        email     : dbSessionData.email,
        phone     : dbSessionData.phone,
        created_at: dbSessionData.created_at,
    };
    
    next();
}

function loggedInSession(req, res, next) {
    try {
        const token = req.cookies.auth_token;
        if (token !== null && token !== undefined) {
            return res.redirect('/dashboard');
        }
        next();
    } catch (error) {
        console.error(error);
    }
}

module.exports = {
    loggedInSession,
    authCheckMiddleware,
}