/**
 * @author Édson Fischborn
 * https://github.com/edsonfischborn/fun-queue-sim/blob/master/src/js/util/viewFunctions.js
 * DOM Functions
 */

/**
 * Returns a html element
 * @param {String} elem selector of a element
 * @returns {Element} html element by querySelector
 */
export const returnElement = (elem) => {
  return typeof elem === 'string' ? document.querySelector(elem) : elem;
};

/**
 * Creates a html element
 * @param {String} elem name of element
 * @returns {Element} html element
 */
export const createElm = (elem) => {
  return document.createElement(elem);
};

/**
 * Returns integer of element style prop, width, top...
 * @param {String} prop Example, '32px'
 * @returns {Number} Int, 32
 */
export const extractInt = (prop) => {
  return parseInt(prop.replace(/[^-0-9]/g, ''));
};

/**
 * Remove element and cilds
 * @param {Element} elem query selector string or element. example '#div' or div
 */
export const domRemove = (elem) => {
  returnElement(elem).remove();
};

/**
 * Adds many class to many elements
 * @param {String} classString example, 'class1 class2 class3'
 * @param {Element} elents html elements
 */
export const multiClassAdd = (classString, ...elements) => {
  if (!classString || !elements) return;

  elements.forEach((elem) => {
    elem.classList.add(...classString.split(' '));
  });
};

/**
 * Remove many class to many elements
 * @param {String} classString example, 'class1 class2 class3'
 * @param {Element} elents html elements
 */
export const multiClassRemove = (classString, ...elements) => {
  if (!classString || !elements) return;

  elements.forEach((elem) => {
    elem.classList.remove(...classString.split(' '));
  });
};

/**
 * Adds many attributes to many elements
 * @param {Object} attributeObject example {src: 'value'}
 * @param {Array} elements html elements, example div, span, p...
 */
export const multiAttributeSet = (attributeObject, ...elements) => {
  if (!attributeObject || !elements) return console.error('Missing parameters');

  elements.forEach((elem) => {
    for (let [prop, value] of Object.entries(attributeObject)) {
      elem.setAttribute(prop, value);
    }
  });
};

/**
 * Remove many attributes to many elements
 * @param {Object} attributeObject example {src: 'value'}
 * @param {Array} elements html elements, example div, span, p...
 */
export const multiAttributeRemove = (attributeArray, ...elements) => {
  if (!attributeArray || !elements) return console.error('Missing parameters');

  elements.forEach((elem) => {
    for (let attribute of attributeArray) {
      elem.removeAttribute(attribute);
    }
  });
};

/**
 * Adds many props to many elements
 * @param {Object} propObject example, { innerText: 'value' }
 * @param {Array} elements example, div, span, p
 */
export const multiPropAdd = (propObject, ...elements) => {
  elements.forEach((elem) => {
    for (let [prop, value] of Object.entries(propObject)) {
      elem[prop] = value;
    }
  });
};

/**
 * Adds many styles to many elements
 * @param {Object} styleObject example, { color: '#fff', height: '50px' }
 * @param {Array} elements example, div, span, p
 */
export const multiStyleAdd = (styleObject, ...elements) => {
  elements.forEach((elem) => {
    for (let [prop, value] of Object.entries(styleObject)) {
      elem.style[prop] = value;
    }
  });
};

/**
 * Adds a child to node
 * @param {String} target query selector string or element. example '#div' or div
 * @param element query selector string or element. example '#div' or div
 */
export const appendCh = (target, elem, position) => {
  if (!position) position = 'beforeEnd';
  returnElement(target).insertAdjacentElement(position, returnElement(elem));
};

/**
 * Append element in another node
 * @param {Element} elem query selector string or element. example '#div' or div
 * @param {Element} target query selector string or element. example '#div' or div
 */
export const updateAppend = (elem, target) => {
  const _element = returnElement(elem);

  _element.remove();
  returnElement(target).appendChild(_element);
};

/**
 * Move element to picked position
 * @param {Element} element Node element
 * @param {Number} to Integer, target position
 * @param {String} axis String, 'x' or 'y'
 * @param {Number} interval Time to move one step
 * @param {Number} step Pixels moved at each step
 */
export const moveTo = async (
  elem,
  to,
  axis = 'x',
  step = 1,
  stop = () => false
) => {
  return new Promise((resolve) => {
    const element = returnElement(elem);

    const setAxis = {
      x: 'left',
      y: 'bottom',
    };

    const _axis = setAxis[axis];

    let startValue = extractInt(element.style[_axis]);
    if (startValue === to) {
      resolve();
    }

    const reverse = startValue < to ? false : true;

    const finish = () =>
      (startValue >= to && !reverse) || (startValue <= to && reverse);

    const animate = () => {
      reverse ? (startValue -= step) : (startValue += step);
      multiStyleAdd({ [_axis]: `${startValue}px` }, element);

      if (stop() || finish()) {
        resolve();
      } else {
        requestAnimationFrame(animate);
      }
    };

    animate();
  });
};
