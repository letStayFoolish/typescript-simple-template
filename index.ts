console.log('Hello world! Section #16');

// Coding Challenge #1
/**
 * 1. Create function `whereAmI` which takes inputs latitude (lat) and longitude (lng)
 */

const whereAmI = async function (lat: number, lng: number) {
  const request = await fetch(`https://geocode.xyz/${lat},${lng}?json=1`)
    .then(response => {
      if (!response || !response.ok)
        throw new Error(`An error occurred ${response.status}`);

      if (response.status === 403)
        throw new Error(
          `You have sent too many requests. Limit is 3 requests per second. Error status: ${response.status}`
        );

      console.log({ response });

      return response.json();
    })
    .then(data => console.log(`You are in ${data.city}, ${data.country}`))
    .catch(error => console.error(`Error happened: ${error.message}`));
};

// void whereAmI(52.508, 13.381);
// void whereAmI(19.037, 72.873);
// void whereAmI(-33.933, 18.474);

console.log('==== Test Start ===='); // #1 Immediately goes to call stack
setTimeout(() => console.log('0 sec timer.'), 0); // #4 And at the end we log this one (after the call stack is empty)
Promise.resolve('Resolved promise 1.').then(res => console.log(res)); // #3 Promises are part of the Microtasks queue (always have priority over the callback queue

// Promise.resolve('Resolved Promise 2').then(res => {
//   for (let i = 0; i < 10000000000; i++) {}
//
//   console.log(res);
// });

console.log('==== Test End ===='); // #2 Second execution within the call stack.

const newPromise = new Promise(function (resolve, reject) {
  // should contain async behavior that we are trying to handle with the promise.
  // should produce a result value - future value of the promise.

  // sync code
  console.log('Promise is active ⏳');

  // some async behavior
  setTimeout(() => {
    if (Math.random() > 0.5) {
      resolve('You win!');
    } else {
      reject(new Error('You lose!'));
    }
  }, 2000);
});

newPromise.then(res => console.log(res)).catch(error => console.log(error));

// Promisifying traditional callback-based APIs setTimeout
const wait = function (seconds: number) {
  return new Promise(function (resolve) {
    setTimeout(resolve, seconds * 1000);
  });
};

wait(2)
  .then(() => {
    console.log('2 sec timer.');

    return wait(1);
  })
  .then(() => console.log('1 sec timer.'));

// Promisifying setTimeout for sleep functionality
const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

async function rateLimitedOperations() {
  console.log('Starting sleep fu....');
  await sleep(1000);
  console.log('Finished sleep fu....');
}

void rateLimitedOperations();

// Promisifying callbacks

navigator.geolocation.getCurrentPosition(
  position => {
    console.log(position);
  },
  error => {
    console.log(error);
  }
);

// This can be written using Promises
const getLoc = function () {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(
      // position => resolve(position),
      // error => reject(error)
      // Or even shorter:
      resolve,
      reject
    );
  });
};

getLoc()
  .then(res => console.log(res))
  .catch(error => console.log(error));

// Coding #2
// 2.1
const imagesContainer = document.querySelector('.images') as HTMLDivElement;

const createImage = function (imgPath: string) {
  // whenever we Promisifying something, we always first return a new Promise.
  return new Promise(function (resolve, reject) {
    const imgEl = document.createElement('img');
    // setting .src attribute is asynchronous!
    imgEl.src = imgPath;

    imgEl.addEventListener('load', function () {
      imagesContainer.appendChild(imgEl);
      resolve(imgEl);
    });

    imgEl.addEventListener('error', function () {
      reject(new Error(`Something went wrong while creating image`));
    });
  });
};

let currentImage: HTMLImageElement | string = '';
// createImage('img/img-1.jpg')
//   .then(img => {
//     currentImage = img as HTMLImageElement;
//
//     return wait(2);
//   })
//   .then(() => {
//     (currentImage as HTMLImageElement).style.display = 'none';
//
//     return createImage('img/img-2.jpg');
//   })
//   .then(img => {
//     currentImage = img as HTMLImageElement;
//
//     return wait(2);
//   })
//   .then(() => {
//     (currentImage as HTMLImageElement).style.display = 'none';
//   })
//   .catch(err => console.error(err));

// #3 Code Challenge
// Part 1
const loadNPause = async function (imgPath: string) {
  console.log('loadNPause Start...');
  try {
    const imgEl = await createImage(imgPath);
    await wait(2);

    (imgEl as HTMLImageElement).style.display = 'none';
  } catch (error: any) {
    console.error(error.message);
    throw error;
  } finally {
    console.log('loadNPause End...');
  }
};
// (async function () {
//   await loadNPause('img/img-1.jpg');
//   await loadNPause('img/img-2.jpg');
// })();
// Part 2
const loadAll = async function (imgArr: string[]) {
  try {
    const imgs = imgArr.map(async img => await createImage(img));
    const imgsAwaited = await Promise.all(imgs);

    imgsAwaited.forEach(img =>
      (img as HTMLImageElement).classList.add('parallel')
    );
    console.log(imgsAwaited);
  } catch (error: any) {
    console.error(error.message);
    throw error;
  }
};

(async () =>
  await loadAll(['img/img-1.jpg', 'img/img-2.jpg', 'img/img-3.jpg']))();
