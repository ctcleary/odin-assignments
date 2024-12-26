import "./styles.css";

const imgAssetPath = './img/';
const imgWidthRem = 36;
const imagesWide = document.getElementById('images-wide');

// appendImageChild(10);

function appendImageChild(picNum) {
    const containerDiv = document.createElement('div');
    containerDiv.classList.add('image-container');

    const img = document.createElement('img');
    img.classList.add('carousel-image');
    img.src = `${imgAssetPath}gordon${picNum}.jpg`;
    img.dataset.picNumber = picNum;

    containerDiv.appendChild(img);
    imagesWide.appendChild(containerDiv);
}

for (let i = 1; i <= 10; i++) {
    appendImageChild(i);
}
// appendImageChild(1);

imagesWide.style = 'left:0rem;';

const leftArrow = document.getElementById('arrow-left');
const rightArrow = document.getElementById('arrow-right');

const carousel = (function() {

})();

function changeSlideRight() {
    const currLeftStr = imagesWide.style.left;
    const currLeft = parseInt(currLeftStr);
    console.log('currLeft', currLeft);

    const newLeft = currLeft - imgWidthRem;
    if (newLeft === (-36 * 10)) {
        imagesWide.style = `left: 0rem;`
    } else {
        imagesWide.style = `left: ${newLeft}rem;`;
    }
}
function changeSlideLeft() {
    const currLeftStr = imagesWide.style.left;
    const currLeft = parseInt(currLeftStr);
    console.log('currLeft', currLeft);

    const newLeft = currLeft + imgWidthRem;
    if (newLeft === 36) {
        imagesWide.style = `left: ${-36 * 9}rem;`
    } else {
        imagesWide.style = `left: ${newLeft}rem;`;
    }
    
    
    // if (computedLeft === '-36rem') {
    //     imagesWide.style = 'left:0rem;';
    // }
}

rightArrow.addEventListener('click', () => {
    changeSlideRight();
})
leftArrow.addEventListener('click', () => {
    changeSlideLeft();
})