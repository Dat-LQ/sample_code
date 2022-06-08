module.exports = function validMiddleware(req, res, next){
    if (req.query.level > 10){
        
        return next();
    }
    
    return res.status(401).send('low level')
}