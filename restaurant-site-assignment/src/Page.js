
class Page {
    content = document.createElement('div');

    constructor(providedContents) {
        // this.contentEl = contentEl;

        if (providedContents) {
            this.content.appendChild(providedContents);
        } else {
            const tempContent = document.createElement('h1');
            tempContent.innerText = 'Temporary Content';
            this.content.appendChild(tempContent);
        }
    }

    render = (contentEl) => {
        contentEl.innerHTML = '';
        contentEl.appendChild(this.content);
    }
}



export default Page;
