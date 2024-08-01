const formatNumber = (num) => {
  //checking if the number is greater than or equal to 1M
  if (num >= 1e6) {
    return (num / 1e6).toFixed(2) + "M";
  }
  //Checking if the number is greater than thousand
  else if (num >= 1e3) {
    return (num / 1e3).toFixed(2) + "K";
  }
  //Checking if the number is less than thousand
  else {
    return Math.floor(num).toString();
  }
};
