const { Pool } = require('pg');
const fs = require('fs');

const InvariantError = require('../../exceptions/InvariantError');

class StorageService {
  constructor(folder) {
    this._folder = folder;
    this._pool = new Pool();

    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }
  }

  writeFile(file, meta) {
    const filename = +new Date() + meta.filename;
    const path = `${this._folder}/${filename}`;

    const fileStream = fs.createWriteStream(path);

    return new Promise((resolve, reject) => {
      fileStream.on('error', (error) => reject(error));
      file.pipe(fileStream);
      file.on('end', () => resolve(filename));
    });
  }

  async addCoverToAlbum(albumId, filename) {
    filename = `http://${process.env.HOST}:${process.env.PORT}/upload/images/${filename}`;

    const query = {
      text: 'UPDATE albums SET "coverUrl" = $1 WHERE id = $2 RETURNING id',
      values: [filename, albumId],
    };

    const result = await this._pool.query(query);

    console.log(result);

    if (!result.rows.length) {
      throw new InvariantError('Gagal menambahkan cover album');
    }
  }

  async getFile(filename) {
    const path = `${this._folder}/${filename}`;
    return fs.readFileSync(path);
  }
}

module.exports = StorageService;
