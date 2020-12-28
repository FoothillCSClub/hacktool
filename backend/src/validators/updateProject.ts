import Joi from 'joi';

const updateProject = Joi.object({
    title: Joi.string()
        .required(),
    description: Joi.string()
        .required(),
    projectURL: Joi.string(),
    skills: Joi.array()
        .items(Joi.string()),
})

export default updateProject;