const express = require('express');
const {
    getAllCompanies,
    createCompany,
    getCompanyById,
    deleteCompany,
} = require('../controllers/companyController');

const router = express.Router();

router.get('/', getAllCompanies);
router.post('/', createCompany);
router.get('/:id', getCompanyById);
router.delete('/:id', deleteCompany);

module.exports = router;
