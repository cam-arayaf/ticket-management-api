const normalStringData = (stringData, validate) => ({ ...stringData, ...{ validate } });
const enumStringData = (stringData, enumValues) => ({ ...stringData, ...{ default: enumValues.values[0], enum: enumValues } });
const objectIdData = (Schema, ref, required) => ({ type: Schema.Types.ObjectId, ref, required });
const errorResponse = (resp, statusNumber, error) => resp.status(statusNumber).json({ ok: false, error });

module.exports = { normalStringData, enumStringData, objectIdData, errorResponse };