'use strict';

let startButton = document.getElementById('start');
let incomePlus = document.getElementsByTagName('button')[0];           // + Доходы
let expensesPlus = document.getElementsByTagName('button')[1];          // + Расходы
let checkDeposit = document.querySelector('#deposit-check');            //  Депозит
let additionalIncomeItem = document.querySelectorAll('.additional_income-item');
let budgetDayValue = document.getElementsByClassName('budget_day-value')[0];
let expensesMonthValue = document.getElementsByClassName('expenses_month-value')[0];
let additionalIncomeValue = document.getElementsByClassName('additional_income-value')[0];
let additionalExpensesValue = document.getElementsByClassName('additional_expenses-value')[0];
let incomePeriodValue = document.getElementsByClassName('income_period-value')[0];
let targetMonthValue = document.getElementsByClassName('target_month-value')[0];
let budgetMonthValue = document.getElementsByClassName('budget_month-value')[0];
let salaryAmount = document.querySelector('.salary-amount');           // Месячный доход 
let incomeTitle = document.querySelector('input.income-title');        //  Дополнительный доход наименование
let expensesTitle = document.querySelector('input.expenses-title');    //  Обязательные расходы наименование
let expensesItems = document.querySelectorAll('.expenses-items');       
let expensesAmount = document.querySelector('input.expenses-amount');    //  Обязательные расходы сумма
let additionalExpensesItem = document.querySelector('.additional_expenses-item');   // Возможные расходы (через запятую)
let targetAmount = document.querySelector('.target-amount');           // Цель
let periodSelect = document.querySelector('.period-select');           // Range Период расчета
let incomeItems = document.querySelectorAll('.income-items');          // Доп. доходы
let cancel = document.querySelector('#cancel');
        //  Проверка на число

let isNumber = function(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
};
       // appData

