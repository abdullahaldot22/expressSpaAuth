const die = (variable) => {
  console.log(JSON.stringify(variable, null, 2)); // pretty print
  process.exit(1);
};

module.exports = {
    die
}