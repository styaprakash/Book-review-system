// Not strictly required, but you can add helpers here if needed
module.exports = function paginate(page = 1, limit = 10) {
  return {
    skip: (page - 1) * limit,
    take: limit
  };
};
