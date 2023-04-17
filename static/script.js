
const inputElements = document.querySelectorAll('input, textarea');
inputElements.forEach(inputElement => {
  inputElement.addEventListener('touchstart', (event) => {
    event.stopPropagation();
  });
});

document.querySelector('input[type="file"]').onchange = function() {
    const parent = document.querySelector('form[action="#"]');
    const oldfileDiv = document.querySelector('.fileName');
    console.log(oldfileDiv);
    const fileDiv = document.createElement('div');
    while (parent.lastChild.className === 'fileName')  {
        parent.removeChild(parent.lastChild);
    }
    fileDiv.className = 'fileName';
    fileDiv.innerText = this.value;
    fileDiv.style.cssText = "margin-top: 0.5rem";
    document.querySelector('form').appendChild(fileDiv);
}

function isTouchDevice() {
  return ('ontouchstart' in window || navigator.maxTouchPoints);
}

// Show pop-up on mouseover for desktop, tap for mobile
document.querySelector('.info-icon').addEventListener('mouseover', function() {
  if (!isTouchDevice()) {
    document.querySelector('.info-box').style.display = 'block';
  }
});

document.querySelector('.info-icon').addEventListener('click', function() {
  if (isTouchDevice()) {
    document.querySelector('.info-box').style.display = 'block';
  }
});

// Hide pop-up on mouseout for desktop, tap outside for mobile
document.addEventListener('mouseout', function(event) {
  if (!event.relatedTarget || (event.relatedTarget && event.relatedTarget.className !== 'info-box')) {
    document.querySelector('.info-box').style.display = 'none';
  }
});

document.addEventListener('click', function(event) {
  if (isTouchDevice() && event.target.className !== 'info-icon' && event.target.className !== 'info-box') {
    document.querySelector('.info-box').style.display = 'none';
  }
});


