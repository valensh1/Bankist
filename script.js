'use strict';

//--------------------------------------DATA----------------------------------------------
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

//--------------------------------------DOM ELEMENTS----------------------------------------------
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


//--------------------------------------FUNCTIONS----------------------------------------------
const displayMovements = (movements) => {   // Function in which the purpose is to loop over each money movement amount (positive for deposit & negative for withdrawals) in the data array for each person's account
  containerMovements.innerHTML = '';    // Clears the HTML in this class as our HTML has some placeholders in there and we want to clear them to place our real movement data in there. Using the innerHTML function clears all the HTML within this div class and using the empty string '' does this.

  movements.forEach((mov, index) => {   // Loop over each movement (mov) amount supplied to function with forEach method
    const type = mov > 0 ? 'deposit' : 'withdrawal';  // If movement (mov) is greater than 0 then that means this is a deposit into our account and any negative amount means we are withdrawing. Purpose of this ternary operator is to use the result to modify our class name so that our CSS works and highlights green for deposit and red for withdrawals.

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${index + 1} ${type} deposit</div>
      <div class="movements__value">${mov}€</div>
    </div>`;    // Variable set up so we can use with the insertAdjacentHTML method. Notice we adjusted the class name with the type variable we created above which was the ternary operator

    containerMovements.insertAdjacentHTML('afterbegin', html); // Takes the containerMovements DOM variable which is just the overall container for the movements section and uses the insertAdjacentHTML method which basically inserts html right into a specified place in the DOM which in this case is the containerMovements. The first argument of the insertAdjacent HTML is where you want it inserted. The 'afterbegin' argument places the HTML after the element but before any other content that is already present inside that element. In our case with each element it loops over it places it at the beginning of the container element so finally by the last item it loops over that will be the one that shows first up top. This method is basically displaying in descending order. The other option 'beforeend' would place the items in ascending order. The 2nd argument to insertAdjacentHTML is the HTML you want to insert and in our case it is the html variable we created.
  });
};
displayMovements(account1.movements); // Invoke the displayMovements function supplying the function with the account1.movements array


const calcDisplayBalance = (movements) => { // Function that accepts a movements array and ultimately calculates a balance to display in the DOM
  const balance = movements.reduce((accum, current) => { // Creation of a balance variable that consists of the returned value from running the reduce method on the movements array; The method accepts an accum variable which starts at 0 unless otherwise specified at end of reduce method and then adds each current value on to the accum variable. So accum starts at 0 (unless otherwise specified) takes the first number and then adds that to the accum variable then goes to the 2nd number in array and adds that to accum variable, etc.
    return accum + current  // Add accum + current; Accum variable which starts at 0 unless otherwise specified at end of reduce method and then adds each current value on to the accum variable. So accum starts at 0 (unless otherwise specified) takes the first number and then adds that to the accum variable then goes to the 2nd number in array and adds that to accum variable, etc.
  }, 0);                    // Don't need to put 0 here as the default is 0 but if you wanted it to start at a different number you would insert a number here. For example, if you wanted 10 added to the sum of the array you would put 10 here. as the accum variable would start with 10 instead of starting at 0
  labelBalance.textContent = `${balance}€`; // Adds balance inside a template literal to DOM
};   
calcDisplayBalance(account1.movements); // Invoking the calcDisplayBalance method with account 1 object's movements array


const calcDisplaySummary = (movements) => { // Function that calculates the summary balance for each account holder (summary balance for deposits/moneyOut/interest)
  // Deposit - Summary Balance Total
  const deposits = movements.filter(mov => mov > 0).reduce((accum, current) => accum + current); // Takes the movements array for each account holder and then filters that movements array for all amounts greater than 0 as this represents deposits or money coming in; The filter method will return a new array with all the amounts that are greater than 0. Then we use the reduce method to sum up the array that the filter method returned to get our total deposit balance.
  labelSumIn.textContent = `${deposits}€`; // Update DOM for total deposits

  // Withdrawals / Money Going Out - Summary Balance Total
  const moneyOut = movements.filter(mov => mov < 0).reduce((accum, current) => accum + current); // Takes the movements array for each account holder and then filters that movements array for all amounts less than 0 as this represents money going out; The filter method will return a new array with all the amounts that are less than 0. Then we use the reduce method to sum up the array that the filter method returned to get our total moneyOut balance.
  labelSumOut.textContent = `${Math.abs(moneyOut)}€`; // Update DOM for total money going out

  // Interest - Interest Earned Summary Balance Total
  const interestRate = .012; // Interest rate for our bank which is 1.2% represented in decimal format as JavaScript doesn't recognize percentages.
  const interestAmts = movements.filter(mov => mov > 0).map(mov => mov * interestRate).filter(int => int >= 1).reduce((accum, current) => accum + current); // Takes the movements array for each account holder and then filters that movements array for all amounts greater than 0 as this represents deposits or money coming in; The filter method will return a new array with all the amounts that are greater than 0. Then we use the map method to loop over each element in the array returned from the filter method and apply the interest rate to that amount IF the interest is greater than or equal to 1. Then we use the reduce method to sum up the array that the map method returned to get our total interest balance.
  labelSumInterest.textContent = `${interestAmts}€`; // Update DOM for total interest
};
calcDisplaySummary(account1.movements); // Invoking the calcDisplaySummary method with account 1 object's movements array


const createUserNames = (accounts) => { // Function to convert account owner name to a username based on their initials; UserName will be a new key we are adding to each respective person's account object. Pass the accounts array variable which consists of [account1, account2, account3, account4] into function. Each one of these 4 accounts is a reference to an object which contains owner name, movements, interestRate & PIN
  accounts.forEach((acct) => { // Use forEach method to loop over accounts array variable because we don't want to return a new array we are simply just mutating the current objects that are contained within the accounts array variable.
  acct.username = acct.owner.toLowerCase().split(' ').map(name => name[0]).join(''); // Create a key on each person's account object called userName (acc.userName) and set that initially equal to acct.owner (for example - owner: 'Steven Thomas Williams') that converts the owner name into initials by first lower casing any letters then split the owner name string (split method with indicator being spaces in the string ' ') into an array so we can loop over the array containing each owners name. We then loop over the array of each owner's name by using the map method and return the first letter of each word (indicated by 0 index in name[0]) and then lastly we join the array back into a string with no spaces using the join method and no space indicator ('' - no spaces between the quotes). 
  });
};
createUserNames(accounts); // Invokes createUserNames function with the accounts array variable supplied to function ([account1, account2, account3, account4] supplied to function) 
console.log(accounts); // Prints out each account object in the accounts array variable with the newly added userName added to each object in the array




/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
