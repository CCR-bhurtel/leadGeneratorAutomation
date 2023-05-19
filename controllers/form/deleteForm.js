const Form = require('../../models/Form');
const catchAsync = require('../../utils/catchAsync');

const deleteForm = catchAsync(async (req, res) => {
    const { id } = req.params;
    await Form.findByIdAndDelete(id);
    res.status(200).json({ message: 'Form deleted successfully' });
});

module.exports = deleteForm;
