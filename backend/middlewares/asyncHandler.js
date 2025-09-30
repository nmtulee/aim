
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((error) => {
        console.error(error);
        res.status(res.statusCode || 500).json({ message: error.message ||'Internal Server Error' });
    });
}

export default asyncHandler;