/*
Your task is to write a function that receives as its single argument 
a string that contains numbers delimited by single spaces. 
Each number has a single alphabet letter somewhere within it.

Example: 
  "24z6 1x23 y369 89a 900b"

As shown above, this alphabet letter can appear anywhere within the number. 
You have to extract the letters and sort the numbers according to their corresponding letters.

Example: 
  "24z6 1x23 y369 89a 900b" will become 89 900 123 369 246 
  (ordered according to the alphabet letter)

Here comes the difficult part, 
now you have to do a series of computations on the numbers you have extracted.

The sequence of computations are + - * /. 
Basic math rules do NOT apply, you have to do each computation in exactly this order.
This has to work for any size of numbers sent in (after division, go back to addition, etc).

In the case of duplicate alphabet letters, you have to arrange them 
according to the number that appeared first in the input string.
Remember to also round the final answer to the nearest integer.

Examples:
  "24z6 1x23 y369 89a 900b" = 89 + 900 - 123 * 369 / 246 = 1299
  "24z6 1z23 y369 89z 900b" = 900 + 369 - 246 * 123 / 89 = 1414
  "10a 90x 14b 78u 45a 7b 34y" = 10 + 45 - 14 * 7 / 78 + 90 - 34 = 60
*/


// Solution

function doMath(s){
  let ops = [(x,y) => x+y, (x,y) => x-y, (x,y) => x*y, (x,y) => x/y],
      i = 0, 
      r = s.split(' ')
           .map((x, i) => ({i: i, n: +x.replace(/[a-z]/gi, ''), c: x.replace(/\d/g, '').charCodeAt(0)}))
           .sort((x, y) => x.c-y.c || x.i-y.i)
           .map(x => x.n)
           .reduce((r, x) => ops[i++%4](r, x));
  return Math.round(r);
}

// or

function doMath(s){
  const numbers = getNumbers(s);
  const dictionary = createDictionary(numbers);
  return computeValues(dictionary);
}

function getNumbers(s) {
  return s.split(' ').map(individualString => {
    const key = individualString.replace(/\d/g, '');
    const value = individualString.replace(/\D/g, '')
    return {key, value};
    });
}

function createDictionary(arr) {
  const dictionary = {};
  arr.forEach(({key, value}) => {
    if (dictionary[key]) {
      if (Array.isArray(dictionary[key])) {
        dictionary[key].push(value);
      } else {
        dictionary[key] = [dictionary[key], value];
      }
    } else {
      dictionary[key] = value;
    }
  });
  return dictionary;
}

function computeValues(obj) {
  let index = -1;
  let current = 0;
  const calculate = {
    '-1': (x, y) => (x + y),
    0: (x, y) => (x + y),
    1: (x, y) => (x - y),
    2: (x, y) => (x * y),
    3: (x, y) => (x / y)
  };
  for (let letterCode = 10; letterCode < 36; letterCode++) {
    const value = obj[letterCode.toString(36)];
    if (value) {
      console.log(value);
      console.log(index);
      if (Array.isArray(value)) {
        value.forEach(number => {
          current = calculate[index % 4](Number(current), Number(number));
          index++;
        });
      } else {
        current = calculate[index % 4](Number(current), Number(value));
        index++;
      }
    }
  }
  return Math.round(current);
}