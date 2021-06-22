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
const displayMovements = (account, sort = false) => {   // Function in which the purpose is to loop over each money movement amount (positive for deposit & negative for withdrawals) in the data array for each person's account; Sort parameter is set to a default of false which will keep the original descending order
  containerMovements.innerHTML = '';    // Clears the HTML in this class as our HTML has some placeholders in there and we want to clear them to place our real movement data in there. Using the innerHTML function clears all the HTML within this div class and using the empty string '' does this.

  const sortedMovements = sort ? account.movements.slice().sort((a,b) => a - b) : account.movements; // Creation of variable sortedMovements which says if sort argument passed in is true then take a copy of the account.movements array via the slice() method and then sort the movements using the sort method using the callback function of a-b.

  sortedMovements.forEach((mov, index) => {   // Loop over sortedMovement (mov) amount supplied to function with forEach method
    const type = mov > 0 ? 'deposit' : 'withdrawal';  // If movement (mov) is greater than 0 then that means this is a deposit into our account and any negative amount means we are withdrawing. Purpose of this ternary operator is to use the result to modify our class name so that our CSS works and highlights green for deposit and red for withdrawals.

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${index + 1} ${type}</div>
      <div class="movements__value">${mov}€</div>
    </div>`;    // Variable set up so we can use with the insertAdjacentHTML method. Notice we adjusted the class name with the type variable we created above which was the ternary operator

    containerMovements.insertAdjacentHTML('afterbegin', html); // Takes the containerMovements DOM variable which is just the overall container for the movements section and uses the insertAdjacentHTML method which basically inserts html right into a specified place in the DOM which in this case is the containerMovements. The first argument of the insertAdjacent HTML is where you want it inserted. The 'afterbegin' argument places the HTML after the element but before any other content that is already present inside that element. In our case with each element it loops over it places it at the beginning of the container element so finally by the last item it loops over that will be the one that shows first up top. This method is basically displaying in descending order. The other option 'beforeend' would place the items in ascending order. The 2nd argument to insertAdjacentHTML is the HTML you want to insert and in our case it is the html variable we created.
  });
};


const calcDisplayBalance = (account) => { // Function that accepts an entire account object and ultimately calculates a balance to display in the DOM
  account.balance = account.movements.reduce((accum, current) => { // Creation of a balance variable on the account holders object that consists of the returned value from running the reduce method on the account.movements array; The method accepts an accum variable which starts at 0 unless otherwise specified at end of reduce method and then adds each current value on to the accum variable. So accum starts at 0 (unless otherwise specified) takes the first number and then adds that to the accum variable then goes to the 2nd number in array and adds that to accum variable, etc.
    return accum + current  // Add accum + current; Accum variable which starts at 0 unless otherwise specified at end of reduce method and then adds each current value on to the accum variable. So accum starts at 0 (unless otherwise specified) takes the first number and then adds that to the accum variable then goes to the 2nd number in array and adds that to accum variable, etc.
  }, 0);                    // Don't need to put 0 here as the default is 0 but if you wanted it to start at a different number you would insert a number here. For example, if you wanted 10 added to the sum of the array you would put 10 here. as the accum variable would start with 10 instead of starting at 0
  labelBalance.textContent = `${account.balance}€`; // Adds the newly created key/value pair (account.balance) we added to account holder's object inside a template literal to DOM
};   


const calcDisplaySummary = (account) => { // Function that calculates the summary balance for each account holder (summary balance for deposits/moneyOut/interest)
  // Deposit - Summary Balance Total
  const deposits = account.movements.filter(mov => mov > 0).reduce((accum, current) => accum + current); // Takes the account.movements array for each account holder and then filters that movements array for all amounts greater than 0 as this represents deposits or money coming in; The filter method will return a new array with all the amounts that are greater than 0. Then we use the reduce method to sum up the array that the filter method returned to get our total deposit balance.
  labelSumIn.textContent = `${deposits}€`; // Update DOM for total deposits

  // Withdrawals / Money Going Out - Summary Balance Total
  if (account.movements.some(el => el < 0)){ // If current Account holders movements have some movements that are below 0 then do code below. Use .some() method to determine if the current account holder's movements have any or some negative amounts in there and if so then do code below. If didn't have this it would throw an error.
  const moneyOut = account.movements.filter(mov => mov < 0).reduce((accum, current) => accum + current); // Takes the movements array for each account holder and then filters that movements array for all amounts less than 0 as this represents money going out; The filter method will return a new array with all the amounts that are less than 0. Then we use the reduce method to sum up the array that the filter method returned to get our total moneyOut balance.
  labelSumOut.textContent = `${Math.abs(moneyOut)}€`; // Update DOM for total money going out
  } else {
    labelSumOut.textContent = `0€`; // Else if no movements with negative amounts or no money going out then update DOM to reflect 0 for no money going out.
  }

  // Interest - Interest Earned Summary Balance Total
  const interestAmts = account.movements.filter(mov => mov > 0).map(mov => (mov * account.interestRate) / 100).filter(int => int >= 1).reduce((accum, current) => accum + current); // Takes the account.movements array for each account holder and then filters that movements array for all amounts greater than 0 as this represents deposits or money coming in; The filter method will return a new array with all the amounts that are greater than 0. Then we use the map method to loop over each element in the array returned from the filter method and apply the interest rate to that amount IF the interest is greater than or equal to 1. Then we use the reduce method to sum up the array that the map method returned to get our total interest balance.
  labelSumInterest.textContent = `${interestAmts}€`; // Update DOM for total interest
};


const createUserNames = (accounts) => { // Function to convert account owner name to a username based on their initials; UserName will be a new key we are adding to each respective person's account object. Pass the accounts array variable which consists of [account1, account2, account3, account4] into function. Each one of these 4 accounts is a reference to an object which contains owner name, movements, interestRate & PIN
  accounts.forEach((acct) => { // Use forEach method to loop over accounts array variable because we don't want to return a new array we are simply just mutating the current objects that are contained within the accounts array variable.
  acct.username = acct.owner.toLowerCase().split(' ').map(name => name[0]).join(''); // Create a key on each person's account object called userName (acc.userName) and set that initially equal to acct.owner (for example - owner: 'Steven Thomas Williams') that converts the owner name into initials by first lower casing any letters then split the owner name string (split method with indicator being spaces in the string ' ') into an array so we can loop over the array containing each owners name. We then loop over the array of each owner's name by using the map method and return the first letter of each word (indicated by 0 index in name[0]) and then lastly we join the array back into a string with no spaces using the join method and no space indicator ('' - no spaces between the quotes). 
  });
};
createUserNames(accounts); // Invokes createUserNames function with the accounts array variable supplied to function ([account1, account2, account3, account4] supplied to function) 
console.log(accounts); // Prints out each account object in the accounts array variable with the newly added userName added to each object in the array


const updateUI = (account) => { // Function invoking all the individual balance displays
      // Display Movements
      displayMovements(account); // Invoke the displayMovements function supplying the function with the current account holder logged in's entire object

      // Display Balance
      calcDisplayBalance(account); // Invoking the calcDisplayBalance method with current account holder logged in's entire object
  
      // Display Summary
      calcDisplaySummary(account); // Invoking the calcDisplaySummary method with current account holder logged in's entire object
}

//--------------------------------------EVENT HANDLERS----------------------------------------------
let currentAccount; // Creation of a global variable currentAccount to display the current account holder who is logged in. Created this variable so we can get access to this variable from inside functions and also reassign values to it

// Event Handler - User Login
btnLogin.addEventListener('click', (event) => { // Login Arrow Button; Must use event here to pass into the preventDefault() method in order to stop the default of a button click which is refreshing the page
  event.preventDefault(); // Method that prevents form from submitting
  currentAccount = accounts.find((acct => acct.username === inputLoginUsername.value)) // Assign currentAccount variable to the current account holder object for the account who is logged in. Use the find method to loop through the accounts variable array to find the account object in which accounts username (acct.username) matches the username login input from form (inputLoginUsername.value); acct.username is the 3 lower case initials we calc'd in createUserNames fuction above.
  console.log(currentAccount); // Prints the current account holder logged in object

  if(currentAccount ?.pin === Number(inputLoginPin.value)) { // Checks if the find method account object it finds and returns the pin on that object matches the pin entered in by the user. Notice we use the optional chaining method here ?. which states that if there is undefined for currentAccount then don't search for .pin and just return undefined. This avoids an error. If didn't have optional chaining ?. method this would error out our program. It only searches for the .pin key if currentAccount is a valid account and not undefined.
    
    // Display UI and Welcome Message
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 1;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = ''; // Set input pin field to a blank empty string and then since the order of operations works from right to left it then assigns login username field to blank as well.
    inputLoginPin.blur(); // Blur method causes element to lose its focus.

    // Update User Interface (UI)
    updateUI(currentAccount);
  }
});

// Event Handler - Transfer Money To
btnTransfer.addEventListener('click', (event) => { // Transfer money container where user enters transfer to id of person they want to transfer money to and the amount and when they click ENTER or click on the arrow function is when it runs all the code below.
  event.preventDefault(); // Prevents default form action when user clicks button of auto refreshing page as we don't want page to refresh and lose all our data.
  const amount = Number(inputTransferAmount.value); // Create amount variable from the user input of the amount to transfer. All input from user is a string so we have to convert to a number using the Number() method.
  const receiverAcct = accounts.find(acct => acct.username === inputTransferTo.value); // Create a receiverAcct variable which is the account object of the account holder receiving the money. We get the account holder object of the person receiving the money by taking the 'transfer to' user input in which they input a user name and then use the find method on that value to find the first object in our accounts variable array where the username equals the inputted username to transfer money to.
  console.log(amount, receiverAcct);

  inputTransferAmount.value = inputTransferTo.value = ''; // Clear the transfer money section input fields after clicking the arrow button or the ENTER button to transfer money

  if (amount > 0 && receiverAcct && currentAccount.balance >= amount && receiverAcct ?.username !== currentAccount.username) // Conditions that need to check out as TRUE in order to have a valid money transfer such as the balance in holders account has to be >= amount to be transferred, etc.
    currentAccount.movements.push(-amount); // Push current transfer amount as a negative to the current account holders movements array
    receiverAcct.movements.push(amount); // Push current transfer amount as a positive to the receiver account holders movements array

     // Update User Interface (UI)
     updateUI(currentAccount); // Invoke the updateUI function which retrieves balances and pass in the currentAccount object as the argument
});

// Event Handler - Request Loan
btnLoan.addEventListener('click', (event) => { // Event handler for requesting a loan section
  event.preventDefault(); // Method that prevents default action of form which is the page refreshing upon hitting submit button or ENTER
  const amount = Number(inputLoanAmount.value); // Creation of variable that takes users loan amount and converts it to a number using the Number method() since everything a user inputs on a form is originally a string.
  const loanAmountPercentage = .10; // To receive a loan there must be a deposit of at least this percentage of the loan amount.
  if(amount > 0 && currentAccount.movements.some(mov => mov >= amount * loanAmountPercentage)) { // If condition to check to see if the loan amount is greater than 0 AND the use of the some method to see if there was some or any deposits that equaled at least 10% or greater of the requested loan amount.
    currentAccount.movements.push(amount); // Add loan amount to accound holders movements array
    updateUI(currentAccount); // Invoke updateUI function to update account holders balances upon receiving the loan
    inputLoanAmount.value = ''; // Blank out the input field after hitting ENTER or arrow submit button so that the input field loses its focus.
  } else {
      alert(`Must have a deposit that is greater than or equal to ${loanAmountPercentage * 100}% the loan amount requested`); // Alert if loan amount requested is larger than the 10% rule of needing at least one deposit that is greater than or equal to the LoanAmountPercentage * loan amount requested.
  }
  })


// Event Handler - Close Account
btnClose.addEventListener('click', (event) => {  // Event handler to close account
  event.preventDefault(); // Method that prevents default action of form which is the page refreshing upon hitting submit button or ENTER
  if(inputCloseUsername.value === currentAccount.username && Number(inputClosePin.value) === currentAccount.pin){  // If statement checking to make sure before closing account that the username of the account to close matches the current account holders username so he can't just close anybody's account. Also, we want to ensure the pin number entered matches the current account holders pin number as well. To get input values from fields you need to use .value and any input returned from input fields are returned as a string so we need to convert to a Number() method.
    const index = accounts.findIndex(account => account.username === currentAccount.username); // Get the index of the account to delete using the findIndex() method so that we can find the index of the account which the user is trying to delete which can only be their account.
    
    // Delete Account
    accounts.splice(index, 1); // Delete account with the splice method in which the first argument is the index position to delete and the 2nd argument is how many elements to delete which in this case is just 1 because we only allow the user to delete their account and that's it.

    // Hide UI
    containerApp.style.opacity = 0; // Upon deletion of account we want to hide all the data and user interface so we set the opacity back to 0.

    // Clear input fields after input
    inputCloseUsername.value = inputClosePin.value = ''; // Resetting the input fields after the user hits ENTER or the arrow submit button so the input fields no longer are in focus.
  }
})

// Event Handler - Sort Button
let sorted = false; // Creation of varialbe outside event handler that will be used as a boolean value to determine whether we want the list sorted or not. The default is set to FALSE as this will have the movement displayed in desecending order with the most recent transasction first. But when user clicks sort it will change this sorted variable to true. This variable ultimately gets passed in to the displayMovements function as the opposite of what its showing. So if its showing as true the variable passed in to displayMovements function will be false and vice-versa.
btnSort.addEventListener('click', (event) => { // Add event listener to sort the movements listing
  event.preventDefault(); // Method that prevents default action of form which is the page refreshing upon hitting submit button or ENTER
  displayMovements(currentAccount, !sorted); // Invoking the displayMovements function which passes in the currentAccount and the OPPOSITE of what the sorted variable is currently showing.
  sorted = !sorted; // Assign the sorted variable to be equal to the opposite of what it currently is showing so therefore when button is clicked again it will then send the opposite again to the displayMovements function which constantly makes the sort button as you keep clicking it go from sorted ascending to sorted descending.
});


// --------------------------------------------------------------WORKING WITH ARRAYS - ARRAY METHODS PRACTICE WORKING WITH THE BANKIST APPLICATION--------------------------------------------------------------------
// 1. Retrive the total deposits amount for all account holders
const totalDeposits = accounts // Creation of totalDeposits variable which loops over each account from the accounts variable
.flatMap(account => account.movements) // Loops over each account and adds account.movements array from each account into a new array and then flat part from flatMap method then flattens the array so that it is one big array and not an array with 4 sub-arrays for each account inside.
.filter(amount => amount > 0) // Filter the new array from the flatMap method for any deposits which are amounts greater than 0
.reduce((accum, current) => accum + current, 0); // Use reduce method to total all the deposits up.
console.log(totalDeposits); // Prints 25180

// 2. Count how many deposits in bank with at least 1,000
const numDeposits1Thousand = accounts // Creation of numDeposits1Thousand variable which loops over each account from the accounts variable
.flatMap(account => account.movements) // // Loops over each account and adds account.movements array from each account into a new array and then flat part from flatMap method then flattens the array so that it is one big array and not an array with 4 sub-arrays for each account inside.
.filter(amount => amount >= 1000).length // Filter the array returned from flatMap method above and filter for movement amounts greater than 1000; Get the length of the filtered array above which will be all the movement amounts greater than 1000. 
console.log(numDeposits1Thousand); // Prints 6 - which is 2 (3000, 1300 from account1) + 3 (5000, 3400, 8500 from account2) and 1 (1000 from account4)

// Solution for #2 above using the Reduce Method
const numDeposits1Thousandv2 = accounts // Creation of numDeposits1Thousand variable which loops over each account from the accounts variable
.flatMap(account => account.movements) // // Loops over each account and adds account.movements array from each account into a new array and then flat part from flatMap method then flattens the array so that it is one big array and not an array with 4 sub-arrays for each account inside.
.reduce((accum, current) => { // Reduce method loops over returned array from flatMap above and reduces it to the count of movements >= 1000
  return current >= 1000 ? accum += 1 : accum; // Take the current amount and if >= 1000 add 1 to the accumulator and if not then leave accumulator as is.
}, 0); // Starts off the reduce method with a 0;
console.log(numDeposits1Thousandv2); // Prints 6 - which is 2 (3000, 1300 from account1) + 3 (5000, 3400, 8500 from account2) and 1 (1000 from account4)

// 3. Get the total of the deposits and the withdrawals in one object
const sums = accounts // Creation of totalDeposits variable which loops over each account from the accounts variable
.flatMap(account => account.movements) // Loops over each account and adds account.movements array from each account into a new array and then flat part from flatMap method then flattens the array so that it is one big array and not an array with 4 sub-arrays for each account inside.
.reduce((accum, current) => { // Reduce method loops over returned array from flatMap above and reduces it to what we defined at the end of method which is the count of the {deposits: number, withdrawals: number}
   current > 0 ? accum.deposits += current : accum.withdrawals += current; // If current number is greater than 0 take the accum (accumulator) and increment the count by 1 on the deposits key in starter object we gave method below. If it isn't above 0 then that means its a withdrawal and we want to decrease the count on the withdrawal key in starter object we gave method below.
   /* accum[current > 0 ? 'deposits' : 'withdrawals'] += current; ANOTHER WAY TO DO LINE OF CODE DIRECTLY ABOVE */
   return accum; // Return the accum (accumulator) as this is the variable that stores the ending values which will be our object below with the deposit and withdrawal counts
}, {deposits: 0, withdrawals: 0}); // ACCUM (ACCUMULATOR) STARTS WITH THIS OBJECT HERE!!!; This is what we are incrementing in the reduce method code above and the final counts of this object will be our accumulator variable that we need to return which we did in line of code directly above.
console.log(sums); // Prints {deposits: 25180, withdrawals: -7340}

// Solution for #3 above but with destructuring of the deposits and withdrawals variables
const { deposits, withdrawals } = accounts // DIFFERENT LINE OF CODE THAN SOLUTION ABOVE!!!; Creation of totalDeposits variable which loops over each account from the accounts variable
.flatMap(account => account.movements) // Loops over each account and adds account.movements array from each account into a new array and then flat part from flatMap method then flattens the array so that it is one big array and not an array with 4 sub-arrays for each account inside.
.reduce((accum, current) => { // Reduce method loops over returned array from flatMap above and reduces it to what we defined at the end of method which is the count of the {deposits: number, withdrawals: number}
   current > 0 ? accum.deposits += current : accum.withdrawals += current; // If current number is greater than 0 take the accum (accumulator) and increment the count by 1 on the deposits key in starter object we gave method below. If it isn't above 0 then that means its a withdrawal and we want to decrease the count on the withdrawal key in starter object we gave method below.
   return accum;  // Return the accum (accumulator) as this is the variable that stores the ending values which will be our object below with the deposit and withdrawal counts
}, {deposits: 0, withdrawals: 0}); // ACCUM (ACCUMULATOR) STARTS WITH THIS OBJECT HERE!!!; This is what we are incrementing in the reduce method code above and the final counts of this object will be our accumulator variable that we need to return which we did in line of code directly above.
console.log(deposits, withdrawals); // Prints 25180 -7340; DIFFERENT LINE OF CODE THAN SOLUTION ABOVE; 

