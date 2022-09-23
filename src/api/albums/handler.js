const autoBind = require('auto-bind');

class AlbumHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postAlbumHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);
    const { name, year } = request.payload;

    const albumId = await this._service.addAlbum({ name, year });

    const response = h.response({
      status: 'success',
      data: {
        albumId,
      },
    });

    response.code(201);
    return response;
  }

  async getAlbumByIdHandler(request, h) {
    const { id } = request.params;
    const album = await this._service.getAlbumById(id);

    const response = h.response({
      status: 'success',
      data: {
        album,
      },
    });

    response.code(200);
    return response;
  }

  async putAlbumByIdHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);
    const { id } = request.params;
    const { name, year } = request.payload;

    await this._service.editAlbumById(id, { name, year });

    const response = h.response({
      status: 'success',
      message: 'Album berhasil diperbarui',
    });

    response.code(200);
    return response;
  }

  async deleteAlbumByIdHandler(request, h) {
    const { id } = request.params;

    await this._service.deleteAlbumById(id);

    const response = h.response({
      status: 'success',
      message: 'Album berhasil dihapus',
    });

    response.code(200);
    return response;
  }

  async postAlbumByIdLikeHandler(request, h) {
    const { id } = request.params;
    const { id: userId } = request.auth.credentials;

    await this._service.postAlbumLikeByUserIdAndAlbumId({ userId, albumId: id });

    const response = h.response({
      status: 'success',
      message: 'Album berhasil diupdate',
    });

    response.code(201);
    return response;
  }

  async getAlbumByIdLikeHandler(request, h) {
    const { id } = request.params;

    const likes = await this._service.getAlbumLike(id)

    const response = h.response({
      status: 'success',
      data: {
        likes,
      },
    });

    response.code(200);
    return response;
  }
}

module.exports = AlbumHandler;