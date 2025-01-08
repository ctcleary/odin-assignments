class Ciphers {
    constructor() {
        this.alphabet = [ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', ];
    }

    #isAlpha(char) {
        return this.alphabet.indexOf(char.toLowerCase()) !== -1;
    }

    #isUpperCase(char) {
        return char === char.toUpperCase();
    }

    caeserCipher(str) {
        let result = '';
        for (let i = 0; i < str.length; i++) {
            const char = str[i];
            if (this.#isAlpha(char)) {
                const charIdx = this.alphabet.indexOf(char.toLowerCase());
                let newCharIdx =  charIdx + 3;

                // if newCharIdx has looped past z, reset it to within the index.
                newCharIdx = newCharIdx <= 25 ? newCharIdx : newCharIdx - 26; 

                // Check if original char was uppercase, and return same if so.
                const newChar = this.#isUpperCase(char) ? this.alphabet[newCharIdx].toUpperCase() : this.alphabet[newCharIdx];

                result = result + newChar;
            } else {
                result = result + char;
            }
        }
        return result;
    }
};

export default Ciphers;
