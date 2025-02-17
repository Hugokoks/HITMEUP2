const dotenv = require('dotenv');
dotenv.config({ path: './configHome.env' });

const jwt = require('jsonwebtoken');
const key = process.env.KEY;

function verifyToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1]; // Extract token from the header
    const userId = req.headers['userid']; // Make sure to use the same casing used in the header
    //console.log(userId);
    if (!token) return res.status(403).json({ status: 'error', message: 'No token provided' });

    jwt.verify(token, key, (err, decoded) => {
        if (err) return res.status(401).json({ status: 'error', message: 'Invalid token' });

        req.userIdToken = decoded.id; // Add userId to request object
        if (req.userIdToken !== userId) {
            return res.status(401).json({ status: 'error', message: 'Please authenticate account' });
        }
        next();
    });
}

module.exports = verifyToken;