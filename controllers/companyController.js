const Company = require('../models/Company');

exports.getAllCompanies = async (req, res, next) => {
    try {
        const companies = await Company.find();
        res.status(200).json(companies);
    } catch (err) {
        next(err);
    }
};

exports.createCompany = async (req, res, next) => {
    try {
        const company = new Company(req.body);
        await company.save();
        res.status(201).json(company);
    } catch (err) {
        next(err);
    }
};

exports.getCompanyById = async (req, res, next) => {
    try {
        const company = await Company.findById(req.params.id);
        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }
        res.status(200).json(company);
    } catch (err) {
        next(err);
    }
};

exports.deleteCompany = async (req, res, next) => {
    try {
        await Company.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Company deleted successfully' });
    } catch (err) {
        next(err);
    }
};
