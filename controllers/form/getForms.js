const Form = require('../../models/Form');
const catchAsync = require('../../utils/catchAsync');

const getForms = catchAsync(async (req, res) => {
    const { page = 0, limit = 10 } = req.query;
    const forms = await Form.find()
        .skip(limit * page)
        .limit(limit);

    return res.status(200).json({ forms });
});

module.exports = getForms;
