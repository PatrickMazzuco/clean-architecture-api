import crypto from 'node:crypto';

import { CryptoAdapter } from './crypto-adapter.service';

describe('Crypto Adapter', () => {
  it('should call node:crypto with correct value', async () => {
    const config: CryptoAdapter.Params = {
      iterations: 10000,
      keyLength: 64,
      digest: 'sha512'
    };

    const sut = new CryptoAdapter(config);
    const valueToEncrypt = 'any_value';

    const encryptSpy = jest.spyOn(crypto, 'pbkdf2');

    await sut.encrypt(valueToEncrypt);

    expect(encryptSpy).toBeCalledWith(
      valueToEncrypt,
      expect.any(String),
      config.iterations,
      config.keyLength,
      config.digest,
      expect.any(Function)
    );
  });
});
