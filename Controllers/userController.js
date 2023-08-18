const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const User = require('../Models/User');
const catchAsync = require('./../utils/catchAsync');
const { secret } = require('../config/config');
const { promisify } = require('util');

const userSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    status: Joi.string(),
    role: Joi.string(),
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

const registerUser = catchAsync(async (req, res) => {
    const { name, email, password, status, role } = req.body;

    const { error } = userSchema.validate({ name, email, password, status, role });
    if (error) {
        return res.status(400).json({
            status: 'Fail',
            message: error.details[0].message,
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const data = {
        name: name,
        email: email,
        password: hashedPassword,
        status: status,
        role: role
    };

    const user = await User.create(data);

    const token = jwt.sign({ user: user.id, role: user.role }, secret, { expiresIn: '1h' });

    return res.status(200).json({
        status: 'Success',
        message: 'User created successfully',
        data: user,
        token: token,
    });
});

const loginUser = catchAsync(async (req, res) => {
    const { email, password } = req.body;

    const { error } = loginSchema.validate({ email, password });
    if (error) {
        return res.status(400).json({
            status: 'Fail',
            message: error.details[0].message,
        });
    }

    const user = await User.findOne({
        where: { email: email },
    });

    if (!user) {
        return res.status(401).json({
            status: 'Fail',
            message: 'User not found',
        });
    }
    if (user.status === 'banned') {
        return res.status(401).json({
            status: 'Fail',
            message: 'User is banned and cannot log in'
        });
    }
    const isAuthenticated = await bcrypt.compare(password, user.password);
    if (isAuthenticated) {
        const token = jwt.sign({ user: user.id, role: user.role }, secret, { expiresIn: '1h' });

        return res.status(200).json({
            status: 'Success',
            message: 'User login successfully',
            token: token,
        });
    } else {
        return res.status(401).json({
            status: 'Fail',
            message: 'Invalid password',
        });
    }
});
const isLoggedIn = async (req, res, next) => {
    const token = req.headers?.authorization?.replace('Bearer ', '')?.replace('bearer ', '').trim();

    if (token) {
        try {
            const decoded = await promisify(jwt.verify)(token, secret);
            const currentUser = await User.findOne({
                where: {
                    id: decoded.user
                }
            });
            if (!currentUser) {
                return next();
            }
            req.user = currentUser;
            return next();
        } catch (err) {
            return next(err.message);
        }
    }
    return next(new AppError('something'));
};

const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new AppError('You do not have permission to perform this action', 403)
            );
        }
        next();
    };
};

module.exports = { registerUser, loginUser, isLoggedIn, restrictTo };