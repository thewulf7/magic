const magic = require('../magic');

const fs       = require('fs');
const readline = require('readline');
const assert   = require('assert');
const sodium   = require('libsodium-wrappers-sumo');


/***
 * sign
 *
 * test vectors for magic.auth.sign()
 *
 */
function sign(cont) {

  // path resolution is from parent directory
  const fp = readline.createInterface({ input: fs.createReadStream('./test/vectors/ed25519.vec') });

  // https://ed25519.cr.yp.to/python/sign.py
  let c = 0;
  fp.on('line', (line) => {
    c++;

    const sec = line.split(':');
    const sk  = Buffer.from(sec[0], 'hex'); // djb implementation doesn't append pk to sk, so parsing is different
    const pk  = Buffer.from(sodium.crypto_sign_ed25519_sk_to_pk(sk));

    const m = Buffer.from(sec[2], 'hex');

    it('magic.auth.sign - Test Vector #' + c, (done) => {
      magic.auth.sign(m, sk, (err, out) => {
        if (err) { return done(err); }

        const s = out.signature;
        assert.ok(sodium.crypto_sign_verify_detached(s, m, pk));

        try {
          let fm, fml, fs = 0;
          if (m.length === 0) {
            fm = 'x';
          } else {
            fml = m.length;
            for (let i = 0; i < fml; i++) { fm += String.fromCharCode(m[i] + (i === fml - 1));}
          }

          assert.ok(!sodium.crypto_sign_verify_detached(s, fm, pk));
        } catch(ex) {}

        assert.equal(sec[0], sk.toString('hex')); // djb implementation doesn't append pk to sk, so check is different
        assert.equal(sec[1], pk.toString('hex'));
        assert.equal(sec[3], Buffer.concat([ s, m ]).toString('hex'));

        done();
      });
    });
  });

  fp.on('close', () => { cont(); });
}


/***
 * mac
 *
 * test vectors for magic.auth.mac()
 *
 */
function mac(cont) {

  // path resolution is from parent directory
  const fp = readline.createInterface({ input: fs.createReadStream('./test/vectors/hmacsha384.vec') });

  // https://tools.ietf.org/html/rfc4231
  let c = 0;
  fp.on('line', (line) => {
    c++;

    const sec = line.split(':');
    const k = Buffer.from(sec[0], 'hex');
    const m = Buffer.from(sec[1], 'hex');

    it('magic.auth.mac - Test Vector #' + c, (done) => {
      magic.auth.mac(m, k, (err, out) => {
        if (err) { return done(err); }

        const t = out.mac;
        assert.equal(sec[2], t.toString('hex'));

        done();
      });
    });
  });

  fp.on('close', () => { cont(); });
}


/***
 * hash
 *
 * test vectors for magic.util.hash()
 *
 */
function hash(cont) {

  // path resolution is from parent directory
  const fp = readline.createInterface({ input: fs.createReadStream('./test/vectors/sha384.vec') });

  // https://csrc.nist.gov/projects/cryptographic-algorithm-validation-program/secure-hashing#sha-2
  let c = 0;
  fp.on('line', (line) => {
    c++;

    const sec = line.split(':');
    const m = Buffer.from(sec[0], 'hex');

    it('magic.util.hash - Test Vector #' + c, (done) => {
      magic.util.hash(m, (err, out) => {
        if (err) { return done(err); }

        const t = out.hash;
        assert.equal(sec[1], t.toString('hex'));

        done();
      });
    });
  });

  fp.on('close', () => { cont(); });
}


/***
 * core
 *
 * core api test definer
 *
 */
function core() {
  const fs = [ sign, mac, hash ];

  (function setup() {
    const f = fs.shift();
    if (!f) { return alt(); }

    f(setup);
  })();
}


/***
 * hmacsha256
 *
 * test vectors for magic.alt.auth.hmacsha256()
 *
 */
