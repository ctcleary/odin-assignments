import "./styles.css";



const carousel = (function() {
    const imgAssetPath = './img/';
    const imgWidthRem = 36;
    const imgTransitionStr = 'left 250ms linear';

    const imagesWide = document.getElementById('images-wide');
    const leftArrow = document.getElementById('arrow-left');
    const rightArrow = document.getElementById('arrow-right');
    const navDots = document.getElementById('nav-dots');
    
    const numPictures = 10;
    let activePicNum = 1;
    let transitionTimeout;
    
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

    function appendNavDot(picNum) {
        const dotOuter = document.createElement('div');
        dotOuter.classList.add('nav-dot-outer');
        dotOuter.dataset.relatedImage = picNum;

        dotOuter.addEventListener('click', (e) => {
            goToSlide(picNum);
            highlightActiveDot(picNum);
        })

        const dot = document.createElement('div');
        dot.classList.add('nav-dot');

        dotOuter.appendChild(dot);

        navDots.appendChild(dotOuter);

    }
    
    for (let i = 1; i <= numPictures; i++) {
        appendImageChild(i);
        appendNavDot(i);
    }
    // Append the first image last for looping
    appendImageChild(1);
    highlightActiveDot();
    
    // Since we have the last img appended first, start at -{imgWidthRem}
    imagesWide.style.left = `-${imgWidthRem}rem`;
    
    // Since we need to remove the transition during looping repositioning
    imagesWide.style.transition = imgTransitionStr;
    

    function changeSlideRight() {
        const currLeftStr = imagesWide.style.left;
        const currLeft = parseInt(currLeftStr);
    
        const newLeft = currLeft - imgWidthRem;
        imagesWide.style.left = `${newLeft}rem`;

        activePicNum += 1;
    }

    function changeSlideLeft() {
        const currLeftStr = imagesWide.style.left;
        const currLeft = parseInt(currLeftStr);
    
        const newLeft = currLeft + imgWidthRem;
        imagesWide.style.left = `${newLeft}rem`;

        activePicNum -= 1;
    }

    function goToSlide(picNum) {
        imagesWide.style.transition = '';
        imagesWide.style.left = `${-36 * picNum}rem`;
        setTimeout(() => {
            imagesWide.style.transition = imgTransitionStr;
        }, 0);

        activePicNum = picNum;
        
        startTransitionTimer();
    }

    function highlightActiveDot() {
        const dots = document.querySelectorAll('.nav-dot-outer');
        dots.forEach((dot) => {
            dot.classList.remove('active-dot');
        })

        console.log(dots);

        const newActiveDot = Array.from(dots).find((dot) => {
            return parseInt(dot.dataset.relatedImage, 10) === activePicNum;
        })

        newActiveDot.classList.add('active-dot');
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

            activePicNum = numPictures;

        } else if (currLeft === (-imgWidthRem * (numPictures + 1))) {
            console.log('should loop from end');
            imagesWide.style.transition = '';
            imagesWide.style.left = `-${imgWidthRem}em`
            setTimeout(() => {
                imagesWide.style.transition = imgTransitionStr;
            }, 0);

            activePicNum = 1;
        }
    }

    function startTransitionTimer() {
        clearTimeout(transitionTimeout);

        transitionTimeout = setTimeout(() => {
            changeSlideRight();
        }, 5000)
    }
    
    imagesWide.addEventListener('transitionend', (e) => {
        loopIfShould(e);
        highlightActiveDot();
        startTransitionTimer();
    })

    rightArrow.addEventListener('click', () => {
        changeSlideRight();
    })
    leftArrow.addEventListener('click', () => {
        changeSlideLeft();
    })

    startTransitionTimer();

    return {
        changeSlideLeft,
        changeSlideRight
    }
})();

