import Joi from 'joi';

const createFeedback = Joi.object({
    feedback: Joi.string()
        .required()
        .max(1500)
});

export default createFeedback;