function hmacsha256(cont) {

  // path resolution is from parent directory
  const fp = readline.createInterface({ input: fs.createReadStream('./test/vectors/hmacsha256.vec') });

  // https://tools.ietf.org/html/rfc4231
  let c = 0;
  fp.on('line', (line) => {
    c++;

    const sec = line.split(':');
    const k = Buffer.from(sec[0], 'hex');
    const m = Buffer.from(sec[1], 'hex');

    it('magic.alt.auth.hmacsha256 - Test Vector #' + c, (done) => {
      magic.alt.auth.hmacsha256(m, k, (err, out) => {
        if (err) { return done(err); }

        const t = out.mac;
        assert.equal(sec[2], t.toString('hex'));

        done();
      });
    });
  });

  fp.on('close', () => { cont(); });
}


/***
 * hmacsha512
 *
 * test vectors for magic.alt.auth.hmacsha512()
 *
 */
function hmacsha512(cont) {

  // path resolution is from parent directory
  const fp = readline.createInterface({ input: fs.createReadStream('./test/vectors/hmacsha512.vec') });

  // https://tools.ietf.org/html/rfc4231
  let c = 0;
  fp.on('line', (line) => {
    c++;

    const sec = line.split(':');
    const k = Buffer.from(sec[0], 'hex');
    const m = Buffer.from(sec[1], 'hex');

    it('magic.alt.auth.hmacsha512 - Test Vector #' + c, (done) => {
      magic.alt.auth.hmacsha512(m, k, (err, out) => {
        if (err) { return done(err); }

        const t = out.mac;
        assert.equal(sec[2], t.toString('hex'));

        done();
      });
    });
  });

  fp.on('close', () => { cont(); });
}


/***
 * sha256
 *
 * test vectors for magic.alt.util.sha256()
 *
 */
function sha256(cont) {

  // path resolution is from parent directory
  const fp = readline.createInterface({ input: fs.createReadStream('./test/vectors/sha256.vec') });

  // https://csrc.nist.gov/projects/cryptographic-algorithm-validation-program/secure-hashing#sha-2
  let c = 0;
  fp.on('line', (line) => {
    c++;

    const sec = line.split(':');
    const m = Buffer.from(sec[0], 'hex');

    it('magic.alt.util.sha256 - Test Vector #' + c, (done) => {
      magic.alt.util.sha256(m, (err, out) => {
        if (err) { return done(err); }

        const t = out.hash;
        assert.equal(sec[1], t.toString('hex'));

        done();
      });
    });
  });

  fp.on('close', () => { cont(); });
}


/***
 * sha512
 *
 * test vectors for magic.alt.util.sha512()
 *
 */
function sha512(cont) {

  // path resolution is from parent directory
  const fp = readline.createInterface({ input: fs.createReadStream('./test/vectors/sha512.vec') });

  // https://csrc.nist.gov/projects/cryptographic-algorithm-validation-program/secure-hashing#sha-2
  let c = 0;
  fp.on('line', (line) => {
    c++;

    const sec = line.split(':');
    const m = Buffer.from(sec[0], 'hex');

    it('magic.alt.util.sha512 - Test Vector #' + c, (done) => {
      magic.alt.util.sha512(m, (err, out) => {
        if (err) { return done(err); }

        const t = out.hash;
        assert.equal(sec[1], t.toString('hex'));

        done();
      });
    });
  });

  fp.on('close', () => { cont(); });
}


/***
 * alt
 *
 * alt api test definer
 *
 */
function alt() {
  const fs = [ hmacsha256, hmacsha512, sha256, sha512 ];

  (function setup() {
    const f = fs.shift();
    if (!f) { return run(); }

    f(setup);
  })();
}


// TODO: Figure out why this describe doesn't print
describe('test vectors', () => {
  const apis = [ core, alt ];

  (function setup() {
    const api = apis.shift();
    if (!api) { return run(); }

    api(setup);
  })();
});