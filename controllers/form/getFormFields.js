const { default: axios } = require('axios');
const { FACEBOOK_USER_ACCESS_TOKEN } = require('../../config/keys');
const catchAsync = require('../../utils/catchAsync');

const getFields = catchAsync(async (req, res) => {
    const { formId } = req.query;

    try {
        const response = await axios.get(
            `https://graph.facebook.com/v16.0/${formId}?access_token=${FACEBOOK_USER_ACCESS_TOKEN}&fields=id,name,questions`
        );
        const { data } = response;
        const fields = data.questions.map((question) => ({ key: question.key, label: question.label }));
        return res.status(200).json({ formName: data.name, fields });
    } catch (err) {
        console.log(err.response.data);
        return res
            .status(400)
            .json({ message: err.response?.data.message || 'Error verifying form, please check form id' });
    }
});

module.exports = getFields;
