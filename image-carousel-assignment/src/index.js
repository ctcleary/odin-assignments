import "./styles.css";

const imgAssetPath = './img/';

const imagesWide = document.getElementById('images-wide');

function appendImageChild(picNum) {
    const containerDiv = document.createElement('div');
    containerDiv.classList.add('image-container');

    const img = document.createElement('img');
    img.classList.add('carousel-image');
    img.src = `${imgAssetPath}gordon${picNum}.jpg`;

    containerDiv.appendChild(img);
    imagesWide.appendChild(containerDiv);
}

for (let i = 1; i <= 10; i++) {
    appendImageChild(i);
}
appendImageChild(1);