const mongoose = require('mongoose');

const formSchema = new mongoose.Schema({
    formName: {
        type: String,
        index: true,
        required: [true, 'Please enter form name'],
    },

    formId: { type: String, required: [true, 'Please enter form id'] },

    formFields: [
        {
            ninoxField: String,
            facebookField: {
                type: String,
                set: (value) => {
                    return value.split(' ').join('_');
                },
            },
        },
    ],
});

formSchema.index({
    formName: 'text',
});

const Form = mongoose.model('Form', formSchema);

module.exports = Form;
