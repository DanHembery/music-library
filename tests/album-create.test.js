const { expect } = require('chai');
const request = require('supertest');
const getDb = require('../src/services/db');
const app = require('../src/app');

describe('create album', () => {
  let db;
  let artists;
  beforeEach(async () => {
    db = await getDb();
    await Promise.all([
      db.query('INSERT INTO Artist (name, genre) VALUES(?, ?)', [
        'Tame Impala',
        'rock',
      ]),
      db.query('INSERT INTO Artist (name, genre) VALUES(?, ?)', [
        'Kylie Minogue',
        'pop',
      ]),
      db.query('INSERT INTO Artist (name, genre) VALUES(?, ?)', [
        'Dave Brubeck',
        'jazz',
      ]),
    ]);

    [artists] = await db.query('SELECT * FROM Artist')
  });

  afterEach(async () => {
    await db.query('DELETE FROM Album');
    await db.query('DELETE FROM Artist');
    await db.end();
  });

  describe('/artist/:artistId/album', () => {
    describe('POST', () => {
      it('creates a new album in the database', async () => {
        const artist = artists[0];
        const res = await request(app).post(`/artist/${artist.id}/album`).send({
          name: 'Greatest Hits',
          year: 2008
        });

        expect(res.status).to.equal(201);

        const [[albumEntries]] = await db.query(
          `SELECT * FROM Album WHERE name = 'Greatest Hits'`
        );

        expect(albumEntries.name).to.equal('Greatest Hits');
        expect(albumEntries.year).to.equal(2008);
      });
    });
  });
});