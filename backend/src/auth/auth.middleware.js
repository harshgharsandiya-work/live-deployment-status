const jwt = require("jsonwebtoken");

function authenticateUser(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            error: "Unauthorized: Missing Token",
        });
    }

    const token = authHeader.split(" ");

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        /**
         * {userId, username}
         */
        req.user = decoded;
    } catch (error) {
        return res.status(401).json({
            error: "Unauthorized: Invalid Token",
        });
    }
}

module.exports = { authenticateUser };