const buildPalette = (colorsList) => {
    const paletteContainer = document.getElementById("palette");
    const complementaryContainer = document.getElementById("complementary");
    // reset the HTML in case you load various images
    paletteContainer.innerHTML = "";
    complementaryContainer.innerHTML = "";
  
    const orderedByColor = orderByLuminance(colorsList);
    const hslColors = convertRGBtoHSL(orderedByColor);
    let hexObj = {};
    let hexComplementaryObj = {};
    for (let i = 0; i < orderedByColor.length; i++) {
      const hexColor = rgbToHex(orderedByColor[i]);
      
  
      const hexColorComplementary = hslToHex(hslColors[i]);
  
      if (i > 0) {
        const difference = calculateColorDifference(
          orderedByColor[i],
          orderedByColor[i - 1]
        );
  
        // if the distance is less than 120 we ommit that color
        if (difference < 120) {
          continue;
        }
      }
  
      // create the div and text elements for both colors & append it to the document
      const colorElement = document.createElement("div");
      colorElement.style.backgroundColor = hexColor;
      
      colorElement.appendChild(document.createTextNode(hexColor));
      colorElement.onclick = () => {
        const textToCopy = colorElement.firstChild.nodeValue;
        console.log(textToCopy);
        const tempInput = document.createElement('textarea');
        tempInput.value = textToCopy;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
      }
      paletteContainer.appendChild(colorElement);

      // true when hsl color is not black/white/grey
      if (hslColors[i].h) {
        const complementaryElement = document.createElement("div");
        complementaryElement.style.backgroundColor = `hsl(${hslColors[i].h},${hslColors[i].s}%,${hslColors[i].l}%)`;
  
        complementaryElement.appendChild(
          document.createTextNode(hexColorComplementary)
        );
        complementaryElement.onclick = () => {
            const textToCopy = complementaryElement.firstChild.nodeValue;
            console.log(textToCopy);
            const tempInput = document.createElement('textarea');
            tempInput.value = textToCopy;
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand('copy');
            document.body.removeChild(tempInput);
          }
        complementaryContainer.appendChild(complementaryElement);
      }
      
      hexObj[`color${[i]}`] = hexColor;
      hexComplementaryObj[`color${[i]}`] = hexColorComplementary;
    }
    const arr1 = Object.values(hexObj);
    const arr2 = Object.values(hexComplementaryObj);
    const mergedArray = arr1.concat(arr2);
    randomGradient(mergedArray);
  };
  
  //  Convert each pixel value ( number ) to hexadecimal ( string ) with base 16
  const rgbToHex = (pixel) => {
    const componentToHex = (c) => {
      const hex = c.toString(16);
      return hex.length == 1 ? "0" + hex : hex;
    };
  
    return (
      "#" +
      componentToHex(pixel.r) +
      componentToHex(pixel.g) +
      componentToHex(pixel.b)
    ).toUpperCase();
  };
  
  /**
   * Convert HSL to Hex
   * this entire formula can be found in stackoverflow, credits to @icl7126 !!!
   * https://stackoverflow.com/a/44134328/17150245
   */
  const hslToHex = (hslColor) => {
    const hslColorCopy = { ...hslColor };
    hslColorCopy.l /= 100;
    const a =
      (hslColorCopy.s * Math.min(hslColorCopy.l, 1 - hslColorCopy.l)) / 100;
    const f = (n) => {
      const k = (n + hslColorCopy.h / 30) % 12;
      const color = hslColorCopy.l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color)
        .toString(16)
        .padStart(2, "0");
    };
    return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
  };
  
  /**
   * Convert RGB values to HSL
   * This formula can be
   * found here https://www.niwa.nu/2013/05/math-behind-colorspace-conversions-rgb-hsl/
   */
  const convertRGBtoHSL = (rgbValues) => {
    return rgbValues.map((pixel) => {
      let hue,
        saturation,
        luminance = 0;
  
      // first change range from 0-255 to 0 - 1
      let redOpposite = pixel.r / 255;
      let greenOpposite = pixel.g / 255;
      let blueOpposite = pixel.b / 255;
  
      const Cmax = Math.max(redOpposite, greenOpposite, blueOpposite);
      const Cmin = Math.min(redOpposite, greenOpposite, blueOpposite);
  
      const difference = Cmax - Cmin;
  
      luminance = (Cmax + Cmin) / 2.0;
  
      if (luminance <= 0.5) {
        saturation = difference / (Cmax + Cmin);
      } else if (luminance >= 0.5) {
        saturation = difference / (2.0 - Cmax - Cmin);
      }
  
      /**
       * If Red is max, then Hue = (G-B)/(max-min)
       * If Green is max, then Hue = 2.0 + (B-R)/(max-min)
       * If Blue is max, then Hue = 4.0 + (R-G)/(max-min)
       */
      const maxColorValue = Math.max(pixel.r, pixel.g, pixel.b);
  
      if (maxColorValue === pixel.r) {
        hue = (greenOpposite - blueOpposite) / difference;
      } else if (maxColorValue === pixel.g) {
        hue = 2.0 + (blueOpposite - redOpposite) / difference;
      } else {
        hue = 4.0 + (greenOpposite - blueOpposite) / difference;
      }
  
      hue = hue * 60; // find the sector of 60 degrees to which the color belongs
  
      // it should be always a positive angle
      if (hue < 0) {
        hue = hue + 360;
      }
  
      // When all three of R, G and B are equal, we get a neutral color: white, grey or black.
      if (difference === 0) {
        return false;
      }
  
      return {
        h: Math.round(hue) + 180, // plus 180 degrees because that is the complementary color
        s: parseFloat(saturation * 100).toFixed(2),
        l: parseFloat(luminance * 100).toFixed(2),
      };
    });
  };
  
  /**
   * Using relative luminance we order the brightness of the colors
   * the fixed values and further explanation about this topic
   * can be found here -> https://en.wikipedia.org/wiki/Luma_(video)
   */
  const orderByLuminance = (rgbValues) => {
    const calculateLuminance = (p) => {
      return 0.2126 * p.r + 0.7152 * p.g + 0.0722 * p.b;
    };
  
    return rgbValues.sort((p1, p2) => {
      return calculateLuminance(p2) - calculateLuminance(p1);
    });
  };
  
  const buildRgb = (imageData) => {
    const rgbValues = [];
    // note that we are loopin every 4!
    // for every Red, Green, Blue and Alpha
    for (let i = 0; i < imageData.length; i += 4) {
      const rgb = {
        r: imageData[i],
        g: imageData[i + 1],
        b: imageData[i + 2],
      };
  
      rgbValues.push(rgb);
    }
  
    return rgbValues;
  };
  
  /**
   * Calculate the color distance or difference between 2 colors
   *
   * further explanation of this topic
   * can be found here -> https://en.wikipedia.org/wiki/Euclidean_distance
   * note: this method is not accuarate for better results use Delta-E distance metric.
   */
  const calculateColorDifference = (color1, color2) => {
    const rDifference = Math.pow(color2.r - color1.r, 2);
    const gDifference = Math.pow(color2.g - color1.g, 2);
    const bDifference = Math.pow(color2.b - color1.b, 2);
  
    return rDifference + gDifference + bDifference;
  };
  
  // returns what color channel has the biggest difference
  const findBiggestColorRange = (rgbValues) => {
    /**
     * Min is initialized to the maximum value posible
     * from there we procced to find the minimum value for that color channel
     *
     * Max is initialized to the minimum value posible
     * from there we procced to fin the maximum value for that color channel
     */
    let rMin = Number.MAX_VALUE;
    let gMin = Number.MAX_VALUE;
    let bMin = Number.MAX_VALUE;
  
    let rMax = Number.MIN_VALUE;
    let gMax = Number.MIN_VALUE;
    let bMax = Number.MIN_VALUE;
  
    rgbValues.forEach((pixel) => {
      rMin = Math.min(rMin, pixel.r);
      gMin = Math.min(gMin, pixel.g);
      bMin = Math.min(bMin, pixel.b);
  
      rMax = Math.max(rMax, pixel.r);
      gMax = Math.max(gMax, pixel.g);
      bMax = Math.max(bMax, pixel.b);
    });
  
    const rRange = rMax - rMin;
    const gRange = gMax - gMin;
    const bRange = bMax - bMin;
  
    // determine which color has the biggest difference
    const biggestRange = Math.max(rRange, gRange, bRange);
    if (biggestRange === rRange) {
      return "r";
    } else if (biggestRange === gRange) {
      return "g";
    } else {
      return "b";
    }
  };
  
  /**
   * Median cut implementation
   * can be found here -> https://en.wikipedia.org/wiki/Median_cut
   */
  const quantization = (rgbValues, depth) => {
    const MAX_DEPTH = 4;
  
    // Base case
    if (depth === MAX_DEPTH || rgbValues.length === 0) {
      const color = rgbValues.reduce(
        (prev, curr) => {
          prev.r += curr.r;
          prev.g += curr.g;
          prev.b += curr.b;
  
          return prev;
        },
        {
          r: 0,
          g: 0,
          b: 0,
        }
      );
  
      color.r = Math.round(color.r / rgbValues.length);
      color.g = Math.round(color.g / rgbValues.length);
      color.b = Math.round(color.b / rgbValues.length);
  
      return [color];
    }
  
    /**
     *  Recursively do the following:
     *  1. Find the pixel channel (red,green or blue) with biggest difference/range
     *  2. Order by this channel
     *  3. Divide in half the rgb colors list
     *  4. Repeat process again, until desired depth or base case
     */
    const componentToSortBy = findBiggestColorRange(rgbValues);
    rgbValues.sort((p1, p2) => {
      return p1[componentToSortBy] - p2[componentToSortBy];
    });
  
    const mid = rgbValues.length / 2;
    return [
      ...quantization(rgbValues.slice(0, mid), depth + 1),
      ...quantization(rgbValues.slice(mid + 1), depth + 1),
    ];
  };
  
  const main = () => {
    const imgFile = document.getElementById("file-input");
    const image = new Image();
    const file = imgFile.files[0];
    const fileReader = new FileReader();
  
    // Whenever file & image is loaded procced to extract the information from the image
    fileReader.onload = () => {
      image.onload = () => {
        // Set the canvas size to be the same as of the uploaded image
        const canvas = document.getElementById("canvas");
        canvas.style.cssText = "box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2)";
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0);
  
        /**
         * getImageData returns an array full of RGBA values
         * each pixel consists of four values: the red value of the colour, the green, the blue and the alpha
         * (transparency). For array value consistency reasons,
         * the alpha is not from 0 to 1 like it is in the RGBA of CSS, but from 0 to 255.
         */
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  
        // Convert the image data to RGB values so its much simpler
        const rgbArray = buildRgb(imageData.data);
  
        /**
         * Color quantization
         * A process that reduces the number of colors used in an image
         * while trying to visually maintin the original image as much as possible
         */
        const quantColors = quantization(rgbArray, 0);
  
        // Create the HTML structure to show the color palette
        buildPalette(quantColors);
      };
      image.src = fileReader.result;
    };
    fileReader.readAsDataURL(file);
  };
  
  function loadClick () {
    const grid = document.querySelector('.imageMatch-grid');
    const form = document.querySelector('form[action="#"]');
    const loading = document.querySelector('#btnLoad');
    const spinner = document.createElement('div');
    spinner.classList.add('loader');
    form.insertAdjacentElement("afterend", spinner);

    // spinner.value = 'Loading...';
    loading.value = 'loading...';
    setTimeout( () => {
      loading.value = 'Load';
      grid.removeChild(spinner);
      document.querySelector('.imageSize').style.cssText = 'height: auto';
      document.querySelector('#canvas').style.cssText = 'height: auto';
    }, 1000);
    
    main();
    gradients();
    // randomGradient();
    
  }

