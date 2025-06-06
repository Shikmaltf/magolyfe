// backend/controllers/productController.js
const Product = require('../models/Product');
const sharp = require('sharp');

// GET semua produk
exports.getProducts = async (req, res) => {
  try {
    // Pilih field yang dibutuhkan, termasuk imageContentType dan updatedAt
    const products = await Product.find()
      .select('name description price youtubeVideoId createdAt updatedAt imageContentType')
      .sort({ createdAt: -1 });

    res.json(products.map(product => {
        const productObject = product.toObject();
        // Tentukan hasImage berdasarkan keberadaan imageContentType
        productObject.hasImage = !!product.imageContentType;
        if (!productObject.hasImage) {
            delete productObject.imageContentType;
        }
        return productObject;
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Kesalahan server saat mengambil produk.' });
  }
};

// GET produk berdasarkan ID
exports.getProductById = async (req, res) => {
  try {
    // Pilih field yang dibutuhkan untuk form edit, termasuk imageContentType
    const product = await Product.findById(req.params.id)
      .select('name description price youtubeVideoId imageContentType createdAt updatedAt');
      
    if (!product) {
      return res.status(404).json({ message: 'Produk tidak ditemukan.' });
    }
    const productObject = product.toObject();
    // Tentukan hasImage berdasarkan keberadaan imageContentType
    productObject.hasImage = !!product.imageContentType;
    if (!productObject.hasImage) {
        delete productObject.imageContentType;
    }
    res.json(productObject);
  } catch (error) {
    console.error(`Error fetching product by ID ${req.params.id}:`, error);
    if (error.kind === 'ObjectId') {
        return res.status(400).json({ message: 'ID Produk tidak valid.' });
    }
    res.status(500).json({ message: 'Kesalahan server saat mengambil produk.' });
  }
};

// Endpoint baru untuk menyajikan gambar produk
exports.getProductImage = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).select('image imageContentType');
    if (!product || !product.image || !product.imageContentType) {
      // Kirim respons 404 standar
      return res.status(404).send('Gambar tidak ditemukan');
    }
    res.set('Content-Type', product.imageContentType);
    // Tambahkan header Cache-Control
    res.set('Cache-Control', 'public, max-age=3600'); // Cache selama 1 jam
    res.send(product.image);
  } catch (error) {
    console.error(`Error fetching image for product ${req.params.id}:`, error);
     if (error.kind === 'ObjectId') {
        return res.status(400).json({ message: 'ID Produk tidak valid.' });
    }
    res.status(500).json({ message: 'Kesalahan server saat mengambil gambar produk.' });
  }
};

// POST membuat produk baru
exports.createProduct = async (req, res) => {
  const { name, description, price, youtubeVideoId } = req.body;
  let imageBuffer;
  let imageContentType;

  if (req.file) {
     try {
      imageBuffer = await sharp(req.file.buffer)
        .resize({ width: 600, fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 75, progressive: true })
        .toBuffer();
      imageContentType = 'image/jpeg'; // Pastikan ini adalah tipe MIME yang benar
    } catch (sharpError) {
      console.error('Error processing product image with sharp:', sharpError);
      return res.status(500).json({ message: 'Gagal memproses gambar produk.', error: sharpError.message });
    }
  }

  try {
    const newProduct = new Product({
      name,
      description,
      price,
      image: imageBuffer,
      imageContentType, // Simpan contentType
      youtubeVideoId: youtubeVideoId || '',
    });
    const savedProduct = await newProduct.save();
    const responseProduct = savedProduct.toObject();
    delete responseProduct.image; // Hapus buffer gambar dari respons
    // hasImage ditentukan dari data yang baru disimpan
    responseProduct.hasImage = !!(savedProduct.imageContentType && savedProduct.image && savedProduct.image.length > 0);
    if (!responseProduct.hasImage) {
        delete responseProduct.imageContentType;
    }
    res.status(201).json(responseProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    if (error.name === 'ValidationError') {
        return res.status(400).json({ message: 'Validasi gagal.', errors: error.errors });
    }
    res.status(500).json({ message: 'Kesalahan server saat membuat produk.' });
  }
};

// PUT update produk
exports.updateProduct = async (req, res) => {
  const { name, description, price, youtubeVideoId } = req.body;
  const { id } = req.params;

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Produk tidak ditemukan.' });
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price === undefined ? product.price : price; 
    product.youtubeVideoId = typeof youtubeVideoId !== 'undefined' ? youtubeVideoId : product.youtubeVideoId;

    if (req.file) {
      try {
        product.image = await sharp(req.file.buffer)
          .resize({ width: 600, fit: 'inside', withoutEnlargement: true })
          .jpeg({ quality: 75, progressive: true })
          .toBuffer();
        product.imageContentType = 'image/jpeg'; // Pastikan ini adalah tipe MIME yang benar
      } catch (sharpError) {
         console.error('Error processing product image for update with sharp:', sharpError);
        return res.status(500).json({ message: 'Gagal memproses gambar produk untuk update.', error: sharpError.message });
      }
    } else if (req.body.removeImage === 'true' || req.body.removeImage === true) {
        product.image = undefined;
        product.imageContentType = undefined;
    }

    // Penting: set updatedAt agar frontend bisa melakukan cache-busting
    product.updatedAt = new Date();
    const updatedProduct = await product.save();
    const responseProduct = updatedProduct.toObject();
    delete responseProduct.image; // Hapus buffer gambar dari respons
    // hasImage ditentukan dari data yang baru diupdate
    responseProduct.hasImage = !!(updatedProduct.imageContentType && updatedProduct.image && updatedProduct.image.length > 0);
    if (!responseProduct.hasImage) {
        delete responseProduct.imageContentType;
    }
    res.json(responseProduct);
  } catch (error) {
    console.error(`Error updating product ${id}:`, error);
     if (error.name === 'ValidationError') {
        return res.status(400).json({ message: 'Validasi gagal.', errors: error.errors });
    }
    if (error.kind === 'ObjectId') {
        return res.status(400).json({ message: 'ID Produk tidak valid.' });
    }
    res.status(500).json({ message: 'Kesalahan server saat memperbarui produk.' });
  }
};

// DELETE produk
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: 'Produk tidak ditemukan.' });
    }
    res.json({ message: 'Produk berhasil dihapus.' });
  } catch (error) {
    console.error(`Error deleting product ${id}:`, error);
    if (error.kind === 'ObjectId') {
        return res.status(400).json({ message: 'ID Produk tidak valid.' });
    }
    res.status(500).json({ message: 'Kesalahan server saat menghapus produk.' });
  }
};
