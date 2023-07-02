const isAuthorize = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith('Bearer ') || !authorization.split(' ')[1]) {
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