const userInput = document.querySelector('#input-search');
const colorFormat = document.querySelector('#colorCode');

const maxMatches = 50;

// Get the input field
const input = document.querySelector("#all-colors");

// Attach an event listener to the input field

// Call the API to retrieve the suggestions array
// Here's an example using the fetch API:
fetch(`https://api.color.pizza/v1/`)
.then(response => response.json())
.then(suggestions => {
    const pizzacolors = suggestions.colors;
    const colorArray = [];

    for (const   {name, hex}  of pizzacolors) {
        colorArray.push(name,hex);
    }
   
    const suggestionList = document.createElement("ul");
    suggestionList.style.cssText = "position: absolute; display: flex; flex-direction: column; list-style: none; ;background: rgb(75, 88, 91); margin-bottom: 0.5rem; z-index: 999; max-height:200px; min-width: 251.45px; overflow: auto; border: 1px solid #fff; padding: 0rem 0.6rem 0rem 0.5rem; box-shadow: 0 0 5px 5px rgba(0, 0, 0, 0.2)";
    
    input.addEventListener("input", function() {
    suggestionList.innerHTML = "";
      // Get the user's entered text"
      const enteredText = input.value.toLowerCase();
      const filteredColors = colorArray.filter(color => color.startsWith(enteredText));

      
      // Filter the array of suggestions to find only those that match the entered text
      
      let matchingSuggestions = colorArray.filter(function(pizzaColor) {
          return pizzaColor.toLowerCase().startsWith(enteredText.toLowerCase());
        });
        
        
        
        // Limit the number of matches to the specified maximum
        matchingSuggestions = matchingSuggestions.slice(0, maxMatches);
        
        // Create a list of suggested matches
        matchingSuggestions.forEach(function(match) {
            
            const listItem = document.createElement("li");
            const text = document.createTextNode(match);
            const hexIndex = colorArray.indexOf(match) + 1;
            console.log(`Index: ${hexIndex}`);
            const hexValue = colorArray[hexIndex];
            console.log(`Value: ${hexValue}`);
            const colorBox = document.createElement("button");
            colorBox.classList.add("color-name-button");
            colorBox.setAttribute("value", hexValue);
            colorBox.addEventListener("click", () => { 
                userInput.value = colorBox.value.substring(1);
                colorFormat.value = "hex";
                getColor();
                gradients();
                input.parentNode.removeChild(suggestionList);
            });
            console.log(`Button: ${colorBox.value}`);
            listItem.appendChild(text);
            listItem.style.cssText = "padding: 1rem 0rem; position : relative;";
            colorBox.style.cssText = `display: inline-block; position: absolute ; top: 50%; transform: translateY(-50%); right: 0; min-height: 40px; min-width: 55px; background: ${hexValue}; border-radius: 6px; box-shadow: 0 5px 5px rgba(0, 0, 0, 0.2); cursor: pointer`;
            listItem.appendChild(colorBox);
            suggestionList.appendChild(listItem);
        });
        
        // Display the list of suggested matches to the user
        const parent = document.querySelector(".color-name-wrapper");
        
        if (enteredText != "") {
            input.parentNode.appendChild(suggestionList);
        } else {
            input.parentNode.removeChild(suggestionList);
        }
      
    })
    // .catch(error => console.error(error));
});



setInterval(() => {

    if (colorFormat.value === 'hex') { 
        userInput.placeholder = "40464d"
    } else if (colorFormat.value === 'rgb') {
        userInput.placeholder = "0,71,171"
    } else if (colorFormat.value === 'rgba') {
        userInput.placeholder = "0,71,171,0.6,255,255,45"
    } else if (colorFormat.value === 'cmyk') {
        userInput.placeholder = "100,58,0,33"
    } else if (colorFormat.value === 'hsl') {
        userInput.placeholder = "215,100%,34%";
    } else if (colorFormat.value === 'name') {
        userInput.placeholder = "color name";
    }
          
},100);

colorFormat.addEventListener('change', function () {
    userInput.value = "";
});
    

const btnSearch = document.querySelector('#btn-search');
const colors = document.querySelector('.colors');

btnSearch.addEventListener('click', function () {
    getColor();
    gradients();
    const palleteAdd = btnSearch;
});

