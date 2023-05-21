const Form = require('../../models/Form');
const catchAsync = require('../../utils/catchAsync');

const searchForm = catchAsync(async (req, res) => {
    const { search } = req.query;

    const regex = new RegExp(search, 'i');
    let forms = await Form.find({ formName: regex });

    return res.status(200).json({ forms });
});

module.exports = searchForm;
