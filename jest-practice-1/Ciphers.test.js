import Ciphers from "./Ciphers";

const ciphers = new Ciphers();

it('ciphers object exists', () => {
    expect(ciphers).not.toBeUndefined();
});

it('ciphers.caeserCipher function exists', () => {
    expect(ciphers.caeserCipher).not.toBeUndefined();
});

it('caeserCipher functions correctly on alpha strings', () => {
    expect(ciphers.caeserCipher('abc')).toBe('def');
    expect(ciphers.caeserCipher('xyz')).toBe('abc');
})

it('caeserCipher returns non-alpha characters unmodified', () => {
    expect(ciphers.caeserCipher('x.f')).toBe('a.i');
    expect(ciphers.caeserCipher('___a___')).toBe('___d___');
    expect(ciphers.caeserCipher('hello, world!')).toBe('khoor, zruog!');
});

it('caeserCipher preserves character case', () => {
    expect(ciphers.caeserCipher('AbC')).toBe('DeF');
    expect(ciphers.caeserCipher('Hello, World!')).toBe('Khoor, Zruog!');
});