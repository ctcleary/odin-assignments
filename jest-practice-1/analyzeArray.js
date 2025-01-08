const calcSum = (numArr) => {
    let result = 0;
    for (let i = 0; i < numArr.length; i++) {
        const num = numArr[i];
        result = result + num;
    }
    return result;
}
const calcAverage = (numArr) => {
    const sum = calcSum(numArr);

    return sum / numArr.length;
}

const getMin = (numArr) => {
    let result = Infinity;
    for (let i = 0; i < numArr.length; i++) {
        if (numArr[i] < result) {
            result = numArr[i];
        }
    }
    return result;
}

const getMax = (numArr) => {
    let result = -Infinity;
    for (let i = 0; i < numArr.length; i++) {
        if(numArr[i] > result) {
            result = numArr[i];
        }
    }
    return result;
}

const analyzeArray = (numArr) => {
    const average = calcAverage(numArr);
    const min = getMin(numArr);
    const max = getMax(numArr);

    return {
        average: average,
        min: min,
        max: max,
        length: numArr.length,
    }
};

export default analyzeArray;
