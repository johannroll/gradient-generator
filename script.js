
backgroundColor = document.querySelector('.container');
btn = document.querySelector('#btn');

const myList = document.createElement('ul');
const myListItem = document.createElement('li');

btn.addEventListener('click', function () {
    const randomR = Math.floor(Math.random()* 256);
    const randomG = Math.floor(Math.random()* 256);
    const randomB = Math.floor(Math.random()* 256);
    const randomA = Math.floor( Math.random()* 10) / 10;
    const randomR2 = Math.floor(Math.random()* 256);
    const randomG2 = Math.floor(Math.random()* 256);
    const randomB2 = Math.floor(Math.random()* 256);
    const randomA2 = Math.floor(Math.random()* 10) / 10;
    const randomR3 = Math.floor(Math.random()* 256);
    const randomG3 = Math.floor(Math.random()* 256);
    const randomB3 = Math.floor(Math.random()* 256);
    const randomA3 = Math.floor(Math.random()* 10) / 10;
    const randomR4 = Math.floor(Math.random()* 256);
    const randomG4 = Math.floor(Math.random()* 256);
    const randomB4 = Math.floor(Math.random()* 256);
    const randomA4 = Math.floor(Math.random()* 10) / 10;
    
    const randomPercentage = Math.floor( Math.random()* 101);
    const randomDeg = Math.floor( Math.random()* 361);
    
    const myGradients = ['linear-gradient', 'radial-gradient', 'conic-gradient', 'repeating-linear-gradient', 'repeating-radial-gradient'];
    let randomIndex = Math.floor(Math.random() * myGradients.length);
    const gradient = myGradients[randomIndex];
    
    myList.style.cssText = 'font-size: 0.825rem; font-weight: 800; list-style: none; text-transform: uppercase; border: 4px solid rgb(150, 150, 150); border-radius: 5px; box-shadow:  0 10px 15px rgba(5, 5, 5, 0.2);  padding: 0.5rem 0.5rem 1rem; display: flex; flex-direction: column; overflow: auto; max-width: 96%; background-color: black;  position: absolute; bottom: 20px';
    
    if (randomIndex === 1 || randomIndex === 4) {
        
        const details = backgroundColor.style.cssText = `background: ${gradient}(circle, rgba(${randomR}, ${randomB}, ${randomG}, ${randomA}) ${randomPercentage}%, rgba(${randomR2}, ${randomB2}, ${randomG2}, ${randomA2}) 100%)`;
        backgroundColor.insertAdjacentElement('beforeend', myList);
        myList.innerHTML = `<li style="text-align: left; color: #fff">${gradient}<button id="copy" style="outline: 0; border: 2 px solid black; padding: 0.3rem 0.3rem; margin-left: 0.5rem; color: aqua; opacity: 0.6; border-radius: 5px; box-shadow 0 0 5px 0.2; background: black; cursor: pointer">Copy CSS</button></li>
        <li id="CSS" style="font-family: monospace; color: rgb(240, 240, 240); text-transform: none; font-weight: 500; padding-top: 0.5rem; white-space: nowrap">${details};</li>`
        const btnCSS = document.querySelector('#copy');
        btnCSS.addEventListener('mouseenter', () => {
            btnCSS.style.cssText = 'border: none; padding: calc(0.3rem + 2px) calc(0.3rem + 2px); margin-left: 0.5rem; color: white; border-radius: 5px; box-shadow: 0 0 15px 5px rgb(200, 200, 200, 0.2); background: orange; cursor: pointer; transition: background 0.6s ease-in-out';
        });
        btnCSS.addEventListener('mouseleave', () => {
            btnCSS.style.cssText = 'outline: 0; border: 2 px solid black; padding: 0.3rem 0.3rem; margin-left: 0.5rem; color: aqua; opacity: 0.6; border-radius: 5px; box-shadow 0 0 5px 0.2; background: black; cursor: pointer';
        });
        btnCSS.addEventListener('click', copyInnerTextToClipboard);

        
        
    } else if (randomIndex === 2) { 
        
        const details = backgroundColor.style.cssText = `background: ${gradient}(rgba(${randomR}, ${randomB}, ${randomG}, ${randomA}), rgba(${randomR2}, ${randomB2}, ${randomG2}, ${randomA2}), rgba(${randomR3}, ${randomB3}, ${randomG3}, ${randomA3}), rgba(${randomR4}, ${randomB4}, ${randomG4}, ${randomA4}))`;
        backgroundColor.insertAdjacentElement('beforeend', myList);
        myList.innerHTML = `<li style="text-align: left; color: #fff">${gradient}<button id="copy" style="outline: 0; border: 2 px solid #fff; padding: 0.3rem 0.3rem; margin-left: 0.5rem; color: aqua; opacity: 0.6; border-radius: 5px; background: black; cursor: pointer">Copy CSS</button></li>
                            <li id="CSS" style="font-family: monospace; color: rgb(240, 240, 240); text-transform: none; font-weight: 500; padding-top: 0.5rem; padding-right: 0.5rem; white-space: nowrap">${details};</li>`
        const btnCSS = document.querySelector('#copy');
        btnCSS.addEventListener('mouseenter', () => {
            btnCSS.style.cssText = 'border: none; padding: calc(0.3rem + 2px) calc(0.3rem + 2px); margin-left: 0.5rem; color: white; border-radius: 5px; box-shadow: 0 0 15px 5px rgb(200, 200, 200, 0.2); background: orange; cursor: pointer; transition: background 0.6s ease-in-out';
        });
        btnCSS.addEventListener('mouseleave', () => {
            btnCSS.style.cssText = 'outline: 0; border: 2 px solid black; padding: 0.3rem 0.3rem; margin-left: 0.5rem; color: aqua; opacity: 0.6; border-radius: 5px; box-shadow 0 0 5px 0.2; background: black; cursor: pointer';
        });
        btnCSS.addEventListener('click', copyInnerTextToClipboard);

    } else {

        const details = backgroundColor.style.cssText = `background: ${gradient}(${randomDeg}deg, rgba(${randomR}, ${randomB}, ${randomG}, ${randomA}) ${randomPercentage}%, rgba(${randomR2}, ${randomB2}, ${randomG2}, ${randomA2}) 100%)`;
        backgroundColor.insertAdjacentElement('beforeend', myList);
        myList.innerHTML = `<li style="text-align: left; color: #fff">${gradient}<button id="copy" style="outline: 0; border: 2 px solid #fff; padding: 0.3rem 0.3rem; margin-left: 0.5rem; color: aqua; opacity: 0.6; border-radius: 5px; background: black; cursor: pointer">Copy CSS</button></li>
                            <li id="CSS" style="font-family: monospace; color: rgb(240, 240, 240); text-transform: none; font-weight: 500; padding-top: 0.5rem; white-space: nowrap">${details};</li>`
        const btnCSS = document.querySelector('#copy');
        btnCSS.addEventListener('mouseenter', () => {
            btnCSS.style.cssText = 'border: none; padding: calc(0.3rem + 2px) calc(0.3rem + 2px); margin-left: 0.5rem; color: white; border-radius: 5px; box-shadow: 0 0 15px 5px rgb(200, 200, 200, 0.2); background: orange; cursor: pointer; transition: background 0.6s ease-in-out';
        });
        btnCSS.addEventListener('mouseleave', () => {
            btnCSS.style.cssText = 'outline: 0; border: 2 px solid black; padding: 0.3rem 0.3rem; margin-left: 0.5rem; color: aqua; opacity: 0.6; border-radius: 5px; box-shadow 0 0 5px 0.2; background: black; cursor: pointer';
        });
        btnCSS.addEventListener('click', copyInnerTextToClipboard);   
    }
    console.log(gradient);
});

function copyInnerTextToClipboard() {
    
    const element = document.querySelector('#CSS');
    const textToCopy = element.innerText;
    console.log(textToCopy);
  
    const tempInput = document.createElement('textarea');
    tempInput.value = textToCopy;
    document.body.appendChild(tempInput);
  
    tempInput.select();
    document.execCommand('copy');
  
    document.body.removeChild(tempInput);
}
