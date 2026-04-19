const jwt = require('jsonwebtoken')
module.exports = function(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Unauthorized" })
        
    }

    const token = authHeader && authHeader.split(' ')[1]
    if (!token) {
       return res.status(401).json({ message: "Unauthorized" })
       
    } else {
        jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
            if (err) {
               return res.status(401).json({ message: "Unauthorized" })
                
            } else {
                req.user = payload;
                next();
            }
        })
    }
}