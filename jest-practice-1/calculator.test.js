import calculator from "./calculator";

it('calculator object exists', () => {
    expect(calculator).not.toBeUndefined();
});

it('calculator.add functions correctly', () => {
    expect(calculator.add(2,3)).toBe(5);
    expect(calculator.add(7,3)).toBe(10);
});

it('calculator.subtract functions correctly', () => {
    expect(calculator.subtract(3,2)).toBe(1);
    expect(calculator.subtract(10,2)).toBe(8);
});

it('calculator.divide functions correctly', () => {
    expect(calculator.divide(10,5)).toBe(2);
    expect(calculator.divide(20,2)).toBe(10);
})

it('calculator.multiply functions correctly', () => {
    expect(calculator.multiply(2,3)).toBe(6);
    expect(calculator.multiply(3,5)).toBe(15);
})