const AppData = function () {
    this.income = {};             // Подработка
    this.incomeMonth = 0;
    this.addIncome = [];          // Доп. доходы
    this.expenses = {};           // Обяз. расходы
    this.addExpenses = [];        // Возможные расходы
    this.deposit = false;         // Депозит
    this.percentDeposit = 0;      // Процент депозита
    this.moneyDeposit = 0;        // Сумма депозита
    this.budget = 0;              // Доход в месяц
    this.budgetDay = 0;           // Доход - расход в день
    this.budgetMonth = 0;         // Доход - расход в месяц
    this.expensesMonth = 0;       // Расход в месяц 

    AppData.prototype.start = function() {
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
    };
    AppData.prototype.showResult = function() {
        const _this = this;
        budgetMonthValue.value = this.budgetMonth;
        budgetDayValue.value = this.budgetDay;
        expensesMonthValue.value = this.expensesMonth;
        additionalExpensesValue.value = this.addExpenses.join(', ');
        additionalIncomeValue.value = this.addIncome.join(', ');
        targetMonthValue.value = Math.ceil(this.getTargetMonth());
        
        incomePeriodValue.value = this.calcPeriod();
        periodSelect.addEventListener('input', _this.start.bind(appData));
        
    };
    AppData.prototype.blocked = function() {
        document.querySelectorAll('input[type=text]').forEach(function(item){
            item.disabled = true;
        });
        startButton.style.display = 'none';
        cancel.style.display = 'block';
        
    };
    AppData.prototype.reset = function () {
        document.querySelectorAll('input[type=text]').forEach(function(item){
            item.disabled = false;
            item.value = null;
        });
        cancel.style.display = 'none';
        startButton.style.display = 'block';
    };
    AppData.prototype.addIncomeBlock = function() {
        let cloneIncomeItem = incomeItems[0].cloneNode(true);
        incomeItems[0].parentNode.insertBefore(cloneIncomeItem, incomePlus);
        incomeItems = document.querySelectorAll('.income-items');
        if (incomeItems.length === 3) {
            incomePlus.style.display = 'none';
        }
    };
    AppData.prototype.addExpensesBlock = function() {       
        let cloneExpensesItem = expensesItems[0].cloneNode(true);
        expensesItems[0].parentNode.insertBefore(cloneExpensesItem, expensesPlus);
        expensesItems = document.querySelectorAll('.expenses-items');
        if (expensesItems.length === 3) {
            expensesPlus.style.display = 'none';
        }
    };
    AppData.prototype.getExpenses = function() {
        const _this = this;
        expensesItems.forEach(function(item){
            
            let itemExpenses = item.querySelector('.expenses-title').value;
            let cashExpenses = item.querySelector('.expenses-amount').value;
            if(itemExpenses !== '' && cashExpenses !== '') {
                _this.expenses[itemExpenses] = cashExpenses;
            }
        });
    };
    AppData.prototype.getIncome = function() {
        const _this = this;
        incomeItems.forEach(function(item){
            
            let itemIncome = item.querySelector('.income-title').value;
            let cashIncome = item.querySelector('.income-amount').value;
            if(itemIncome !== '' && cashIncome !== '') {
                _this.income[itemIncome] = cashIncome;
            }           
        });
    };
    AppData.prototype.getAddExpenses = function() {
        let addExpenses = additionalExpensesItem.value.split(',');
        const _this = this;
        addExpenses.forEach(function(item){
            
            item = item.trim();
            if (item !== '') {
                _this.addExpenses.push(item);
            }
        });
    };
    AppData.prototype.getAddIncome = function() {
        const _this = this;
        additionalIncomeItem.forEach(function(item) {
            
            let itemValue = item.value.trim();
            if (itemValue !== '') {
                _this.addIncome.push(itemValue);
            }
        });
    };
    AppData.prototype.getExpensesMonth = function() {           // Все обяз. расходы в месяц
        
        for (let key in this.expenses) {
            this.expensesMonth += +this.expenses[key];
        }
    };
    AppData.prototype.getIncomeMonth = function() {
        for (let key in this.income){
            this.incomeMonth += +this.income[key];
        }
    };
    AppData.prototype.getBudget = function() {                  // Накопления за месяц
        const _this = this;
        this.budgetMonth = this.budget + this.incomeMonth - _this.expensesMonth;
        this.budgetDay = Math.round(this.budgetMonth / 30); 
    };
    AppData.prototype.getTargetMonth = function() {
        return targetAmount.value / this.budgetMonth;     
    };
    AppData.prototype.getStatusIncome = function() {
        const _this = this;
        if (this.budgetDay >= 1200) {
            return ('У вас высокий уровень дохода');
        }   else if (this.budgetDay >= 600 && _this.budgetDay < 1200) {
                return ('У вас средний уровень дохода');
        }   else if (this.budgetDay < 600) {
                    if (this.budgetDay <= 0) {
                        return ('Что то пошло не так');
                    } else {
                        return ('К сожалению у вас уровень дохода ниже среднего');
                    }      
        } 
    };
    AppData.prototype.getInfoDeposit = function() {
        if (this.deposit) {
            do {
                this.percentDeposit = prompt('Какой годовой процент?', '10');
            }
            while (!isNumber(this.percentDeposit));
            do {
                this.moneyDeposit = prompt('Какая сумма заложена?', 10000);
            }
            while (!isNumber(this.moneyDeposit));
        }
    };
    AppData.prototype.calcPeriod = function() {
        return this.budgetMonth * periodSelect.value;
    };
    AppData.prototype.stepPeriod = function(){
        let titlePeriod = document.querySelector('.period-amount');
        titlePeriod.textContent = periodSelect.value;
    };
    AppData.prototype.theButton = function() {
        startButton.disabled = true;
        if (salaryAmount.value !== '') {
            startButton.disabled = false;
        } 
    };

    AppData.prototype.eventsListeners = function () {
        const _this = this;
        this.theButton();
        startButton.addEventListener('click', _this.start.bind(appData));
        salaryAmount.addEventListener('input', _this.theButton.bind(appData));
        periodSelect.addEventListener('input', _this.stepPeriod.bind(appData));
        expensesPlus.addEventListener('click', _this.addExpensesBlock.bind(appData));
        incomePlus.addEventListener('click', _this.addIncomeBlock.bind(appData));
        cancel.addEventListener('click', _this.reset.bind(appData));

                //  Срок достижение цели
        this.getTargetMonth();

                // Заработок в сутки с учетом расходов
        this.getStatusIncome();

        let stringExpenses = function(){
            let itemsExpenses = '';
            for (let i = 0; i < _this.addExpenses.length; i++) {
                let unitExpenses = _this.addExpenses[i] + ', ';
                let itemUppercase = unitExpenses.charAt(0).toUpperCase();
                unitExpenses = unitExpenses.substring(1, unitExpenses.length);
                unitExpenses = itemUppercase + unitExpenses;
                itemsExpenses += unitExpenses;
            }
            console.log(itemsExpenses);
        };
        stringExpenses();
    };

};

const appData = new AppData();

console.log(appData);
appData.eventsListeners();





