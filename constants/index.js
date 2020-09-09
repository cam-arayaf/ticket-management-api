const enumMessage = `{VALUE} isn't a valid`;
const required = [true, '{PATH} is required'];
const uniqueMessage = { message: '{PATH} must be unique' };
const requiredStringData = { type: String, trim: true, required };
const uniqueStringData = { ...requiredStringData, ...{ unique: true } };
const booleanData = { type: Boolean, default: true };
const regexPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
const errorPassword = 'Password is required and must have at least one lowercase letter, one uppercase letter, one numeric digit, one special character and be between 8 and 15 characters';

module.exports = {
    enumMessage,
    required,
    uniqueMessage,
    requiredStringData,
    uniqueStringData,
    booleanData,
    regexPassword,
    errorPassword
};