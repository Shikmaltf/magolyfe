// scripts/seedAdmin.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Admin = require('../models/Admin');

require('dotenv').config();

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const username = 'admin';
    const plainPassword = 'watesa02';

    // Hash password
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // Cek apakah admin sudah ada
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      console.log('Admin sudah ada di database');
      process.exit(0);
    }

    // Buat admin baru
    const admin = new Admin({
      username,
      password: hashedPassword,
    });

    await admin.save();
    console.log('Admin berhasil dibuat');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

createAdmin();
