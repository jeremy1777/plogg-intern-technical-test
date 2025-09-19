const authRepository = require('./auth.repository');
const { sendActivationEmail } = require('../../services/email.service');
const { validateEmail, validatePassword } = require('../../utils/validator.util');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const generateAccessToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '15m',
  });
};

const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: '7d',
  });
};

const authService = {
  register: async (email, password) => {
    if (!validateEmail(email)) {
      throw new Error('Please enter a valid email address.');
    }
    if (!validatePassword(password)) {
      throw new Error('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.');
    }

    const userExists = await authRepository.findByEmail(email.toLowerCase());

    if (userExists) {
      throw new Error('Email is already in use.');
    }

    const activationToken = crypto.randomBytes(32).toString('hex');
    const user = await authRepository.create({
      email: email.toLowerCase(),
      password,
      activationToken,
      refreshTokens: [],
    });

    if (user) {
      await sendActivationEmail(user.email, user.activationToken);
      return user;
    } else {
      throw new Error('Invalid user data provided.');
    }
  },

  activateAccount: async (token) => {
    const user = await authRepository.findByActivationToken(token);
    if (!user) {
      throw new Error('Invalid or expired activation token.');
    }
    user.status = 'active';
    user.activationToken = null;
    await authRepository.save(user);
    return user;
  },

  login: async (email, password) => {
    const user = await authRepository.findByEmail(email.toLowerCase());

    if (user && (await user.matchPassword(password))) {
      if (user.status !== 'active') {
        throw new Error('Account is not activated. Please check your email.');
      }

      const accessToken = generateAccessToken(user._id);
      const refreshToken = generateRefreshToken(user._id);

      await authRepository.addRefreshToken(user._id, refreshToken);

      return {
        accessToken,
        refreshToken,
      };
    } else {
      throw new Error('Invalid email or password.');
    }
  },

  refresh: async (currentRefreshToken) => {
    try {
      const decoded = jwt.verify(currentRefreshToken, process.env.JWT_REFRESH_SECRET);
      const user = await authRepository.findUserByRefreshToken(decoded.id, currentRefreshToken);

      if (!user) {
        throw new Error('Invalid or expired refresh token.');
      }
      
      const newAccessToken = generateAccessToken(user._id);
      const newRefreshToken = generateRefreshToken(user._id);

      await authRepository.removeRefreshToken(user._id, currentRefreshToken);
      await authRepository.addRefreshToken(user._id, newRefreshToken);

      return { accessToken: newAccessToken, newRefreshToken };

    } catch (error) {
      throw new Error('Invalid or expired refresh token.');
    }
  },

  logout: async (refreshToken) => {
    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        await authRepository.removeRefreshToken(decoded.id, refreshToken);
    } catch (error) {
        // Fail silently
    }
  },
};

module.exports = authService;