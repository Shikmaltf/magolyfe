const adminController = require('../controllers/adminController');
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../config/email');

// Mock model Admin
jest.mock('../models/Admin');
// Mock library eksternal
jest.mock('jsonwebtoken');
jest.mock('../config/email');

// Mock http response
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

process.env.JWT_SECRET = 'secret-test-key';

describe('Admin Controller', () => {
  let req, res;

  beforeEach(() => {
    res = mockResponse();
    req = { body: {}, params: {}, admin: { id: 'admin123' } };
    // Reset semua mock sebelum setiap test
    jest.clearAllMocks();
    jwt.sign.mockReturnValue('mock-jwt-token');
  });

  // Test untuk fungsi login
  describe('login', () => {
    it('should login admin successfully and return a token', async () => {
      req.body = { username: 'admin', password: 'password123' };
      const mockAdmin = {
        _id: 'admin123',
        username: 'admin',
        matchPassword: jest.fn().mockResolvedValue(true),
      };
      Admin.findOne.mockResolvedValue(mockAdmin);

      await adminController.login(req, res);

      expect(Admin.findOne).toHaveBeenCalledWith({ username: 'admin' });
      expect(mockAdmin.matchPassword).toHaveBeenCalledWith('password123');
      expect(jwt.sign).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Login berhasil.',
        token: 'mock-jwt-token',
      }));
    });

    it('should return 401 for invalid credentials', async () => {
      req.body = { username: 'admin', password: 'wrongpassword' };
      const mockAdmin = {
        matchPassword: jest.fn().mockResolvedValue(false),
      };
      Admin.findOne.mockResolvedValue(mockAdmin);

      await adminController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Kredensial tidak valid.' });
    });

    it('should return 400 if username or password is not provided', async () => {
        req.body = { username: 'admin' }; // Password tidak ada
        await adminController.login(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Username dan password wajib diisi.' });
    });
  });

  // Test untuk fungsi changePassword
  describe('changePassword', () => {
    it('should change password successfully', async () => {
        req.body = { currentPassword: 'old', newPassword: 'newpassword', confirmNewPassword: 'newpassword' };
        const mockAdmin = {
            matchPassword: jest.fn().mockResolvedValue(true),
            save: jest.fn().mockResolvedValue(true),
            password: ''
        };
        Admin.findById.mockResolvedValue(mockAdmin);

        await adminController.changePassword(req, res);

        expect(Admin.findById).toHaveBeenCalledWith('admin123');
        expect(mockAdmin.matchPassword).toHaveBeenCalledWith('old');
        expect(mockAdmin.password).toBe('newpassword');
        expect(mockAdmin.save).toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith({ message: 'Password berhasil diubah.' });
    });

    it('should return 400 for incorrect current password', async () => {
        req.body = { currentPassword: 'wrong', newPassword: 'new123', confirmNewPassword: 'new123' };
        const mockAdmin = {
            matchPassword: jest.fn().mockResolvedValue(false),
        };
        Admin.findById.mockResolvedValue(mockAdmin);

        await adminController.changePassword(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Password saat ini salah.' });
    });
  });

   // Test untuk fungsi forgotPassword
  describe('forgotPassword', () => {
    it('should send a password reset email', async () => {
        req.body = { username: 'admin' };
        process.env.STATIC_ADMIN_EMAIL = 'test@example.com';
        process.env.FRONTEND_URL = 'http://localhost:3000';

        const mockAdmin = {
            username: 'admin',
            save: jest.fn().mockResolvedValue(true),
        };
        Admin.findOne.mockResolvedValue(mockAdmin);

        await adminController.forgotPassword(req, res);

        expect(Admin.findOne).toHaveBeenCalledWith({ username: 'admin' });
        expect(mockAdmin.save).toHaveBeenCalled();
        expect(sendEmail).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: expect.stringContaining('Instruksi untuk mereset password') });
    });

    it('should return success message even if username does not exist', async () => {
        req.body = { username: 'nonexistent' };
        Admin.findOne.mockResolvedValue(null);

        await adminController.forgotPassword(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: expect.stringContaining('Jika username Anda valid') });
    });
  });

  // Test untuk fungsi resetPassword
  describe('resetPassword', () => {
    it('should reset password with a valid token', async () => {
        req.params.token = 'validtoken';
        req.body = { password: 'newpassword', confirmPassword: 'newpassword' };

        const mockAdmin = {
            save: jest.fn().mockResolvedValue(true),
        };
        // Mock findOne untuk mencari admin berdasarkan token yang di-hash
        Admin.findOne.mockResolvedValue(mockAdmin);

        await adminController.resetPassword(req, res);

        expect(Admin.findOne).toHaveBeenCalledWith({
            passwordResetToken: expect.any(String),
            passwordResetExpires: { $gt: expect.any(Number) },
        });
        expect(mockAdmin.save).toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith({ message: 'Password berhasil direset. Anda sekarang bisa login dengan password baru Anda.' });
    });

    it('should return 400 for an invalid or expired token', async () => {
        req.params.token = 'invalidtoken';
        req.body = { password: 'newpassword', confirmPassword: 'newpassword' };
        Admin.findOne.mockResolvedValue(null);

        await adminController.resetPassword(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Token reset password tidak valid atau sudah kedaluwarsa.' });
    });
  });
});
