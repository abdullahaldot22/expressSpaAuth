const { redirectToAuth, setCookie } = require("../../libries/helper");
const db = require("../../libries/mysqlORM");

const logoutUserHandler = async (req, res) => {
    try {
        const dbSessionData = await db('sessions as st')
            .select('st.user_id', 'st.expires_at', 'u.email')
            .join('users as u', 'st.user_id', '=', 'u.id')
            .where('st.token', req.cookies.auth_token)
            .first();
            
        if (dbSessionData.user_id === Number(req.user.id) && dbSessionData.email === req.body.email) {
            await db('sessions').where('token', req.cookies.auth_token).del(); 
            setCookie(res, "auth_token");
            return res.redirect('/');
        } else {
            return redirectToAuth(req, res, "app/dashboard", {
                error : "Something went wrong!"
            });
        }
        
    } catch (err) {
        return redirectToAuth(req, res, "app/dashboard", {
            error : { message : "Something wrong ..."}
        });
    }
}

const dashboardPageHandler = async (req, res) => {
    try {
        return redirectToAuth(req, res, "app/dashboard", {
            message : { message : "User logged in successfully."}
        })
    } catch (error) {
        console.error(error);
    }
    
}




module.exports ={
    dashboardPageHandler,
    logoutUserHandler,
}