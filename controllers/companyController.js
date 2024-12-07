const Company = require('../models/Company');

exports.getAllCompanies = async (req, res, next) => {
    try {
        const companies = await Company.findAll(); // Sequelize의 findAll() 메서드 사용
        res.status(200).json(companies);
    } catch (err) {
        next(err);
    }
};
exports.createCompany = async (req, res, next) => {
    try {
        const company = await Company.create(req.body); // Sequelize의 create() 메서드 사용
        res.status(201).json(company);
    } catch (err) {
        next(err);
    }
};
exports.getCompanyById = async (req, res, next) => {
    try {
        const company = await Company.findOne({ where: { id: req.params.id } }); // findById에 해당하는 findOne 사용
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
        const rowsDeleted = await Company.destroy({ where: { id: req.params.id } }); // destroy() 사용
        if (!rowsDeleted) {
            return res.status(404).json({ message: 'Company not found' });
        }
        res.status(200).json({ message: 'Company deleted successfully' });
    } catch (err) {
        next(err);
    }
};
