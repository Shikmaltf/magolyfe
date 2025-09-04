const articleController = require('../controllers/articleController');
const Article = require('../models/Article');
const sharp = require('sharp');

jest.mock('sharp');

// **FIX**: Gunakan module factory untuk mock constructor
const mockSave = jest.fn();
jest.mock('../models/Article', () => {
  // Mock constructor Article
  return jest.fn().mockImplementation(() => {
    // Constructor ini mengembalikan sebuah objek dengan method save
    return { save: mockSave };
  });
});

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  res.set = jest.fn().mockReturnValue(res);
  return res;
};

describe('Article Controller', () => {
  let req, res;

  beforeEach(() => {
    res = mockResponse();
    req = { body: {}, params: {}, file: null };
    // **FIX**: Hapus history panggilan dari mock sebelum setiap test
    mockSave.mockClear();
    Article.mockClear();
    jest.clearAllMocks();
  });

  // Test untuk getArticles
  describe('getArticles', () => {
    it('should return all articles', async () => {
      const mockArticles = [
        { _id: '1', title: 'Article 1', content: 'Content 1', imageContentType: 'image/jpeg', toObject: () => ({ _id: '1', title: 'Article 1', content: 'Content 1', imageContentType: 'image/jpeg' }) },
        { _id: '2', title: 'Article 2', content: 'Content 2', toObject: () => ({ _id: '2', title: 'Article 2', content: 'Content 2' }) },
      ];
      Article.find = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(mockArticles),
      });

      await articleController.getArticles(req, res);

      expect(res.json).toHaveBeenCalledWith([
        { _id: '1', title: 'Article 1', content: 'Content 1', imageContentType: 'image/jpeg', hasImage: true },
        { _id: '2', title: 'Article 2', content: 'Content 2', hasImage: false },
      ]);
    });
  });

  // Test untuk getArticleById
  describe('getArticleById', () => {
    it('should return a single article by id', async () => {
      req.params.id = '1';
      const mockArticle = { _id: '1', title: 'Test Article', toObject: () => ({ _id: '1', title: 'Test Article' }) };
      Article.findById = jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue(mockArticle),
      });

      await articleController.getArticleById(req, res);

      expect(res.json).toHaveBeenCalledWith({ _id: '1', title: 'Test Article', hasImage: false });
    });

    it('should return 404 if article not found', async () => {
      req.params.id = '999';
       Article.findById = jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue(null),
      });

      await articleController.getArticleById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Artikel tidak ditemukan.' });
    });
  });

    // Test untuk createArticle
    describe('createArticle', () => {
        it('should create an article without an image', async () => {
        req.body = { title: 'New Article', content: 'Some content' };
        // req.file tidak di-set karena tidak ada gambar
        
        const savedArticleData = {
            _id: '3',
            title: 'New Article',
            content: 'Some content',
            image: undefined,
            imageContentType: undefined
        };

        // Konfigurasi apa yang akan dikembalikan oleh mockSave
        mockSave.mockResolvedValue({
            ...savedArticleData,
            toObject: () => savedArticleData
        });

        await articleController.createArticle(req, res);

        // Pastikan sharp tidak dipanggil
        expect(sharp).not.toHaveBeenCalled();
        // Pastikan constructor Article dipanggil
        expect(Article).toHaveBeenCalledTimes(1);
        // Pastikan method save dipanggil
        expect(mockSave).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(201);
        // Pastikan respons memiliki hasImage: false
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            title: 'New Article',
            hasImage: false
        }));
        });
    });

  // Test untuk updateArticle
  describe('updateArticle', () => {
    it('should update an article and remove image', async () => {
        req.params.id = '1';
        req.body = { title: 'Updated Title', removeImage: 'true' };
        
        const mockArticleInstance = {
            _id: '1',
            title: 'Old Title',
            image: Buffer.from('old-image'),
            imageContentType: 'image/jpeg',
            save: jest.fn().mockResolvedValue({
                _id: '1',
                title: 'Updated Title',
                image: undefined,
                imageContentType: undefined,
                toObject: () => ({ _id: '1', title: 'Updated Title' })
            })
        };
        Article.findById = jest.fn().mockResolvedValue(mockArticleInstance);

        await articleController.updateArticle(req, res);

        expect(mockArticleInstance.title).toBe('Updated Title');
        expect(mockArticleInstance.image).toBeUndefined();
        expect(mockArticleInstance.imageContentType).toBeUndefined();
        expect(mockArticleInstance.save).toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ title: 'Updated Title', hasImage: false }));
    });
  });

  // Test untuk deleteArticle
  describe('deleteArticle', () => {
    it('should delete an article', async () => {
      req.params.id = '1';
      Article.findByIdAndDelete = jest.fn().mockResolvedValue({ _id: '1' });

      await articleController.deleteArticle(req, res);

      expect(Article.findByIdAndDelete).toHaveBeenCalledWith('1');
      expect(res.json).toHaveBeenCalledWith({ message: 'Artikel berhasil dihapus.' });
    });
  });
});