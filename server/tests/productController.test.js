const productController = require('../controllers/productController');
const Product = require('../models/Product');
const sharp = require('sharp');

jest.mock('sharp');

// Gunakan module factory untuk mock constructor
const mockProductSave = jest.fn();
jest.mock('../models/Product', () => {
  return jest.fn().mockImplementation(() => {
    return { save: mockProductSave };
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

describe('Product Controller', () => {
  let req, res;

  beforeEach(() => {
    res = mockResponse();
    req = { body: {}, params: {}, file: null };
    mockProductSave.mockClear();
    Product.mockClear();
    jest.clearAllMocks();
  });

  // Test untuk getProducts
  describe('getProducts', () => {
    it('should return all products', async () => {
      const mockProducts = [
        { _id: 'p1', name: 'Product 1', price: 100, toObject: () => ({ _id: 'p1', name: 'Product 1', price: 100 }) },
      ];
      Product.find = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(mockProducts),
      });

      await productController.getProducts(req, res);

      expect(res.json).toHaveBeenCalledWith([
        { _id: 'p1', name: 'Product 1', price: 100, hasImage: false },
      ]);
    });
  });

  // Test untuk getProductById
  describe('getProductById', () => {
    it('should return 404 if product not found', async () => {
      req.params.id = 'p999';
      Product.findById = jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue(null),
      });

      await productController.getProductById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Produk tidak ditemukan.' });
    });
  });

    // Test untuk createProduct
  describe('createProduct', () => {
    it('should create a product without an image', async () => {
      req.body = { name: 'New Product', description: 'Desc', price: 50 };
      
      const savedProductData = {
        _id: 'p3',
        name: 'New Product'
      };
      
      mockProductSave.mockResolvedValue({
        ...savedProductData,
        toObject: () => savedProductData
      });

      await productController.createProduct(req, res);

      expect(sharp).not.toHaveBeenCalled();
      expect(Product).toHaveBeenCalledTimes(1);
      expect(mockProductSave).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ name: 'New Product', hasImage: false }));
    });
  });

  // Test untuk deleteProduct
  describe('deleteProduct', () => {
    it('should delete a product', async () => {
      req.params.id = 'p1';
      Product.findByIdAndDelete = jest.fn().mockResolvedValue({ _id: 'p1' });

      await productController.deleteProduct(req, res);

      expect(Product.findByIdAndDelete).toHaveBeenCalledWith('p1');
      expect(res.json).toHaveBeenCalledWith({ message: 'Produk berhasil dihapus.' });
    });

    it('should return 404 when trying to delete a non-existent product', async () => {
        req.params.id = 'p999';
        Product.findByIdAndDelete = jest.fn().mockResolvedValue(null);

        await productController.deleteProduct(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Produk tidak ditemukan.' });
    });
  });
});