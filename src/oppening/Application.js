import { CAbstractTab } from './abstrac/CAbstractTab.js'
import { CCategoryTab } from './category/CCategoryTab.js'
import { CConcreteTab } from './concrete/CConcreteTab.js'
import { CEmployeeTab } from './employee/CEmployeeTab.js'
import { CMainWindow } from './mainWindow/CMainWindow.js'
import { CShoppingCart } from './shoppingCart/CShoppingCart.js'
import { CToolbar } from './toolbar/CToolbar.js'
import { CTransactionTab } from './transaction/CTransactionTab.js'

//КУКИ РАЗОБРАТЬ!
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
    init() {
		
        // инициализация компонента информации о пользователе
        this.userInfo.init(
            () => {
                deleteCookie('auth-token')
                location.replace('/user/logout')
            }, // onLogout
        )
		
		this.concreteTab.init(
            //() => { return this.journalTab.refreshTable() }, // updateEvent
            () => { return this.dispatch(APP_TAB.abstractTab) }, // toBook
            () => { return this.dispatch(APP_TAB.categoryTab) }, // toEvent
			() => { return this.dispatch(APP_TAB.employeeTab) },
			() => { return this.dispatch(APP_TAB.transactionTab) }
			
			
			(config) => { this.refreshControlls(config) }, // refreshControlls
        )
		
        // инициализация компонента вкладки книг
        
		this.abstractTab.init(
			() => { return this.dispatch(APP_TAB.concreteTab) }, // toBook
            () => { return this.dispatch(APP_TAB.categoryTab) }, // toEvent
			() => { return this.dispatch(APP_TAB.employeeTab) },
			() => { return this.dispatch(APP_TAB.transactionTab) }
			
		
            () => { return this.concreteTab.refreshTable() }, // updateEvent
            (config) => { this.refreshControlls(config) }, // refreshControlls
        )
		
		this.categoryTab.init(
			() => { return this.dispatch(APP_TAB.concreteTab) }, // toBook
            () => { return this.dispatch(APP_TAB.abstractTab) }, // toEvent
			() => { return this.dispatch(APP_TAB.employeeTab) },
			() => { return this.dispatch(APP_TAB.transactionTab) }
			
		
  			() => { return this.concreteTab.refreshTable() }, // updateEvent
			() => { return this.abstractTab.refreshTable() }, // updateEvent
            (config) => { this.refreshControlls(config) }, // refreshControlls
        )
		
		this.employeeTab.init(
			//какое окно надо 
            () => { return this.dispatch(APP_TAB.concreteTab) }, // toBook
            () => { return this.dispatch(APP_TAB.abstractTab) }, // toEvent
			() => { return this.dispatch(APP_TAB.categoryTab) },
			() => { return this.dispatch(APP_TAB.transactionTab) }
			
            () => { return this.transactionTab.refreshTable() }, // updateEventsDatatable
            (config) => { this.refreshControlls(config) }, // refreshControlls
        )
		
		
		this.shoppingCart.init(
            //() => { return this.journalTab.refreshTable() }, // updateEvent
            
			(config) => { this.refreshControlls(config) }, // refreshControlls
        )
		
        // инициализация компонента вкладки сотрудников
        
        // инициализация компонента вкладки событий
        this.transactionTab.init(
			() => { return this.dispatch(APP_TAB.abstractTab) }, // toBook
            () => { return this.dispatch(APP_TAB.categoryTab) }, // toEvent
			() => { return this.dispatch(APP_TAB.employeeTab) },
			() => { return this.dispatch(APP_TAB.concreteTab) }
			
            () => { return this.dispatch(APP_TAB.booksTab) }, // toBook
            () => { return this.dispatch(APP_TAB.employeesTab) }, // toEvent
            (config) => { this.refreshControlls(config) }, // refreshControlls
        )
        
		// инициализация компонента окна входа в приложение
        this.mainWindow.init(
            () => { location.replace('/') }, // onLogin
        )
		
    }//Windows 7 (на /dev/sda2)
	//etc/default/grub
	
	// метод вызова обработки событий
    attachEvents() {
        this.view = {
            tabbar: $$('main-tabbar'),
            multiviews: $$('main-views'),
            workedPlace: $$('workedPlace'),
            tabControllsContainer: $$('main'),
        }

        // компоненты требующие авторизации
        // вызываются через проверку авторизации
        // если клиент не авторизован, то эти
        // компоненты не будут отрисованы
        checkAuth((isAuth) => {
            if (isAuth) {
                // переключение таба
                this.view.tabbar.attachEvent('onItemClick', () => {
                    this.dispatch(this.view.tabbar.getValue())
                })

                // отрисовать рабочее пространство
                this.view.workedPlace.show()

                // обработчики событий компонентов
                this.userInfo.attachEvents()
                this.concreteTab.attachEvents()
				this.abstractTab.attachEvents()
				this.categoryTab.attachEvents()
                this.employeeTab.attachEvents()
                this.transactionTab.attachEvents()

                // выделить таб книг
                this.dispatch(APP_TAB.booksTab)
            } else {
                this.view.workedPlace.hide()
            }
        })

        // вызов обработки событий окна входа в приложение
        this.mainWindow.attachEvents()

        // первоночальное состояние приложения
        this.view.workedPlace.hide()
        this.mainWindow.switch()
    }

    // метод отрисовки главной конфигурации представления
    config() {
        webix.ui(this.mainWindow.config())

        return WorkedPlaceView(this.bookTab, this.employeeTab, this.journalTab, this.userInfo)
    }
	
	
	 dispatch(tab) {
        let tabObj

        // определение объекта таба
        switch (tab) {
            case APP_TAB.concreteTab:
                tabObj = this.concreteTab
                break
            case APP_TAB.abstractTab:
                tabObj = this.abstractTab
                break
            case APP_TAB.categoryTab:
                tabObj = this.categoryTab
                break
			case APP_TAB.employeeTab:
                tabObj = this.employeeTab
                break
			case APP_TAB.transactionTab:
                tabObj = this.transactionTab
                break
            default:
                console.error('Incorrect tab: ', tab)
                return
        }

// константы перечисления табов(id представления)
export const APP_TAB = {
    concreteTab: 'concreteTab',
    abstractTab: 'abstractTab',
    categoryTab: 'categoryTab',
	employeeTab: 'employeeTab',
	transactionTab: 'transactionTab',
}