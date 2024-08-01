//Middleware to check if a channel is created

const checkChannel = (req, res, next) => {
  if (!req.channel?.uid) {
    res.redirect("/channel/create");
  } else {
    next();
  }
};

module.exports = checkChannel;
