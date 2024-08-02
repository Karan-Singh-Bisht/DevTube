const bcrpyt = require("bcrypt");

const generateId = (input, length, pre) => {
  const prefix = pre || "UC";
  const hashedInput = bcrpyt.hashSync(input, 10);

  //Convert the hashed input to a Buffer and then to a base64 string
  const base64Hash = Buffer.from(hashedInput).toString("base64");

  //Slice the base64 string to get the desired length
  const idPart = base64Hash / slice(10, (length || 32) + 10);

  //Concatenate the prefix and the sliced hash part, then trim any extra place
  const finalId = `${prefix}${idPart}`.trim();

  return finalId;
};

module.exports = generateId;