function getColor() {
    while (colors.firstChild) {
        colors.removeChild(colors.firstChild);
    }
    console.log(colorFormat.value);
    if (colorFormat.value === 'rgba') {
        const arr = userInput.value.split(',');
        const r = Math.round(((1 - arr[3]) * arr[4]) + (arr[3] * arr[0]))
        const g = Math.round(((1 - arr[3]) * arr[5]) + (arr[3] * arr[1]))
        const b = Math.round(((1 - arr[3]) * arr[6]) + (arr[3] * arr[2]))
        userInput.value = r + ',' + g + ',' + b
        colorFormat.value = 'rgb';
        console.log(arr);
    } else if (colorFormat.value === 'hex') {
        if (userInput.value.length === 7) {
            userInput.value = userInput.value.substring(1, 7);
            console.log(userInput.value);
        }
    }
    const colorCode = colorFormat.value;
    const colorValue = userInput.value;
    // Build the URL for the API request
    if (colorCode === 'colorname') {
        fetch(`https://api.color.pizza/v1/?values=${colorValue}`)
        .then(response => response.json())
        .then(data => {
        console.log(data);
    })
    }
    const url = `https://www.thecolorapi.com/scheme?${colorCode}=${colorValue}&mode=analogic-complement&count=6`;
    // btnSearch.disabled = true;

    // Make the API request using fetch()
    fetch(url)
    .then(response => response.json())
    .then(data => {
           
    // .catch(error => {
    // // Handle any errors here
    // console.error(error);
    // });
    // Handle the response data here
    const colorSearch = data;
        
    
    const compColors = data.colors;
    console.log(compColors);
    console.log(colorSearch);
    console.log(data);

    
    const divColor = document.createElement('div');
    const divPalette = document.createElement('div');
    const iconWrapper = document.createElement('div');
    const icon = document.createElement('div');
    const btnPalette = document.createElement('button');
    const schemaSelect = document.createElement('select');
    const labelDiv = document.createElement('div');
    const schemaLabel = document.createElement('label');
    
    iconWrapper.classList.add('info-icon');
    icon.classList.add('info-box');
    schemaLabel.classList.add('schema-list');
    btnPalette.classList.add('btn-palette');
    
    colors.insertAdjacentElement("beforeend", divColor);
    colors.style.cssText = 'display: flex; flex-direction: column; width: 100%; max-width: 1200px; margin: 0 auto; align-items: center';
    
    divColor.style.cssText = `padding: 4rem; background: ${colorSearch.seed.hex.value}; margin: 1rem 1rem 1.5rem; border-radius: 6px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.2); width: 100%; cursor: pointer`;
    divColor.innerHTML= ` 
    <p style="text-align: center">${colorSearch.seed[colorCode].value}</p>`;
    divColor.onclick = () => {
      const textToCopy = divColor.innerText;
      console.log(textToCopy);
      const tempInput = document.createElement('textarea');
      tempInput.value = textToCopy;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand('copy');
      document.body.removeChild(tempInput);
    }
    
    divColor.insertAdjacentElement("afterend",schemaSelect);
    divColor.insertAdjacentElement("afterend",labelDiv);
    
    labelDiv.appendChild(iconWrapper);
    labelDiv.appendChild(schemaLabel);
    
    iconWrapper.innerText = "i";
    iconWrapper.style.cssText = 'display: inline-block; position: relative';
    
    
    iconWrapper.insertAdjacentElement("afterbegin", icon);
    icon.innerText = "Select the color code format to search."
    icon.style.cssText = 'min-width: 200px';
    icon.onmouseenter = function () {
      isTouchDevice();
    }   
    
    schemaSelect.innerHTML= '<option value="default" disabled selected>Choose Color Schema</option><option value="complement">Complement</option><option value="analogic-complement">Analogic-complement</option><option value="analogic">Analogic</option><option value="triad">Triad</option><option value="quad">Quad</option><option value="monochrome">Monochrome</option><option value="monochrome-dark">Monochrome-dark</option><option value="monochrome-light">Monochrome-light</option>';
    schemaLabel.innerText = 'Color Schema: ';
    btnPalette.innerText = 'Generate Palette';
    btnPalette.style.cssText = 'padding: 0.5rem 0.8rem; background: none;border-radius: 5px;color: #fff; border: 2px solid #fff; align-self: center; max-width: 200px; margin-bottom: 1.5rem';
    btnPalette.addEventListener('mouseenter', () => {
        btnPalette.style.cssText = 'padding: calc(0.5rem) calc(0.8rem); border: 2px solid orange; color: #fff; border-radius: 5px; background: orange; cursor: pointer; transition: background 0.6s ease-in-out; max-width: 200px; align-self: center; margin-bottom: 1.5rem';
    });
    btnPalette.addEventListener('mouseleave', () => {
        btnPalette.style.cssText = 'border: 2px solid #fff; padding: 0.5rem 0.8rem; color: white; border-radius: 5px; background: none; cursor: pointer; max-width: 200px; align-self: center; ';
    });

    schemaSelect.style.cssText = ' padding: 0.4rem 1rem; background: none;border-radius: 5px;color: #fff; border: 2px solid #fff; align-self: center; max-width: 200px; margin-bottom: 0.5rem; margin-top: 0.2rem; outline: none';
    schemaSelect.addEventListener('mouseenter', () => {
        schemaSelect.style.cssText = 'padding: calc(0.4rem) calc(1rem); border: 2px solid orange; color: #fff; border-radius: 5px; background: orange; cursor: pointer; transition: background 0.6s ease-in-out; max-width: 200px; align-self: center; margin-bottom: 0.5rem; margin-top: 0.2rem; outline: none';
    });
    schemaSelect.addEventListener('mouseleave', () => {
        schemaSelect.style.cssText = 'border: 2px solid #fff; padding: 0.4rem 1rem; color: white; border-radius: 5px; background: none; cursor: pointer; max-width: 200px; align-self: center; margin-bottom: 0.5rem; margin-top: 0.2rem; outline: none';
    });

    schemaLabel.style.cssText = 'padding: 0.4rem 1rem; background: none;border-radius: 5px;color: #fff; align-self: center; max-width: 200px';
    
    const divsComp = document.createElement('div');
    divsComp.classList.add('schema-colors');
    divsComp.style.cssText = 'display: flex; flex-direction: column; margin: 0rem 1rem; align-items: center; width: 100%'
    const generateBtn = document.querySelector('.btn-palette');

    schemaSelect.addEventListener('change', complementedColors);
    
    function complementedColors () {

        const defaultSchema = 'complement'
        const chosenSchema = schemaSelect.value
        console.log(chosenSchema, userInput.value);
        const url2 = `https://www.thecolorapi.com/scheme?${colorCode}=${colorValue}&mode=${chosenSchema}&count=6`;
        fetch(url2)
        .then(response => response.json())
        .then(data => {
            
        const schemaColors = data.colors;
            
        schemaSelect.insertAdjacentElement('afterend',divsComp);
        
        if (chosenSchema === 'complement') {
            const schemacolors = document.querySelector('.schema-colors');
            while (schemacolors.firstChild) {
                schemacolors.removeChild(schemacolors.firstChild);
            }
            for (let i = 0; i < schemaColors.length; i++) {
                const divComp = document.createElement('div');
                schemacolors.appendChild(divComp);
                divComp.classList.add('pal-colors');
                divComp.style.cssText = `padding: 2rem 2rem; text-align: center; background: ${schemaColors[i].hex.value}; margin: 0.5rem; box-shadow: 0 0 10px rgba(0, 0, 0, 0.2); border-radius: 6px; width: 100%; cursor: pointer`;
                divComp.innerText = schemaColors[i][colorCode].value;
                divComp.onclick = () => {
                    const textToCopy = divComp.innerText;
                    console.log(textToCopy);
                    const tempInput = document.createElement('textarea');
                    tempInput.value = textToCopy;
                    document.body.appendChild(tempInput);
                    tempInput.select();
                    document.execCommand('copy');
                    document.body.removeChild(tempInput);
                  }
                
                console.log('Case1');
            }
        } else if (chosenSchema === 'analogic-complement') {
            const schemacolors = document.querySelector('.schema-colors');
            while (schemacolors.firstChild) {
                schemacolors.removeChild(schemacolors.firstChild);
            }
            for (let i = 0; i < schemaColors.length; i++) {
                const divComp = document.createElement('div');
                schemacolors.appendChild(divComp);
                divComp.classList.add('pal-colors');
                divComp.style.cssText = `padding: 2rem 2rem; text-align: center; background: ${schemaColors[i].hex.value}; margin: 0.5rem; box-shadow: 0 0 10px rgba(0, 0, 0, 0.2); border-radius: 6px; width: 100%; cursor: pointer`;
                divComp.innerText = schemaColors[i][colorCode].value;
                divComp.onclick = () => {
                    const textToCopy = divComp.innerText;
                    console.log(textToCopy);
                    const tempInput = document.createElement('textarea');
                    tempInput.value = textToCopy;
                    document.body.appendChild(tempInput);
                    tempInput.select();
                    document.execCommand('copy');
                    document.body.removeChild(tempInput);
                  }
                console.log('Case2');
            } 
        } else if (chosenSchema === 'analogic') {
            const schemacolors = document.querySelector('.schema-colors');
            while (schemacolors.firstChild) {
                schemacolors.removeChild(schemacolors.firstChild);
            }
            for (let i = 0; i < schemaColors.length; i++) {
                const divComp = document.createElement('div');
                schemacolors.appendChild(divComp);
                divComp.classList.add('pal-colors');
                divComp.style.cssText = `padding: 2rem 2rem; text-align: center; background: ${schemaColors[i].hex.value}; margin: 0.5rem; box-shadow: 0 0 10px rgba(0, 0, 0, 0.2); border-radius: 6px; width: 100%; cursor: pointer`;
                divComp.innerText = schemaColors[i][colorCode].value;
                divComp.onclick = () => {
                    const textToCopy = divComp.innerText;
                    console.log(textToCopy);
                    const tempInput = document.createElement('textarea');
                    tempInput.value = textToCopy;
                    document.body.appendChild(tempInput);
                    tempInput.select();
                    document.execCommand('copy');
                    document.body.removeChild(tempInput);
                  }
                console.log('Case3');
            } 
        } else if (chosenSchema === 'triad') {
            const schemacolors = document.querySelector('.schema-colors');
            while (schemacolors.firstChild) {
                schemacolors.removeChild(schemacolors.firstChild);
            }
            for (let i = 0; i < schemaColors.length; i++) {
                const divComp = document.createElement('div');
                schemacolors.appendChild(divComp);
                divComp.classList.add('pal-colors');
                divComp.style.cssText = `padding: 2rem 2rem; text-align: center; background: ${schemaColors[i].hex.value}; margin: 0.5rem; box-shadow: 0 0 10px rgba(0, 0, 0, 0.2); border-radius: 6px; width: 100%; cursor: pointer`;
                divComp.innerText = schemaColors[i][colorCode].value;
                divComp.onclick = () => {
                    const textToCopy = divComp.innerText;
                    console.log(textToCopy);
                    const tempInput = document.createElement('textarea');
                    tempInput.value = textToCopy;
                    document.body.appendChild(tempInput);
                    tempInput.select();
                    document.execCommand('copy');
                    document.body.removeChild(tempInput);
                  }
                console.log('Case4');
            } 
        } else if (chosenSchema === 'quad') {
            const schemacolors = document.querySelector('.schema-colors');
            while (schemacolors.firstChild) {
                schemacolors.removeChild(schemacolors.firstChild);
            }
            for (let i = 0; i < schemaColors.length; i++) {
                const divComp = document.createElement('div');
                schemacolors.appendChild(divComp);
                divComp.classList.add('pal-colors');
                divComp.style.cssText = `padding: 2rem 2rem; text-align: center; background: ${schemaColors[i].hex.value}; margin: 0.5rem; box-shadow: 0 0 10px rgba(0, 0, 0, 0.2); border-radius: 6px; width: 100%; cursor: pointer`;
                divComp.innerText = schemaColors[i][colorCode].value;
                divComp.onclick = () => {
                    const textToCopy = divComp.innerText;
                    console.log(textToCopy);
                    const tempInput = document.createElement('textarea');
                    tempInput.value = textToCopy;
                    document.body.appendChild(tempInput);
                    tempInput.select();
                    document.execCommand('copy');
                    document.body.removeChild(tempInput);
                  }
                console.log('Case5');
            } 
        } else if (chosenSchema === 'monochrome') {
            const schemacolors = document.querySelector('.schema-colors');
            while (schemacolors.firstChild) {
                schemacolors.removeChild(schemacolors.firstChild);
            }
            for (let i = 0; i < schemaColors.length; i++) {
                const divComp = document.createElement('div');
                schemacolors.appendChild(divComp);
                divComp.classList.add('pal-colors');
                divComp.style.cssText = `padding: 2rem 2rem; text-align: center; background: ${schemaColors[i].hex.value}; margin: 0.5rem; box-shadow: 0 0 10px rgba(0, 0, 0, 0.2); border-radius: 6px; width: 100%; cursor: pointer`;
                divComp.innerText = schemaColors[i][colorCode].value;
                divComp.onclick = () => {
                    const textToCopy = divComp.innerText;
                    console.log(textToCopy);
                    const tempInput = document.createElement('textarea');
                    tempInput.value = textToCopy;
                    document.body.appendChild(tempInput);
                    tempInput.select();
                    document.execCommand('copy');
                    document.body.removeChild(tempInput);
                  }
                console.log('Case6');
            } 
        } else if (chosenSchema === 'monochrome-dark') {
            const schemacolors = document.querySelector('.schema-colors');
            while (schemacolors.firstChild) {
                schemacolors.removeChild(schemacolors.firstChild);
            }
            for (let i = 0; i < schemaColors.length; i++) {
                const divComp = document.createElement('div');
                schemacolors.appendChild(divComp);
                divComp.classList.add('pal-colors');
                divComp.style.cssText = `padding: 2rem 2rem; text-align: center; background: ${schemaColors[i].hex.value}; margin: 0.5rem; box-shadow: 0 0 10px rgba(0, 0, 0, 0.2); border-radius: 6px; width: 100%; cursor: pointer`;
                divComp.innerText = schemaColors[i][colorCode].value;
                divComp.onclick = () => {
                    const textToCopy = divComp.innerText;
                    console.log(textToCopy);
                    const tempInput = document.createElement('textarea');
                    tempInput.value = textToCopy;
                    document.body.appendChild(tempInput);
                    tempInput.select();
                    document.execCommand('copy');
                    document.body.removeChild(tempInput);
                  }
                console.log('Case7');
            } 
        } else if (chosenSchema === 'monochrome-light') {
            const schemacolors = document.querySelector('.schema-colors');
            while (schemacolors.firstChild) {
                schemacolors.removeChild(schemacolors.firstChild);
            }
            for (let i = 0; i < schemaColors.length; i++) {
                const divComp = document.createElement('div');
                schemacolors.appendChild(divComp);
                divComp.classList.add('pal-colors');
                divComp.style.cssText = `padding: 2rem 2rem; text-align: center; background: ${schemaColors[i].hex.value}; margin: 0.5rem; box-shadow: 0 0 10px rgba(0, 0, 0, 0.2); border-radius: 6px; width: 100%; cursor: pointer`;
                divComp.innerText = schemaColors[i][colorCode].value;
                divComp.onclick = () => {
                    const textToCopy = divComp.innerText;
                    console.log(textToCopy);
                    const tempInput = document.createElement('textarea');
                    tempInput.value = textToCopy;
                    document.body.appendChild(tempInput);
                    tempInput.select();
                    document.execCommand('copy');
                    document.body.removeChild(tempInput);
                  }
                console.log('Case8');
            } 
        }
            
        // btnSearch.disabled = false;
        
        }) 
    }
})     
}
const selectedColors = new Array;

