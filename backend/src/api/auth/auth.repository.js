const User = require('../../models/user');

const userRepository = {
  findByEmail: async (email) => {
    return await User.findOne({ email });
  },

  findByActivationToken: async (token) => {
    return await User.findOne({ activationToken: token });
  },

  create: async (userData) => {
    return await User.create(userData);
  },

  save: async (user) => {
    return await user.save();
  },

  addRefreshToken: async (userId, token) => {
    const user = await User.findById(userId);
    if (user) {
      user.refreshTokens.push(token);
      await user.save();
    }
    return user;
  }
};

module.exports = userRepository;