const InvariantError = require('../../exceptions/InvariantError');
const { PlaylistPayloadSchema, SongToPlaylistPayloadSchema, PlaylistSongPayloadSchema } = require('./schema');

const PlaylistsValidator = {
  validatePlaylistPayload: (payload) => {
    const validationResult = PlaylistPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validateSongToPlaylistPayload: (payload) => {
    const validationResult = SongToPlaylistPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validatePlaylistSongPayload: (payload) => {
    const validationResult = PlaylistSongPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  }
};

module.exports = PlaylistsValidator;
