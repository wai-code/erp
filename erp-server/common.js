const Joi = require('joi');

function object_checker(obj, checkers) {
    let checker = Joi.object()
    for (const key of Object.keys(obj)) {
        const name = `${key}_checker`;
        if (checkers.hasOwnProperty(name) && checkers[name]) {
            checker = checker.concat(checkers[name])
        }
    }

    return checker;
}

const filer_invalid_field = (obj) => {
    return Object.fromEntries(
        Object.entries(obj).filter(([key, value]) => value !== undefined)
    );
}


const email_checker = Joi.object({
    email: Joi.string().email().required(),
});

const phone_checker = Joi.object({
    phone: Joi.string().pattern(/^[0-9]{6,15}$/).required(),
});

module.exports = {
    object_checker,
    email_checker,
    phone_checker,
    filer_invalid_field
}