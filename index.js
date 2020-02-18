'use strict';

const startButton = document.getElementById('start'),
      incomePlus = document.getElementsByTagName('button')[0],              // + Доходы
      expensesPlus = document.getElementsByTagName('button')[1],            // + Расходы
      checkDeposit = document.querySelector('#deposit-check'),              //  Депозит
      additionalIncomeItem = document.querySelectorAll('.additional_income-item'),
      budgetDayValue = document.getElementsByClassName('budget_day-value')[0],
      expensesMonthValue = document.getElementsByClassName('expenses_month-value')[0],
      additionalIncomeValue = document.getElementsByClassName('additional_income-value')[0],
      additionalExpensesValue = document.getElementsByClassName('additional_expenses-value')[0],
      incomePeriodValue = document.getElementsByClassName('income_period-value')[0],
      targetMonthValue = document.getElementsByClassName('target_month-value')[0],
      budgetMonthValue = document.getElementsByClassName('budget_month-value')[0],
      salaryAmount = document.querySelector('.salary-amount'),              // Месячный доход 
      incomeTitle = document.querySelector('input.income-title'),           //  Дополнительный доход наименование
      expensesTitle = document.querySelector('input.expenses-title'),       //  Обязательные расходы наименование
      expensesAmount = document.querySelector('input.expenses-amount'),     //  Обязательные расходы сумма
      additionalExpensesItem = document.querySelector('.additional_expenses-item'),   // Возможные расходы
      targetAmount = document.querySelector('.target-amount'),              // Цель
      periodSelect = document.querySelector('.period-select'),              // Range Период расчета
      cancel = document.querySelector('#cancel');

let incomeItems = document.querySelectorAll('.income-items'),               // Доп. доходы
    expensesItems = document.querySelectorAll('.expenses-items');  


class AppData {
    constructor(income, incomeMonth, addIncome, expenses, addExpenses, deposit, percentDeposit,
         moneyDeposit, budget,budgetDay, budgetMonth, expensesMonth){
        this.income = income || {};                 // Подработка
        this.incomeMonth = incomeMonth;             // Шабашка за месяц
        this.addIncome = addIncome || [];           // Доп. доходы
        this.expenses = expenses || {};             // Обяз. расходы
        this.addExpenses = addExpenses || [];       // Возможные расходы
        this.deposit = deposit || false;            // Депозит
        this.percentDeposit = percentDeposit;       // Процент депозита
        this.moneyDeposit = moneyDeposit;           // Сумма депозита
        this.budget = budget;                       // Доход в месяц
        this.budgetDay = budgetDay;                 // Доход - расход в день
        this.budgetMonth = budgetMonth;             // Доход - расход в месяц
        this.expensesMonth = expensesMonth;         // Расход в месяц 
    }
            //  Проверка на число

