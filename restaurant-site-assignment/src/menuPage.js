import Page from "./Page";

const contentRoot = document.createElement('div');
contentRoot.id = 'content-root-home';
contentRoot.classList.add('content-root');

const menuHeader = document.createElement('div');
menuHeader.classList.add('segment');
menuHeader.innerHTML = "<h1>Menu</h1>";

contentRoot.appendChild(menuHeader);

const menuItems = [
    {
        item: 'Laffy Taffy Sandwich',
        price: 4.35,
        description: "Listen, folks, this is exactly what it sounds like, a sandwich chock full of your favorite flavor of Laffy Taffy. Comes with lettuce, tomato, onion, mayo, and your choice of fries or raw beets."
    },
    {
        item: 'Porridge Hoagie',
        price: 9.27,
        description: "Move over, sloppy joes, there's a new messiest sandwich in town, and it's name is the Porridge Hoagie. This drippy, drooly swamp of a sandwich will be enough to make you finally wear one of our classic bibs. (Bibs sold separately.)"
    },
    {
        item: "Rudy's Bib",
        price: 5,
        description: "We're famous for our bibs. They come in two hilarious colors. And trust us, with how completely, unreasonably messy our food is, you're gonna want one of these bad boys."
    }
];

const menuItemDivs = menuItems.map((item) => {
    const segment = document.createElement('div');
    segment.classList.add('segment');

    const itemName = document.createElement('h5');
    itemName.classList.add('item-name');
    itemName.textContent = item.item;
    segment.appendChild(itemName);

    const itemPrice = document.createElement('p');
    itemPrice.classList.add('item-price');
    itemPrice.textContent = "$"+item.price;
    segment.appendChild(itemPrice);

    const itemDescription = document.createElement('p');
    itemDescription.classList.add('item-description');
    itemDescription.textContent = item.description;
    segment.appendChild(itemDescription);

    return segment;
});

menuItemDivs.forEach((el) => {
    contentRoot.appendChild(el);
})

const menu = new Page(contentRoot);
export default menu;