const isAuthorize = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization || !authorization.split(' ')[0] || !authorization.split(' ')[0].trim()) {
      return res.status(422).json({
        message: 'Token tidak valid!'
      });
    }
    next();
  } catch (error) {
    console.error(error.message);
  }
}

module.exports = {
    isAuthorize
};
