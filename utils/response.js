module.exports.sendResponse = ((res, status, message, data = null) => {
    const response = {
        status,
        message
    };
    if (data !== null) {
        response.data = data;
    }
    return res.status(status).json(response);
});