    isNumber(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }
    start() {
        console.log(this);
        this.budget = +salaryAmount.value;
        this.getExpenses();
        this.getIncome();
        this.getExpensesMonth();
        this.getIncomeMonth();
        this.getAddExpenses();
        this.getAddIncome();
        this.getBudget();
        this.showResult();
        this.blocked();
        console.log(typeof(this.budget));
    }
    showResult() {
        budgetMonthValue.value = this.budgetMonth;
        budgetDayValue.value = this.budgetDay;
        expensesMonthValue.value = this.expensesMonth;
        additionalExpensesValue.value = this.addExpenses.join(', ');
        additionalIncomeValue.value = this.addIncome.join(', ');
        targetMonthValue.value = Math.ceil(this.getTargetMonth());
        incomePeriodValue.value = this.calcPeriod();
        periodSelect.addEventListener('input', this.start.bind(appData));
    }
    blocked() {
        document.querySelectorAll('input[type=text]').forEach((item) => {
            item.disabled = true;
        });
        startButton.style.display = 'none';
        cancel.style.display = 'block';
        
    }
    reset() {
        document.querySelectorAll('input[type=text]').forEach((item) => {
            item.disabled = false;
            item.value = null;
        });
        cancel.style.display = 'none';
        startButton.style.display = 'block';
    }
    addIncomeBlock() {
        const cloneIncomeItem = incomeItems[0].cloneNode(true);
        incomeItems[0].parentNode.insertBefore(cloneIncomeItem, incomePlus);
        incomeItems = document.querySelectorAll('.income-items');
        if (incomeItems.length === 3) {
            incomePlus.style.display = 'none';
        }
    }
    addExpensesBlock() {       
        const cloneExpensesItem = expensesItems[0].cloneNode(true);
        expensesItems[0].parentNode.insertBefore(cloneExpensesItem, expensesPlus);
        expensesItems = document.querySelectorAll('.expenses-items');
        if (expensesItems.length === 3) {
            expensesPlus.style.display = 'none';
        }
    }
    getExpenses() {
        const _this = this;
        expensesItems.forEach((item) => {
            let itemExpenses = item.querySelector('.expenses-title').value;
            let cashExpenses = item.querySelector('.expenses-amount').value;
            if(itemExpenses !== '' && cashExpenses !== '') {
                _this.expenses[itemExpenses] = cashExpenses;
            }
        });
    }
    getIncome() {
        const _this = this;
        incomeItems.forEach((item) => {
            let itemIncome = item.querySelector('.income-title').value;
            let cashIncome = item.querySelector('.income-amount').value;
            if(itemIncome !== '' && cashIncome !== '') {
                _this.income[itemIncome] = cashIncome;
            }           
        });
    }
    getAddExpenses() {
        let addExpenses = additionalExpensesItem.value.split(',');
        const _this = this;
        addExpenses.forEach((item) => {
            item = item.trim();
            if (item !== '') {
                _this.addExpenses.push(item);
            }
        });
    }
    getAddIncome() {
        const _this = this;
        additionalIncomeItem.forEach((item) => {
            let itemValue = item.value.trim();
            if (itemValue !== '') {
                _this.addIncome.push(itemValue);
            }
        });
    }
    getExpensesMonth() {           // Все обяз. расходы в месяц
        for (let key in this.expenses) {
            this.expensesMonth += +this.expenses[key];
        }
    }
    getIncomeMonth() {
        for (let key in this.income){
            this.incomeMonth += +this.income[key];
        }
    }
    getBudget() {                  // Накопления за месяц
        this.budgetMonth = this.budget + this.incomeMonth - this.expensesMonth;
        this.budgetDay = Math.round(this.budgetMonth / 30); 
    }
    getTargetMonth() {
        return targetAmount.value / this.budgetMonth;     
    }
    getStatusIncome() {
        if (this.budgetDay >= 1200) {
            return ('У вас высокий уровень дохода');
        }   else if (this.budgetDay >= 600 && this.budgetDay < 1200) {
                return ('У вас средний уровень дохода');
        }   else if (this.budgetDay < 600) {
                    if (this.budgetDay <= 0) {
                        return ('Что то пошло не так');
                    } else {
                        return ('К сожалению у вас уровень дохода ниже среднего');
                    }      
        } 
    }
    getInfoDeposit() {
        if (this.deposit) {
            do {
                this.percentDeposit = prompt('Какой годовой процент?', '10');
            }
            while (!this.isNumber(this.percentDeposit));
            do {
                this.moneyDeposit = prompt('Какая сумма заложена?', 10000);
            }
            while (!this.isNumber(this.moneyDeposit));
        }
    }
    calcPeriod() {
        return this.budgetMonth * periodSelect.value;
    }
    stepPeriod(){
        let titlePeriod = document.querySelector('.period-amount');
        titlePeriod.textContent = periodSelect.value;
    }
    theButton() {
        startButton.disabled = true;
        if (salaryAmount.value !== '') {
            startButton.disabled = false;
        } 
    }
}

const appData = new AppData();

appData.theButton();
startButton.addEventListener('click', appData.start.bind(appData));
salaryAmount.addEventListener('input', appData.theButton.bind(appData));
periodSelect.addEventListener('input', appData.stepPeriod.bind(appData));
expensesPlus.addEventListener('click', appData.addExpensesBlock.bind(appData));
incomePlus.addEventListener('click', appData.addIncomeBlock.bind(appData));
cancel.addEventListener('click', appData.reset.bind(appData));

        //  Срок достижение цели
appData.getTargetMonth();

        // Заработок в сутки с учетом расходов
appData.getStatusIncome();

const stringExpenses = () => {
    let itemsExpenses = '';
    for (let i = 0; i < appData.addExpenses.length; i++) {
        let unitExpenses = appData.addExpenses[i] + ', ';
        const itemUppercase = unitExpenses.charAt(0).toUpperCase();
        unitExpenses = unitExpenses.substring(1, unitExpenses.length);
        unitExpenses = itemUppercase + unitExpenses;
        itemsExpenses += unitExpenses;
    }
    console.log(itemsExpenses);
};
stringExpenses();
console.log(appData);






