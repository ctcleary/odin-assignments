import analyzeArray from "./analyzeArray";

it('analyzeArray function exists', () => {
    expect(analyzeArray).not.toBeUndefined();
});

it('analyzeArray returns an object with correct "average"', () => {
    expect(analyzeArray([1,2,3]).average).toBe(2);
    expect(analyzeArray([10,12,27]).average).toBeCloseTo(16.33);
});

it('analyzeArray returns an object with correct "min"', () => {
    expect(analyzeArray([1,24124,123515]).min).toBe(1);
    expect(analyzeArray([53,7,42,6,12345]).min).toBe(6);
})

it('analyzeArray returns an object with correct "max"', () => {
    expect(analyzeArray([1,4,64,124,4,2,60]).max).toBe(124);
    expect(analyzeArray([4321, 1, 23, 2145, 1242345]).max).toBe(1242345);
})

it('analyzeArray returns an object with correct "length"', () => {
    expect(analyzeArray([0,1,2,3,4,5]).length).toBe(6);
    expect(analyzeArray([123,432,789,567,321]).length).toBe(5);
})
