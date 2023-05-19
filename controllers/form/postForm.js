const Form = require('../../models/Form');
const catchAsync = require('../../utils/catchAsync');

const postForm = catchAsync(async (req, res) => {
    const { formName, formId, formFields } = req.body;
    if (!formName || !formId) {
        return res.status(400).json({ message: 'Please enter all fields' });
    }

    const form = await Form.create({
        formName,
        formId,
        formFields,
    });
    return res.status(200).json({ message: 'success', form });
});

module.exports = postForm;
