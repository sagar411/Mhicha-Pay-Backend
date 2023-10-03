const isAdmin = (req, res, next) => {
    console.log(req.auth_user);
  
    if (req.auth_user.role === "admin") {
      next();
    } else {
        
      next({
        status: 403,
        message: "Access denied",
      });
    }
  };
  
  module.exports = { isAdmin };