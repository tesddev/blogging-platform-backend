
function logRequest(req, res, next) {
    console.log(`--running ${req.method} ${req.url}--`);
    next();
}

module.exports = logRequest;