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
      cancel = document.querySelector('#cancel'),
      depositCheck = document.getElementById('deposit-check'),
      depositBank = document.querySelector('.deposit-bank'),
      depositAmount = document.querySelector('.deposit-amount'),
      depositPercent = document.querySelector('.deposit-percent');

let incomeItems = document.querySelectorAll('.income-items'),               // Доп. доходы
    expensesItems = document.querySelectorAll('.expenses-items');  


class AppData {
    constructor(){
        this.income = {};                 // Подработка
        this.incomeMonth = 0;             // Шабашка за месяц
        this.addIncome = [];           // Доп. доходы
        this.expenses = {};             // Обяз. расходы
        this.addExpenses = [];       // Возможные расходы
        this.deposit = false;            // Депозит
        this.percentDeposit = 0;       // Процент депозита
        this.moneyDeposit = 0;           // Сумма депозита
        this.budget = 0;                       // Доход в месяц
        this.budgetDay = 0;                 // Доход - расход в день
        this.budgetMonth = 0;             // Доход - расход в месяц
        this.expensesMonth = 0;         // Расход в месяц 
    }
            //  Проверка на число

    isNumber(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }
    start() {
        if (salaryAmount.value !== ''){
            
            this.alertPercent();
            this.budget = +salaryAmount.value;
            this.getExpenses();
            this.getIncome();
            this.getExpensesMonth();
            this.getIncomeMonth();
            this.getAddExpenses();
            this.getAddIncome();

            this.getInfoDeposit();
            
            this.getBudget();
            this.showResult();
            this.getTargetMonth();
            this.getStatusIncome();
            this.blocked();
        }
    }
    showResult() {
        budgetMonthValue.value = this.budgetMonth;
        budgetDayValue.value = this.budgetDay;
        expensesMonthValue.value = this.expensesMonth;
        additionalExpensesValue.value = this.addExpenses.join(', ');
        additionalIncomeValue.value = this.addIncome.join(', ');
        targetMonthValue.value = Math.ceil(this.getTargetMonth());
        incomePeriodValue.value = this.calcPeriod();
        
    }
    blocked() {
        document.querySelectorAll('input[type=text]').forEach((item) => {
            item.disabled = true;
        });
        startButton.style.display = 'none';
        cancel.style.display = 'block';
        
    }
    reset() {
        location.reload();
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
            const itemExpenses = item.querySelector('.expenses-title').value;
            const cashExpenses = item.querySelector('.expenses-amount').value;
            if(itemExpenses !== '' && cashExpenses !== '') {
                _this.expenses[itemExpenses] = cashExpenses;
            }
        });
    }
    getIncome() {
        const _this = this;
        incomeItems.forEach((item) => {
            const itemIncome = item.querySelector('.income-title').value;
            const cashIncome = item.querySelector('.income-amount').value;
            if(itemIncome !== '' && cashIncome !== '') {
                _this.income[itemIncome] = cashIncome;
            }           
        });
    }
    getAddExpenses() {
        const addExpenses = additionalExpensesItem.value.split(',');
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
        const monthDeposit = this.moneyDeposit * (this.percentDeposit / 100);
        this.budgetMonth = this.budget + this.incomeMonth - this.expensesMonth + monthDeposit;
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
    calcPeriod() {
        return this.budgetMonth * periodSelect.value;
    }
    stepPeriod(){
        let titlePeriod = document.querySelector('.period-amount');
        titlePeriod.textContent = periodSelect.value;
    }
    
    getInfoDeposit() {
        if (this.deposit) {
            this.percentDeposit = depositPercent.value;
            this.moneyDeposit = depositAmount.value;
        }
    }
    alertPercent() {
        if (depositPercent.value === '' || depositPercent.value > 100){
            depositPercent.value = 0;
        }
    }
    changePercent() {
        const valueSelect = this.value;
        if (valueSelect === 'other') {
            // Домашнее задание
            depositPercent.style.display = 'inline-block';
            depositPercent.value = '';
        } else {
            depositPercent.value = valueSelect;
            depositPercent.style.display = 'none';
        }
    }
    depositHandler() {
        if (depositCheck.checked) {
            depositBank.style.display = 'inline-block';
            depositAmount.style.display = 'inline-block';
            this.deposit = true;
            depositBank.addEventListener('change', this.changePercent);
        } else {
            depositBank.style.display = 'none';
            depositAmount.style.display = 'none';
            depositPercent.style.display = 'none';
            depositBank.value = '';
            depositAmount.value = '';
            depositPercent.value = '';
            this.deposit = false;
            depositBank.removeEventListener('change', this.changePercent);
        }
    }
    EventListeners(){
        //salaryAmount.addEventListener('input', this.theButton.bind(this));
        startButton.addEventListener('click', this.start.bind(this));
        
        periodSelect.addEventListener('input', this.stepPeriod.bind(this));
        expensesPlus.addEventListener('click', this.addExpensesBlock.bind(this));
        incomePlus.addEventListener('click', this.addIncomeBlock.bind(this));
        cancel.addEventListener('click', this.reset.bind(this));
        periodSelect.addEventListener('input', this.showResult.bind(this));
        depositCheck.addEventListener('change', this.depositHandler.bind(this));
    }
}

const appData = new AppData();
appData.EventListeners();








