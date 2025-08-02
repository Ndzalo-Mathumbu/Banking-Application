'use strict';

const account1 = {
  owner: 'Ndzalo NK Mathumbu',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2,
  pin: 1234,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-06-10T23:36:17.929Z',
    '2020-08-11T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT',
};

const account2 = {
  owner: 'Ken Mathumbu',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions

// daysPassed function
const [pT] = accounts.map(local => local.locale);

const daysPassed = (currentDate, movsDate) => {
  const daysGone = Math.round(
    Math.abs((movsDate - currentDate) / (1000 * 60 * 60 * 24))
  );

  if (daysGone === 0) return 'Today';
  else if (daysGone === 1) return 'Yesterday';
  else if (daysGone <= 7) return `${daysGone} days ago`;
  else {
    /* const day = movsDate.getDate();
    const month = `${movsDate.getMonth() + 1}`.padStart(2, '0');
    const year = movsDate.getFullYear(); */
    return new Intl.DateTimeFormat(pT).format(movsDate);
  }
};

const displayMovements = function (account, sort = false) {
  containerMovements.innerHTML = '';
  let combined = account.movements.map((mov, i) => ({
    movement: mov,
    movementDate: account.movementsDates[i],
  }));

  if (sort) combined = combined.slice().sort((a, b) => a.movement - b.movement);

  combined.forEach((obj, i) => {
    const { movement, movementDate } = obj;
    const type = movement > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(movementDate);
    const displayDate = daysPassed(new Date(), date);
    const option2 = {
      style: 'currency',
      currency: currentAccount.currency,
    };
    const formattingMovs = new Intl.NumberFormat(
      currentAccount.locale,
      option2
    ).format(movement);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattingMovs}</div>
      </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  const option2 = {
    style: 'currency',
    currency: currentAccount.currency,
  };
  const formattingMovs = new Intl.NumberFormat(
    currentAccount.locale,
    option2
  ).format(currentAccount.balance);

  labelBalance.textContent = `${formattingMovs}`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((a, b) => a + b, 0);
  const option2 = {
    style: 'currency',
    currency: currentAccount.currency,
  };
  const formattingMovs = new Intl.NumberFormat(
    currentAccount.locale,
    option2
  ).format(currentAccount.balance);

  labelSumIn.textContent = `${formattingMovs}`;

  const out = acc.movements.filter(mov => mov < 0).reduce((a, b) => a + b, 0);
  labelSumOut.textContent = `${formattingMovs}`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((a, b) => a + b, 0);
  labelSumInterest.textContent = `${formattingMovs}`;
};

const createUsernames = accs => {
  accs.forEach(acc => {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = acc => {
  displayMovements(acc);
  calcDisplayBalance(acc);
  calcDisplaySummary(acc);
};

///////////////////////////////////////
// Event handlers
let currentAccount, myTimer;

const startLogOutTimer = function () {
  // Set time to 5 minutes
  let time = 200;

  // Call the timer every second
  const myTimer = setInterval(() => {
    const min = String(Math.trunc(time / 60)).padStart(2, '0');
    const sec = String(time % 60).padStart(2, '0');
    // In each call, print the remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;
    //minus 1s
    // When 0 seconds, stop timer and log out user
    if (time === 0) {
      clearInterval(myTimer);
      labelWelcome.textContent = 'Login to get stared';
      containerApp.style.opacity = 0;
    }
    --time;
  }, 1000);

  return myTimer;
};

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === +inputLoginPin.value) {
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;

    /* const now = new Date();
    const day = now.getDate();
    const month = `${now.getMonth() + 1}`.padStart(2, '0');
    const year = now.getFullYear();
    const hours = `${now.getHours()}`.padStart(2, '0');
    const minutes = `${now.getMinutes()}`.padStart(2, '0');

    labelDate.textContent = `${day}/${month}/${year}, ${hours}:${minutes}`; */
    const now = new Date();
    const option = {
      hour: 'numeric',
      minute: 'numeric',
      month: 'numeric',
      day: 'numeric',
      year: 'numeric',
    };
    // const locale = navigator.language;
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      option
    ).format(now);
    containerApp.style.opacity = 100;

    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    if (myTimer) clearInterval(myTimer);
    myTimer = startLogOutTimer();
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());
    updateUI(currentAccount);
  }
  clearInterval(myTimer);
  myTimer = startLogOutTimer();
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  setTimeout(() => {
    const amount = Math.floor(inputLoanAmount.value);
    if (
      amount > 0 &&
      currentAccount.movements.some(mov => mov >= amount * 0.1)
    ) {
      currentAccount.movements.push(amount);
      currentAccount.movementsDates.push(new Date().toISOString());
      updateUI(currentAccount);
    }
    inputLoanAmount.value = '';
  }, 4000);
  clearInterval(myTimer);
  myTimer = startLogOutTimer();
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
  clearInterval(myTimer);
  myTimer = startLogOutTimer();
});

//////// INTERNATIONALIZING DATES INTL /////////

/* const rightNow = new Date();
const option = {
  hour: 'numeric',
  minute: 'numeric',
  day: 'numeric',
  month: 'long',
  year: '2-digit',
  weekday: 'long',
};
const local = navigator.language;
console.log(local);
labelDate.textContent = new Intl.DateTimeFormat(local, option).format(rightNow);
 */
const options = {
  style: 'currency',
  unit: 'celsius',
  currency: 'Eur',
};
const num = 54672537851.42;
console.log('US', new Intl.NumberFormat('en-US', options).format(num));
console.log('Germany', new Intl.NumberFormat('de-DE', options).format(num));
console.log(
  'Browser',
  new Intl.NumberFormat(navigator.language, options).format(num)
);

//////TIMER/////

// setTIMEOUT

const ingredients = ['ice', 'water'];
const timer = setTimeout(
  (lastName, yearsOld) =>
    console.log(`I am Ndzalo NK ${lastName} and i am ${yearsOld}`),
  4000,
  ...ingredients
);
console.log('coming...');

if (ingredients.includes('ice'))
  console.log('clearingTimer'), clearTimeout(timer);

//setInterval

const myDate = new Date();
const hour = myDate.getHours();
const minute = myDate.getMinutes();
const sec = myDate.getSeconds();
const myoptions = {
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
};
const myDateFormat = new Intl.DateTimeFormat(
  navigator.language,
  myoptions
).format(myDate);
setInterval(() => {
  console.log(myDateFormat);
}, 2000);
