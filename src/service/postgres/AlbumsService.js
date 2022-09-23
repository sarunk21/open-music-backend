// Package
const { Pool } = require('pg');
const { nanoid } = require('nanoid')

// Exception
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

// Utils
const { mapDBToModelDetail } = require('../../utils/albums');

class AlbumsService {
  constructor() {
    this._pool = new Pool();
  }

  async addAlbum({ name, year }) {
    const id = `album-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3) RETURNING id',
      values: [id, name, year],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Album gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getAlbumById(id) {
    const queryAlbum = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [id],
    };
    const querySongs = {
      text: 'SELECT * FROM songs WHERE album_id = $1',
      values: [id],
    };

    const resultAlbum = await this._pool.query(queryAlbum);
    const resultSongs = await this._pool.query(querySongs);

    if (!resultAlbum.rows.length) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    return {
      ...resultAlbum.rows.map(mapDBToModelDetail)[0],
      songs: resultSongs.rows.map(mapDBToModelDetail),
    };
  }

  async editAlbumById(id, { name, year }) {
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id',
      values: [name, year, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan');
    }
  }

  async verifyAlbumLikeByUserIdAndAlbumId({ userId, albumId }) {
    const query = {
      text: 'SELECT * FROM user_album_likes WHERE user_id = $1 AND album_id = $2',
      values: [userId, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      return false;
    }

    return true;
  }

  async postAlbumLikeByUserIdAndAlbumId({ userId, albumId }) {
    const id = `like-${nanoid(16)}`;

    if (await this.verifyAlbumLikeByUserIdAndAlbumId({ userId, albumId })) {
      await this.deleteAlbumLikeByUserIdAndAlbumId({ userId, albumId });
      return;
    }

    const query = {
      text: 'INSERT INTO user_album_likes VALUES($1, $2, $3) RETURNING id',
      values: [id, userId, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Album gagal ditambahkan');
    }
  }

  async deleteAlbumLikeByUserIdAndAlbumId({ userId, albumId }) {
    const query = {
      text: 'DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2 RETURNING id',
      values: [userId, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Album gagal dihapus');
    }
  }

  async getAlbumLike(id) {
    const query = {
      text: 'SELECT COUNT(*) FROM user_album_likes WHERE album_id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    return parseInt(result.rows[0].count);
  }

}

module.exports = AlbumsService;