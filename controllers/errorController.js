const errorCont = {}

/* intentionally throw a server error for testing */
errorCont.test500 = function (req, res, next) {
  // create an error and pass to next to be handled by error middleware
  const err = new Error('Intentional test 500 error')
  err.status = 500
  next(err)
}

module.exports = errorCont
