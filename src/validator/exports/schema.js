const Joi = require('joi');

const ExportPlaylistsPayloadSchema = Joi.object({
  targetEmail: Joi.string().email({ tlds: { allow: false } }).required(),
});

module.exports = ExportPlaylistsPayloadSchema;