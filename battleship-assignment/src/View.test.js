/**
 * @jest-environment jsdom
 */

import View from "./View.js";

it('View.giveDiv(args)/giveDiveWithID(args) returns the correct div', () => {
    const v = new View();

    const div1 = v.giveDiv(['notAButton', 'justADiv'], [ ['x', 4], ['y', 12] ]);
    
    expect(div1).not.toBeUndefined();
    expect(div1.classList.toString().split(' ')).toEqual([ 'notAButton', 'justADiv' ]);
    expect(div1.dataset.x).toBe('4');
    expect(div1.dataset.y).toBe('12');
    expect(div1.dataset.hit).toBe('false');

    const div2 = v.giveDivWithID('myDiv', ['justAGuy', 'andADiv'], [ ['x', 19], ['y', 2] ]);
    
    expect(div2).not.toBeUndefined();
    expect(div2.id).toBe('myDiv');
    expect(div2.classList.toString().split(' ')).toEqual([ 'justAGuy', 'andADiv' ]);
    expect(div2.dataset.x).toBe('19');
    expect(div2.dataset.y).toBe('2');
    expect(div2.dataset.hit).toBe('false');
});

it('View.makeGameboard() returns the correct dom arrangement', () => {
    const v = new View();

    const sizeXY = [20,20];
    const gb = v.makeGameboard(sizeXY);

    // Must account for NUMBER col / row;
    // 20 yRows + number row
    expect(gb.children.length).toBe(21);
    // Text random yRow children counts to check x-count + 1 for number column
    expect(gb.children[3].children.length).toBe(21);
    expect(gb.children[11].children.length).toBe(21);
    expect(gb.children[18].children.length).toBe(21);

    // Check for correct numbering row/col
    expect(gb.children[0].children[4].textContent).toBe('4') // top x roy
    expect(gb.children[0].children[12].textContent).toBe('12') 
    expect(gb.children[7].children[0].textContent).toBe('7') // left y col 
})