const stringTransforms = {
    capitalize: (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    },
    reverseString: (str) => {
        const charArr = str.split('');
        charArr.reverse();
        return charArr.join('');
    },
    
}

export default stringTransforms;