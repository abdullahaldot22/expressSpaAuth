const setupRoutes  = require('../routes/web.js')
const cookieParser = require('cookie-parser');
const csurf        = require('csurf');
const express      = require('express')
const path         = require('path');
const app          = express()
const port         = 5050


app.use(express.urlencoded({ extended: true })); 
app.use(express.json());
app.use(cookieParser());
app.use(csurf({ cookie: true }));
const PUBLIC_PATH = path.join(process.cwd(), 'public'); 
app.use(express.static(PUBLIC_PATH)); 

setupRoutes(app);

app.listen(port, () => {
  console.log(`listening on port ${port}`)
})