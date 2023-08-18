const Product = require('../Models/Product');
const { sendResponse } = require('../utils/response');
const catchAsync = require('./../utils/catchAsync');
const Joi = require('joi');

const productSchema = Joi.object({
    name: Joi.string().required(),
    amount: Joi.number().required(),
    image: Joi.string(),
    description: Joi.string().allow(''),
    status: Joi.string().valid('active', 'inactive').required()
});

exports.createProduct = catchAsync(async (req, res) => {
    const { error, value } = productSchema.validate(req.body);
    if (error) {
        return sendResponse(res, 400, 'Validation error', error.details);
    }

    const product = await Product.create(value);
    return sendResponse(res, 201, 'Product created successfully', product);
});

exports.updateProduct = catchAsync(async (req, res) => {
    const productId = req.params.productId;
    const { error, value } = productSchema.validate(req.body);
    if (error) {
        return sendResponse(res, 400, 'Validation error', error.details);
    }

    const product = await Product.findByPk(productId);

    if (!product) {
        return sendResponse(res, 404, 'Product not found');
    }

    await product.update(value);
    return sendResponse(res, 200, 'Product updated successfully', product);
});

exports.getProductList = catchAsync(async (req, res) => {
    const products = await Product.findAll({ where: { status: 'active' } });
    return sendResponse(res, 200, 'Product list retrieved successfully', products);
});

exports.getProductListWithFilter = catchAsync(async (req, res) => {
    const { page = 1, limit = 10, status } = req.query;

    const options = {
        attributes: ['id', 'name', 'amount', 'image', 'description', 'status'],
        where: { status: 'active' },
        offset: (page - 1) * limit,
        limit: parseInt(limit),
    };

    if (status) {
        options.where = { status };
    }

    const products = await Product.findAndCountAll(options);

    const totalPages = Math.ceil(products.count / limit);

    return sendResponse(res, 200, 'Product list retrieved successfully', {
        products: products.rows,
        totalPages,
        currentPage: page,
    });
});

exports.getProductDetails = catchAsync(async (req, res) => {
    const productId = req.params.productId;
    const product = await Product.findOne({
        where: { id: productId, status: 'active' }

    });
    if (!product) {
        return sendResponse(res, 404, 'Product not found');
    }

    return sendResponse(res, 200, 'Product details retrieved successfully', product);
});

exports.deleteProduct = catchAsync(async (req, res) => {
    const productId = req.params.productId;
    const product = await Product.findByPk(productId);

    if (!product) {
        return sendResponse(res, 404, 'Product not found');
    }

    await product.destroy();

    return sendResponse(res, 200, 'Product deleted successfully');
});