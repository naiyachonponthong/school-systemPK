const { v4: uuidv4 } = require('uuid');

module.exports = {
  generateId: () => uuidv4(),

  formatDate: (date) => {
    if (!date) return null;
    return new Date(date).toISOString();
  },

  paginate: (page = 1, limit = 20) => {
    const offset = (Math.max(1, parseInt(page)) - 1) * parseInt(limit);
    return { offset, limit: parseInt(limit) };
  }
};
