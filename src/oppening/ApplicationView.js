import { CAbstractTab } from './abstrac/CAbstractTab.js'
import { CCategoryTab } from './category/CCategoryTab.js'
import { CConcreteTab } from './concrete/CConcreteTab.js'
import { CEmployeeTab } from './employee/CEmployeeTab.js'
import { CMainWindow } from './mainWindow/CMainWindow.js'
import { CShoppingCart } from './shoppingCart/CShoppingCart.js'
import { CToolbar } from './toolbar/CToolbar.js'
import { CTransactionTab } from './transaction/CTransactionTab.js'


//import { deleteCookie } from '../../helpers/cookies.js'
//import { checkAuth } from '../../helpers/checkAuth.js'
//import WorkedPlaceView from './ApplicationView.js'
// галвный компонент приложения
export class Application {
    constructor() {
        this.view                               // быстрый доступ к объектам представлений
        
		this.userInfo = new CToolbar()				//экземпляр контроллера пользовательской информации 
		this.abstractTab = new CAbstractTab()		//экземпляр контроллера абстрактных товаров
		this.categoryTab = new CCategoryTab()		//экземпляр контроллера конкретных товаров
		this.concreteTab = new CConcreteTab()		//экземпляр контроллера экземпляров товаров
		this.employeeTab = new CEmployeeTab()		//экземпляр контроллера сотрудников
		this.mainWindow = new CMainWindow()			//окно входа в приложение
		this.shoppingCart = new CShoppingCart()		//окно корзины
		this.transactionTab = new CTransactionTab()	//экземпляр контроллера транзакий
		
    }

    // метод инициализации главного компонента
    init() {//данный метод ещё не рассмотрен и не осознан. Пока что он пуст
	
		/*
        // инициализация компонента информации о пользователе
        this.userInfo.init(
            () => {
                deleteCookie('auth-token')
                location.replace('/user/logout')
            }, // onLogout
        )
        // инициализация компонента вкладки книг
        this.bookTab.init(
            () => { return this.journalTab.refreshTable() }, // updateEvent
            (config) => { this.refreshControlls(config) }, // refreshControlls
        )
        // инициализация компонента вкладки сотрудников
        this.employeeTab.init(
            () => { return this.dispatch(APP_TAB.booksTab) }, // toBook
            () => { return this.dispatch(APP_TAB.journalTab) }, // toEvent
            () => { return this.journalTab.refreshTable() }, // updateEventsDatatable
            () => { return this.bookTab.refreshTable() }, // updateBooksDatatable
            (config) => { this.refreshControlls(config) }, // refreshControlls
        )
        // инициализация компонента вкладки событий
        this.journalTab.init(
            () => { return this.dispatch(APP_TAB.booksTab) }, // toBook
            () => { return this.dispatch(APP_TAB.employeesTab) }, // toEvent
            (config) => { this.refreshControlls(config) }, // refreshControlls
        )
        // инициализация компонента окна входа в приложение
        this.mainWindow.init(
            () => { location.replace('/') }, // onLogin
        )
		*/
    }
