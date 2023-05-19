const Form = require('../../models/Form');
const catchAsync = require('../../utils/catchAsync');

const searchForm = catchAsync(async (req, res) => {
    const { search } = req.query;
    let forms = await Form.find({ $text: { $search: search } });
    if (forms.length < 5) {
        let newForms = await Form.find({ formName: { $regex: `/${search}/g`, $options: 'i' } });
        forms.concat(newForms);
    }
    return res.status(200).json({ forms });
});

module.exports = searchForm;
