/**
    * Created by: Varun kumar
    * Date: 24april, 2016
**/

module.exports = function (express, app) {
    var apiRoutes = express.Router();  
    apiRoutes.use(function (req, res, next) {
        console.log('authentication');
        next();
    });
    //app.use('/', apiRoutes);
};