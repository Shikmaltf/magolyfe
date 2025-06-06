// backend/controllers/articleController.js
const Article = require('../models/Article');
const sharp = require('sharp'); // Untuk kompresi gambar

// GET semua artikel
exports.getArticles = async (req, res) => {
  try {
    // Pilih field yang dibutuhkan, termasuk imageContentType dan updatedAt
    const articles = await Article.find()
      .select('title content youtubeVideoId createdAt updatedAt imageContentType') 
      .sort({ createdAt: -1 });
    
    res.json(articles.map(article => {
      const articleObject = article.toObject();
      // Tentukan hasImage berdasarkan keberadaan imageContentType
      articleObject.hasImage = !!article.imageContentType; 
      // Hapus imageContentType dari respons jika tidak ada gambar, agar konsisten
      if (!articleObject.hasImage) {
        delete articleObject.imageContentType;
      }
      return articleObject;
    }));
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ message: 'Kesalahan server saat mengambil artikel.' });
  }
};

// GET artikel berdasarkan ID
exports.getArticleById = async (req, res) => {
  try {
    // Pilih field yang dibutuhkan untuk form edit, termasuk imageContentType
    const article = await Article.findById(req.params.id)
      .select('title content youtubeVideoId imageContentType createdAt updatedAt'); 
    
    if (!article) {
      return res.status(404).json({ message: 'Artikel tidak ditemukan.' });
    }
    
    const articleObject = article.toObject();
    // Tentukan hasImage berdasarkan keberadaan imageContentType
    articleObject.hasImage = !!article.imageContentType;
    if (!articleObject.hasImage) {
      delete articleObject.imageContentType;
    }
    res.json(articleObject);
  } catch (error) {
    console.error(`Error fetching article by ID ${req.params.id}:`, error);
    if (error.kind === 'ObjectId') {
        return res.status(400).json({ message: 'ID Artikel tidak valid.' });
    }
    res.status(500).json({ message: 'Kesalahan server saat mengambil artikel.' });
  }
};

// Endpoint baru untuk menyajikan gambar artikel
exports.getArticleImage = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id).select('image imageContentType');
    if (!article || !article.image || !article.imageContentType) {
      // Kirim respons 404 standar jika gambar tidak ada, agar frontend bisa menanganinya (misalnya dengan placeholder)
      return res.status(404).send('Gambar tidak ditemukan');
    }
    res.set('Content-Type', article.imageContentType);
    // Tambahkan header Cache-Control untuk caching di browser
    res.set('Cache-Control', 'public, max-age=3600'); // Cache selama 1 jam
    res.send(article.image);
  } catch (error) {
    console.error(`Error fetching image for article ${req.params.id}:`, error);
    if (error.kind === 'ObjectId') {
        return res.status(400).json({ message: 'ID Artikel tidak valid.' });
    }
    res.status(500).json({ message: 'Kesalahan server saat mengambil gambar artikel.' });
  }
};

// POST membuat artikel baru (khusus admin)
exports.createArticle = async (req, res) => {
  const { title, content, youtubeVideoId } = req.body;
  let imageBuffer;
  let imageContentType;

  if (req.file) {
    try {
      imageBuffer = await sharp(req.file.buffer)
        .resize({ width: 800, fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 80, progressive: true })
        .toBuffer();
      imageContentType = 'image/jpeg'; // Pastikan ini adalah tipe MIME yang benar
    } catch (sharpError) {
      console.error('Error processing image with sharp:', sharpError);
      return res.status(500).json({ message: 'Gagal memproses gambar.', error: sharpError.message });
    }
  }

  try {
    const newArticle = new Article({
      title,
      content,
      image: imageBuffer,
      imageContentType, // Simpan contentType
      youtubeVideoId: youtubeVideoId || '',
    });
    const savedArticle = await newArticle.save();
    const responseArticle = savedArticle.toObject();
    delete responseArticle.image; // Hapus buffer gambar dari respons
    // hasImage ditentukan dari data yang baru disimpan (sebelum buffer dihapus dari responseArticle)
    responseArticle.hasImage = !!(savedArticle.imageContentType && savedArticle.image && savedArticle.image.length > 0);
    if (!responseArticle.hasImage) {
        delete responseArticle.imageContentType;
    }
    res.status(201).json(responseArticle);
  } catch (error) {
    console.error('Error creating article:', error);
    if (error.name === 'ValidationError') {
        return res.status(400).json({ message: 'Validasi gagal.', errors: error.errors });
    }
    res.status(500).json({ message: 'Kesalahan server saat membuat artikel.' });
  }
};

// PUT update artikel (khusus admin)
exports.updateArticle = async (req, res) => {
  const { title, content, youtubeVideoId } = req.body;
  const { id } = req.params;

  try {
    const article = await Article.findById(id);
    if (!article) {
      return res.status(404).json({ message: 'Artikel tidak ditemukan.' });
    }

    article.title = title || article.title;
    article.content = content || article.content;
    article.youtubeVideoId = typeof youtubeVideoId !== 'undefined' ? youtubeVideoId : article.youtubeVideoId;

    if (req.file) {
      try {
        article.image = await sharp(req.file.buffer)
          .resize({ width: 800, fit: 'inside', withoutEnlargement: true })
          .jpeg({ quality: 80, progressive: true })
          .toBuffer();
        article.imageContentType = 'image/jpeg'; // Pastikan ini adalah tipe MIME yang benar
      } catch (sharpError) {
        console.error('Error processing image for update with sharp:', sharpError);
        return res.status(500).json({ message: 'Gagal memproses gambar untuk update.', error: sharpError.message });
      }
    } else if (req.body.removeImage === 'true' || req.body.removeImage === true) {
        article.image = undefined;
        article.imageContentType = undefined;
    }
    
    // Penting: set updatedAt agar frontend bisa melakukan cache-busting
    article.updatedAt = new Date();
    const updatedArticle = await article.save();
    const responseArticle = updatedArticle.toObject();
    delete responseArticle.image; // Hapus buffer gambar dari respons
    // hasImage ditentukan dari data yang baru diupdate
    responseArticle.hasImage = !!(updatedArticle.imageContentType && updatedArticle.image && updatedArticle.image.length > 0);
     if (!responseArticle.hasImage) {
        delete responseArticle.imageContentType;
    }
    res.json(responseArticle);
  } catch (error) {
    console.error(`Error updating article ${id}:`, error);
    if (error.name === 'ValidationError') {
        return res.status(400).json({ message: 'Validasi gagal.', errors: error.errors });
    }
    if (error.kind === 'ObjectId') {
        return res.status(400).json({ message: 'ID Artikel tidak valid.' });
    }
    res.status(500).json({ message: 'Kesalahan server saat memperbarui artikel.' });
  }
};

// DELETE artikel (khusus admin)
exports.deleteArticle = async (req, res) => {
  const { id } = req.params;
  try {
    const article = await Article.findByIdAndDelete(id);
    if (!article) {
      return res.status(404).json({ message: 'Artikel tidak ditemukan.' });
    }
    res.json({ message: 'Artikel berhasil dihapus.' });
  } catch (error) {
    console.error(`Error deleting article ${id}:`, error);
    if (error.kind === 'ObjectId') {
        return res.status(400).json({ message: 'ID Artikel tidak valid.' });
    }
    res.status(500).json({ message: 'Kesalahan server saat menghapus artikel.' });
  }
};
