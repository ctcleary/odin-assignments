import "./styles.css";



const carousel = (function() {
    const imgAssetPath = './img/';
    const imgWidthRem = 36;
    const imgTransitionStr = 'left 250ms linear';
    const imagesWide = document.getElementById('images-wide');
    
    const numPictures = 10;
    
    // Append the last image first for looping
    appendImageChild(numPictures);
    
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
    
    for (let i = 1; i <= numPictures; i++) {
        appendImageChild(i);
    }
    // Append the first image last for looping
    appendImageChild(1);
    
    // Since we have the last img appended first, start at -{imgWidthRem}
    imagesWide.style.left = `-${imgWidthRem}rem`;
    
    // Since we need to remove the transition during looping repositioning
    imagesWide.style.transition = imgTransitionStr;
    
    const leftArrow = document.getElementById('arrow-left');
    const rightArrow = document.getElementById('arrow-right');

    function changeSlideRight() {
        const currLeftStr = imagesWide.style.left;
        const currLeft = parseInt(currLeftStr);
    
        const newLeft = currLeft - imgWidthRem;
        
        console.log('changeSlideRight newLeft', newLeft);
        imagesWide.style.left = `${newLeft}rem`;
    }

    function changeSlideLeft() {
        const currLeftStr = imagesWide.style.left;
        const currLeft = parseInt(currLeftStr);
    
        const newLeft = currLeft + imgWidthRem;

        console.log('changeSlideLeft newLeft', newLeft);
        imagesWide.style.left = `${newLeft}rem`;
    }

    function loopIfShould(e) {
        const currLeft = parseInt(e.target.style.left, 10);
        if (currLeft === 0) {
            console.log('should loop from start-1')
            imagesWide.style.transition = '';
            imagesWide.style = `left: ${-imgWidthRem * (numPictures)}rem;`
            setTimeout(() => {
                imagesWide.style.transition = imgTransitionStr;
            }, 0);

        } else if (currLeft === (-imgWidthRem * (numPictures + 1))) {
            console.log('should loop from end');
            imagesWide.style.transition = '';
            imagesWide.style.left = `-${imgWidthRem}em`
            setTimeout(() => {
                imagesWide.style.transition = imgTransitionStr;
            }, 0);
        }
    }
    
    imagesWide.addEventListener('transitionend', (e) => {
        loopIfShould(e);
    })

    rightArrow.addEventListener('click', () => {
        changeSlideRight();
    })
    leftArrow.addEventListener('click', () => {
        changeSlideLeft();
    })

    return {
        changeSlideLeft,
        changeSlideRight
    }
})();

