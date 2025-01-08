import { string } from "yargs";
import stringTransforms from "./stringTransforms";

const st = stringTransforms;

it('stringTransforms parent object exists', () => {
    expect(stringTransforms).not.toBeUndefined();
});

it('capitalize functions correctly', () => {
    expect(st.capitalize('colorado')).toBe('Colorado');
});

it('reverseString functions correctly', () => {
    expect(st.reverseString('abcdef')).toBe('fedcba');
});
