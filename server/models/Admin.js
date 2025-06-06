// backend/models/Admin.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username wajib diisi'], // Pesan error jika tidak diisi
    unique: true, // Memastikan username unik
    trim: true // Menghapus spasi di awal dan akhir
  },
  password: {
    type: String,
    required: [true, 'Password wajib diisi'],
    minlength: [6, 'Password minimal harus 6 karakter'] // Validasi panjang minimal password
  },
  passwordResetToken: { // Token untuk reset password
    type: String,
  },
  passwordResetExpires: { // Waktu kedaluwarsa token reset password
    type: Date,
  }
}, {
  timestamps: true // Otomatis menambahkan createdAt dan updatedAt
});

// Pre-save hook untuk melakukan hashing password sebelum disimpan ke database
// Hook ini akan berjalan setiap kali dokumen Admin disimpan (baik saat pembuatan baru atau pembaruan)
// dan HANYA jika field 'password' telah dimodifikasi.
adminSchema.pre('save', async function(next) {
  // 'this' merujuk pada dokumen Admin yang akan disimpan
  if (!this.isModified('password')) {
    // Jika password tidak dimodifikasi, lanjutkan ke middleware/operasi berikutnya
    return next();
  }
  try {
    // Generate salt (faktor kompleksitas untuk hashing)
    const salt = await bcrypt.genSalt(10); // Angka 10 adalah cost factor, semakin tinggi semakin aman tapi lambat
    // Hash password dengan salt yang sudah digenerate
    this.password = await bcrypt.hash(this.password, salt);
    // Lanjutkan ke middleware/operasi berikutnya
    next();
  } catch (error) {
    // Jika terjadi error saat hashing, teruskan error tersebut
    next(error);
  }
});

// Method untuk membandingkan password yang diinput dengan password di database
// Ini akan digunakan saat proses login
adminSchema.methods.matchPassword = async function(enteredPassword) {
  // 'this.password' adalah password yang sudah di-hash di database
  // bcrypt.compare akan membandingkan password mentah dengan hash
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Admin', adminSchema);
