const autoBind = require('auto-bind');

class UploadsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postUploadImageHandler(request, h) {
    const { cover: data } = request.payload;

    this._validator.validateImageHeaders(data.hapi.headers);

    const fileLocation = await this._service.writeFile(data, data.hapi);
    await this._service.addCoverToAlbum(request.params.id, fileLocation);

    const response = h.response({
      "status": "success",
      "message": "Sampul berhasil diunggah"
    });
    response.code(201);
    return response;
  }

  async getImageHandler(request, h) {
    try {
      const { filename } = request.params;
      const file = await this._service.getFile(filename);

      return h.response(file).code(200);
    } catch (error) {
      return h.response({
        status: 'fail',
        message: error.message,
      }).code(404);
    }
  }
}

module.exports = UploadsHandler;
