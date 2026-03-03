const crypto = require("crypto");

function verifyGithubSignature(req, res, next) {
    const signatureHeader = req.headers["x-hub-signature-256"];
    const secret = process.env.GITHUB_WEBHOOK_SECRET;

    if (!secret) {
        console.warn(
            "GITHUB_WEBHOOK_SECRET is not set. Skipping verification (Not recommended for production).",
        );

        return next();
    }

    if (!signatureHeader) {
        return res
            .status(401)
            .json({ error: "Unauthorized: No signature found" });
    }

    const hmac = crypto.createHmac("sha256", secret);
    const digest = "sha256=" + hmac.update(req.rawBody).digest("hex");

    try {
        const signatureBuffer = Buffer.from(signatureHeader);
        const digestBuffer = Buffer.from(digest);

        if (!crypto.timingSafeEqual(digestBuffer, signatureBuffer)) {
            return res.status(401).json({
                error: "Unauthorized: Signature mismatched",
            });
        }
    } catch (error) {
        console.error("Signature Verification error: ", error);
        return res.status(401).json({
            error: "Unauthorized: Invalid Signature Format",
        });
    }

    next();
}

module.exports = { verifyGithubSignature };
