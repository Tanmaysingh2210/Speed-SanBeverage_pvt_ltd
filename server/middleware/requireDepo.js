const requireDepo = (req, res, next) => {
    if (!req.user || !req.user.depo) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized: depo not found'
        });
    }

    next();
};

export default requireDepo;
