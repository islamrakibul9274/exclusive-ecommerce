const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    // 1. Look for the "Authorization" header
    const authHeader = req.headers.authorization;

    // 2. Check if the token exists and starts with "Bearer "
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "Access Denied. No token provided." });
    }

    // 3. Extract the actual token string
    const token = authHeader.split(' ')[1];

    try {
        // 4. Verify the token using your secret key from the .env file
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 5. Attach the decoded user data (like their ID and Role) to the request
        req.user = decoded;

        // 6. Open the door and let them proceed to the route
        next();
    } catch (error) {
        return res.status(403).json({ message: "Invalid or Expired Token." });
    }
};

// NEW: The Admin Check
const verifyAdmin = (req, res, next) => {
    // We check if the user exists (from verifyToken) AND if their role is admin
    if (req.user && req.user.role === 'admin') {
        next(); // Open the VIP door
    } else {
        return res.status(403).json({ message: "Access Denied. Admin privileges required." });
    }
};

module.exports = { verifyToken, verifyAdmin };