document.addEventListener('copy', copiedToClipboard); 
  // Create the pop-up element
  function copiedToClipboard () {
  const popup = document.createElement('div');
  popup.classList.add('popup');
  popup.innerText = 'Copied!';

  // Add the pop-up element to the page
  document.body.appendChild(popup);

  // Remove the pop-up element after 3 seconds
  setTimeout(() => {
    popup.remove();
  }, 1500);
};

    
function gradients () {
  const parent = document.querySelector('.gradients');
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
  parent.style.cssText = 'display:flex; flex-direction:column; align-items: center; width: 100%; max-width: 1200px;';
  const gradHeading = document.createElement('h2');
  gradHeading.innerText = "Gradient";
  gradHeading.style.cssText = 'margin-top: 1rem; margin-bottom: 0.5rem;';
  parent.appendChild(gradHeading);
  
  const gradientType = document.createElement('select');
  gradientType.innerHTML = '<option value="gradient-type" selected disabled>Gradient Type</option><option value="linear-gradient">Linear Gradient</option><option value="radial-gradient">Radial Gradient</option><option value="conic-gradient">Conic Gradient</option>';
  gradientType.style.cssText = 'margin: 0.5rem 0 0, min-width: 200px';
  gradientType.setAttribute('id','btn-search');
  parent.appendChild(gradientType);
  
  const selectColors = document.createElement('button');
  selectColors.innerText = "Select colors";
  selectColors.setAttribute('id', 'btn-search');
  
    
    const inputValues = document.createElement('div');
    inputValues.className = 'gradInputs';
    inputValues.style.cssText = "display: flex; flex-direction:column; align-items:center; margin-top: 1rem; width: 100%";
    parent.appendChild(inputValues);
    const input1 = document.createElement('input')
    input1.setAttribute('id','1');
    input1.style.cssText = "margin-bottom: 0.3rem"
    const input2 = document.createElement('input')
    input2.setAttribute('id','2');
    input2.style.cssText = "margin-bottom: 0.3rem"
    const addColor = document.createElement('button')
    addColor.innerText = 'Add Color';
    addColor.setAttribute('id','btn-search');
    addColor.style.cssText = "margin-bottom:0.3rem";
    
    gradientType.addEventListener('change', function () {
      
      selectedColors.length = 0;
      document.removeEventListener('copy', copiedToClipboard);
      gradientColorSelect();
        
    });

    function gradientColorSelect () {
      
      document.addEventListener('dblclick', function (event) { 
     
          const selectedContent = event.target.innerText;
          console.log(selectedContent);

          // if (window.getSelection) {
          // selectedContent = window.getSelection().toString();
          // } else if (document.selection && document.selection.type !== 'Control') {
          //   selectedContent = document.selection.createRange().text;
          // }
          // selectedContent = window.getSelection().toString();
          console.log('Selected content: ' + selectedContent);
         
          const popup = document.createElement('div');
          popup.classList.add('popup');
          let pickedtotal;
          
          document.body.appendChild(popup);
    
    const valueToRemove = selectedColors.indexOf(selectedContent);
    
    if (valueToRemove !== -1) {
      selectedColors.splice(valueToRemove, 1); 
      console.log(`Value ${valueToRemove} removed from the array`);
      pickedtotal = selectedColors.length;
      popup.innerText = `Color ${pickedtotal} selected`;
    } else {
      console.log(`Value ${valueToRemove} not found in the array`);
    }
    selectedColors.push(selectedContent);
    pickedtotal = selectedColors.length;
    popup.innerText = `Color ${pickedtotal} selected`;
    
    setTimeout(() => {
    popup.remove();
    }, 1500);
   
  });
   
    
    
  };
    

    const generateGradient = document.createElement('button');
    generateGradient.innerText = 'Generate Gradient';
    generateGradient.className = 'generateGradient';
    generateGradient.style.cssText = "align-self: center;";
    generateGradient.setAttribute('id','btn-search');
    
    inputValues.appendChild(generateGradient);
    
    
    const gradientContainer = document.createElement('div');
    generateGradient.addEventListener('click', selectedColorsFunction);
    function selectedColorsFunction () {
        document.addEventListener('copy', copiedToClipboard); 
        console.log(selectedColors.length);

        if (selectedColors.length === 1 || selectedColors.length === 0) {
            const popup = document.createElement('div');
            popup.classList.add('popup');
            popup.innerText = `Select at least 2 colors`;
  
            document.body.appendChild(popup);
    
            setTimeout(() => {
            popup.remove();
            }, 1500);
            gradientColorSelect();


        }  
        else if (selectedColors.length === 2) {
            gradientContainer.classList = 'gradient';
            gradientContainer.style.cssText = `margin: 1rem auto; padding: 8rem 5rem; min-width: 100%; border-radius: 6px; background: ${gradientType.value}(${selectedColors[0]}, ${selectedColors[1]}); box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2); text-align: center; cursor: pointer`;
            gradientContainer.innerText = `background: ${gradientType.value}(${selectedColors[0]}, ${selectedColors[1]});`;
            parent.appendChild(gradientContainer);
            selectedColors.length = 0;
            gradientContainer.onclick = () => {
              const textToCopy = gradientContainer.innerText;
              console.log(textToCopy);
              const tempInput = document.createElement('textarea');
              tempInput.value = textToCopy;
              document.body.appendChild(tempInput);
              tempInput.select();
              document.execCommand('copy');
              document.body.removeChild(tempInput);
            }
            console.log(selectedColors);
        }
        else if (selectedColors.length === 3) {
            gradientContainer.classList = 'gradient';
            gradientContainer.style.cssText = `margin: 1rem auto; padding: 8rem 5rem; min-width: 100%; border-radius: 6px; background: ${gradientType.value}(${selectedColors[0]}, ${selectedColors[1]}, ${selectedColors[2]}); box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2); text-align: center; cursor: pointer`;
            gradientContainer.innerText = `background: ${gradientType.value}(${selectedColors[0]}, ${selectedColors[1]}, ${selectedColors[2]});`;
            parent.appendChild(gradientContainer);
            selectedColors.length = 0;
            gradientContainer.onclick = () => {
              const textToCopy = gradientContainer.innerText;
              console.log(textToCopy);
              const tempInput = document.createElement('textarea');
              tempInput.value = textToCopy;
              document.body.appendChild(tempInput);
              tempInput.select();
              document.execCommand('copy');
              document.body.removeChild(tempInput);
            }
            console.log(selectedColors);
        }
        else if (selectedColors.length === 4) {
            gradientContainer.classList = 'gradient';
            gradientContainer.style.cssText = `margin: 1rem auto; padding: 8rem 5rem; min-width: 100%; border-radius: 6px; background: ${gradientType.value}(${selectedColors[0]}, ${selectedColors[1]}, ${selectedColors[2]}, ${selectedColors[3]}); box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2); text-align: center; cursor: pointer`;
            gradientContainer.innerText = `background: ${gradientType.value}(${selectedColors[0]}, ${selectedColors[1]}, ${selectedColors[2]}, ${selectedColors[3]});`;
            parent.appendChild(gradientContainer);
            selectedColors.length = 0;
            gradientContainer.onclick = () => {
              const textToCopy = gradientContainer.innerText;
              console.log(textToCopy);
              const tempInput = document.createElement('textarea');
              tempInput.value = textToCopy;
              document.body.appendChild(tempInput);
              tempInput.select();
              document.execCommand('copy');
              document.body.removeChild(tempInput);
            }
            console.log(selectedColors);
        }
        else if (selectedColors.length === 5) {
            gradientContainer.classList = 'gradient';
            gradientContainer.style.cssText = `margin: 1rem auto; padding: 8rem 5rem; min-width: 100%; border-radius: 6px; background: ${gradientType.value}(${selectedColors[0]}, ${selectedColors[1]}, ${selectedColors[2]}, ${selectedColors[3]}, ${selectedColors[4]}); box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2); text-align: center; cursor: pointer`;
            gradientContainer.innerText = `background: ${gradientType.value}(${selectedColors[0]}, ${selectedColors[1]}, ${selectedColors[2]}, ${selectedColors[3]}, ${selectedColors[4]})`;
            parent.appendChild(gradientContainer);
            selectedColors.length = 0;
            gradientContainer.onclick = () => {
              const textToCopy = gradientContainer.innerText;
              console.log(textToCopy);
              const tempInput = document.createElement('textarea');
              tempInput.value = textToCopy;
              document.body.appendChild(tempInput);
              tempInput.select();
              document.execCommand('copy');
              document.body.removeChild(tempInput);
            }
            console.log(selectedColors);
        }
        else if (selectedColors.length === 6) {
            gradientContainer.classList = 'gradient';
            gradientContainer.style.cssText = `margin: 1rem auto; padding: 8rem 5rem; min-width: 100%; border-radius: 6px; background: ${gradientType.value}(${selectedColors[0]}, ${selectedColors[1]}, ${selectedColors[2]}, ${selectedColors[3]}, ${selectedColors[4]}, ${selectedColors[5]}); box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2); text-align: center; cursor: pointer`;
            gradientContainer.innerText = `background: ${gradientType.value}(${selectedColors[0]}, ${selectedColors[1]}, ${selectedColors[2]}, ${selectedColors[3]}, ${selectedColors[4]}, ${selectedColors[5]});`;
            parent.appendChild(gradientContainer);
            selectedColors.length = 0;
            gradientContainer.onclick = () => {
              const textToCopy = gradientContainer.innerText;
              console.log(textToCopy);
              const tempInput = document.createElement('textarea');
              tempInput.value = textToCopy;
              document.body.appendChild(tempInput);
              tempInput.select();
              document.execCommand('copy');
              document.body.removeChild(tempInput);
            }
            console.log(selectedColors);
        } else if (selectedColors.length > 6) {
              const popup = document.createElement('div');
              popup.classList.add('popup');
              popup.innerText = `Maximum allowed colors is 6`;
      
              document.body.appendChild(popup);
              setTimeout(() => {
              popup.remove();
              }, 1500);
              selectedColors.length = 0;
            }
            
          };
          selectedColors.length = 0; 
         
        }

        
        function randomGradient(mergedArray)  { 
          const parent = document.querySelector('.imageMatch-grid');
          const child = document.querySelector('.randomGrad-container');
          while (parent.lastChild === child) {
            parent.removeChild(child);
          }
          const imageColorArray = mergedArray;
          console.log(imageColorArray);
          const MaxGradietns = 30;
          
          
          const randomGradientArray = [];
          
          const randomGradientDiv = document.createElement('div');
          randomGradientDiv.className = 'randomGrad-container';
          randomGradientDiv.style.cssText = 'width: 100%; max-width:1200px; display: flex; flex-direction: column; align-items: center; margin-top: 1rem';
          randomGradientDiv.innerHTML = '<h2>Random Gradient from Image</h2>'
          const randomGradient = document.createElement('div');
          randomGradient.classList.add('random-gradient');
          
          const randomGenerate = document.createElement('select');
          randomGenerate.innerHTML = '<option value="gradient-type" disabled>Gradient Type</option><option value="linear-gradient" selected>Linear Gradient</option><option value="radial-gradient">Radial Gradient</option><option value="conic-gradient">Conic Gradient</option>';
          randomGenerate.style.cssText = 'margin-top: 1rem';
          randomGenerate.setAttribute('id','btn-search');
          randomGenerate.classList.add('random-generate-select');
          
          console.log(randomGenerate.value);
          // const randomTypeChange = document.querySelector('.random-generate-select');
          
          for (let i = 0; i < MaxGradietns; i++) {
            const randomIndex1 = Math.floor(Math.random() * imageColorArray.length);
            const randomIndex2 = Math.floor(Math.random() * imageColorArray.length);
            const randomIndex3 = Math.floor(Math.random() * imageColorArray.length);
            const randomColor1 = imageColorArray[randomIndex1];
            const randomColor2 = imageColorArray[randomIndex2];
            const randomColor3 = imageColorArray[randomIndex3];
            
            randomGradientArray.push(`${randomGenerate.value}(${randomColor1}, ${randomColor2}, ${randomColor3})`);
            
          }
         
          console.log(randomGradientArray);
          
          randomGradient.style.cssText = `margin: 1rem auto 0.5rem; padding: 8rem 5rem; min-width: 100%; border-radius: 6px; background: ${randomGradientArray[0]}; box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2); text-align: center; cursor: pointer`;
          randomGradient.innerText = `background: ${randomGradientArray[0]}`;
          const gradientSlider = document.createElement('input');
          gradientSlider.type = 'range';
          gradientSlider.value = 0;
          gradientSlider.max = randomGradientArray.length -1;
          gradientSlider.oninput = showGradients;
          
          
          const grid = document.querySelector('.imageMatch-grid');
          grid.appendChild(randomGradientDiv);
          randomGradientDiv.appendChild(randomGenerate);
          randomGradientDiv.appendChild(randomGradient);
          randomGradientDiv.appendChild(gradientSlider);
          
          function showGradients() {
            randomGradient.style.backgroundImage = `${randomGradientArray[this.value]}`;
            randomGradient.innerText = `background: ${randomGradientArray[this.value]};`;
            randomGradient.onclick = () => {
              const textToCopy = randomGradient.innerText;
              console.log(textToCopy);
              const tempInput = document.createElement('textarea');
              tempInput.value = textToCopy;
              document.body.appendChild(tempInput);
              tempInput.select();
              document.execCommand('copy');
              document.body.removeChild(tempInput);
            }
            console.log(randomGradientArray[this.value]);
            
          };
          randomGenerate.addEventListener('change', function () {;
            randomGradientArray.length = 0;
            for (let i = 0; i < MaxGradietns; i++) {
              const randomIndex1 = Math.floor(Math.random() * imageColorArray.length);
              const randomIndex2 = Math.floor(Math.random() * imageColorArray.length);
              const randomIndex3 = Math.floor(Math.random() * imageColorArray.length);
              const randomColor1 = imageColorArray[randomIndex1];
              const randomColor2 = imageColorArray[randomIndex2];
              const randomColor3 = imageColorArray[randomIndex3];
              
              if (randomIndex1 === randomIndex2) {
                const randomIndex1 = Math.floor(Math.random() * imageColorArray.length);
                const randomIndex2 = Math.floor(Math.random() * imageColorArray.length);
                const randomIndex3 = Math.floor(Math.random() * imageColorArray.length);
                const randomColor1 = imageColorArray[randomIndex1];
                const randomColor2 = imageColorArray[randomIndex2];
                const randomColor3 = imageColorArray[randomIndex3];
                randomGradientArray.push(`${randomGenerate.value}(${randomColor1}, ${randomColor2}, ${randomColor3})`);
              } else if (randomIndex1 === randomIndex3) {
                const randomIndex1 = Math.floor(Math.random() * imageColorArray.length);
                const randomIndex2 = Math.floor(Math.random() * imageColorArray.length);
                const randomIndex3 = Math.floor(Math.random() * imageColorArray.length);
                const randomColor1 = imageColorArray[randomIndex1];
                const randomColor2 = imageColorArray[randomIndex2];
                const randomColor3 = imageColorArray[randomIndex3];
                randomGradientArray.push(`${randomGenerate.value}(${randomColor1}, ${randomColor2}, ${randomColor3})`);
              } else if (randomIndex2 === randomIndex3) {
                const randomIndex1 = Math.floor(Math.random() * imageColorArray.length);
                const randomIndex2 = Math.floor(Math.random() * imageColorArray.length);
                const randomIndex3 = Math.floor(Math.random() * imageColorArray.length);
                const randomColor1 = imageColorArray[randomIndex1];
                const randomColor2 = imageColorArray[randomIndex2];
                const randomColor3 = imageColorArray[randomIndex3];
                randomGradientArray.push(`${randomGenerate.value}(${randomColor1}, ${randomColor2}, ${randomColor3})`);
              } else if (randomIndex2 === randomIndex1) {
                const randomIndex1 = Math.floor(Math.random() * imageColorArray.length);
                const randomIndex2 = Math.floor(Math.random() * imageColorArray.length);
                const randomIndex3 = Math.floor(Math.random() * imageColorArray.length);
                const randomColor1 = imageColorArray[randomIndex1];
                const randomColor2 = imageColorArray[randomIndex2];
                const randomColor3 = imageColorArray[randomIndex3];
                randomGradientArray.push(`${randomGenerate.value}(${randomColor1}, ${randomColor2}, ${randomColor3})`);
              } else if (randomIndex3 === randomIndex1) {
                const randomIndex1 = Math.floor(Math.random() * imageColorArray.length);
                const randomIndex2 = Math.floor(Math.random() * imageColorArray.length);
                const randomIndex3 = Math.floor(Math.random() * imageColorArray.length);
                const randomColor1 = imageColorArray[randomIndex1];
                const randomColor2 = imageColorArray[randomIndex2];
                const randomColor3 = imageColorArray[randomIndex3];
                randomGradientArray.push(`${randomGenerate.value}(${randomColor1}, ${randomColor2}, ${randomColor3})`);
              } else {  
                randomGradientArray.push(`${randomGenerate.value}(${randomColor1}, ${randomColor2}, ${randomColor3})`);
              }
              
            }
            
            console.log(randomGradientArray);
            
            randomGradient.style.cssText = `margin: 1rem auto 0.5rem; padding: 8rem 5rem; min-width: 100%; border-radius: 6px; background: ${randomGradientArray[0]}; box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2); text-align: center; cursor: pointer`;
            randomGradient.innerText = `background: ${randomGradientArray[0]}`;
            const gradientSlider = document.createElement('input');
            gradientSlider.type = 'range';
            gradientSlider.value = 0;
            gradientSlider.max = randomGradientArray.length -1;
            gradientSlider.oninput = showGradients;
            
            
            function showGradients() {
              randomGradient.style.backgroundImage = `${randomGradientArray[this.value]}`;
              randomGradient.innerText = `background: ${randomGradientArray[this.value]};`;
              randomGradient.onclick = () => {
                const textToCopy = randomGradient.innerText;
                console.log(textToCopy);
                const tempInput = document.createElement('textarea');
                tempInput.value = textToCopy;
                document.body.appendChild(tempInput);
                tempInput.select();
                document.execCommand('copy');
                document.body.removeChild(tempInput);
              }
              console.log(randomGradientArray[this.value]);
              
            };  
        });
        
  }

