const authService = require('./auth.service');

const authController = {
  registerUser: async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: 'Please provide both email and password.' });
      }
      await authService.register(email, password);
      res.status(201).json({ 
        message: 'Registration successful. Please check your email to activate your account.' 
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  activateAccount: async (req, res) => {
    try {
      const { token } = req.params;
      await authService.activateAccount(token);
      res.status(200).json({ message: 'Account activated successfully.' });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  loginUser: async (req, res) => {
    try {
      const { email, password } = req.body;
      const { accessToken, refreshToken } = await authService.login(email, password);
      
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      res.status(200).json({ accessToken });
    } catch (error) {
      res.status(401).json({ message: error.message });
    }
  },

  refreshToken: async (req, res) => {
    try {
      const currentRefreshToken = req.cookies.refreshToken;
      if (!currentRefreshToken) {
        return res.status(401).json({ message: 'Refresh token not found.' });
      }

      const { accessToken, newRefreshToken } = await authService.refresh(currentRefreshToken);

      res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      res.status(200).json({ accessToken });
    } catch (error) {
      res.status(401).json({ message: error.message });
    }
  },

  logoutUser: async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (refreshToken) {
            await authService.logout(refreshToken);
        }
        
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });
        
        res.status(200).json({ message: 'Logged out successfully.' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
  },
};

module.exports = authController;