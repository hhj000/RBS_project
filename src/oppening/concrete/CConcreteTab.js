import { ConcreteTabView, ConcreteTabContextMenu, TabControllsView } from './ConcreteTab.js'
import { ConcreteTabWindow, Concrete_WINDOW_TYPE } from './ConcreteWindow/CConcreteWindow.js'

import abstractModel from '../../models/abstractModel.js'
import concreteModel from '../../models/concreteModel.js'
import concreteModel from '../../models/concreteModel.js'
import employeeModel from '../../models/employeeModel.js'
import shoppingCartModel from '../../models/shoppingCartModel.js'
import transactionModel from '../../models/transactionModel.js'

// класс таба 'Абстрактные товары'
export class CConcreteTab {
    constructor() {
        this.refreshControlls       // функция обновления элементов управления в header'е
        this.view                   // объект для быстрого доступа к представлениям
        this.window                 // экземпляр окна для работы с товарами
        this.updateEventsDatatable  // функция обновления таблицы событий
        this.names                  // массив сотрудников в сабменю
    }

    // метод инициализации компонента
    init(updateEventsDatatable, refreshControlls) {
        this.updateEventsDatatable = updateEventsDatatable  // функция обновления таблицы событий
        this.refreshControlls = refreshControlls            // функция обновления элементов управления в header'е

        this.window = new CConcreteWindow() // инициализация компонента окна
        this.window.init(
            () => { this.refreshTable() }
        ) // вызова инициализации компонента окна

        this.names = [] // массив сотрудников в сабменю
    }

    // метод получения webix конфигурации компонента
    config() {
        // т.к. window и popup расположены не в дереве приложения, а поверх слоев, его нужно отрисовывать отдельно
        webix.ui(this.window.config())
        webix.ui(ConcreteTabContextMenu(this.names))

        // вызов функции представления
        return ConcreteTabView()
    }

    // метод получения webix конфигурации элементов управления таба
    configTabControlls() {
        return TabControllsView()
    }

    // метод инициализации обработчиков событий компонента
    attachEvents() {
        // инициализация используемых представлений
        this.view = {
            datatable: $$('concreteTabDatatable'),
            datatableContextMenu: $$('concreteTabDatatableContextMenu'),
            controlls: $$('concretetab-controlls'),
            btns: {
                createBtn: $$('concretetab-add-btn'),
                updateBtn: $$('concretetab-edit-btn'),
                deleteBtn: $$('concretetab-remove-btn'),
            }
        }

        // создание абстрактного товара
        this.view.btns.createBtn.attachEvent('onItemClick', () => {
            this.createConcrete()
        })

        // изменение абстрактного товара
        this.view.btns.updateBtn.attachEvent('onItemClick', () => {
            this.updateConcrete()
        })

        // удаление абстрактного товара
        this.view.btns.deleteBtn.attachEvent('onItemClick', () => {
            this.deleteConcrete()
        })

        // отложенное заполнение массива сотрудников в сабменю
        employeeModel.getEmployees().then((employees) => {
            // проверка наличия данных
            if (!employees) {
                return
            }

            employees.map((employee) => {
                this.names.push({ ID: employee.ID, value: `${employee.lastname} ${employee.firstname}` })
            })
        })

        // инициализация обработчиков событий модального окна
        this.window.attachEvents()

        // прикрепление контекстного меню к таблице
        this.view.datatableContextMenu.attachTo(this.view.datatable)

        // загрузка первичных данных в таблицу
        this.refreshTable()

        // обработка события нажатия на пункт контекстного меню
        this.view.datatableContextMenu.attachEvent('onMenuItemClick', (itemID) => {
            // проверка вложенности выбранного пункта меню
            if (!this.view.datatableContextMenu.getItem(itemID)) {
                this.handleSubMenu(itemID)
            } else {
                // получение значения пункта, на которое произошло нажатие
                let item = this.view.datatableContextMenu.getItem(itemID).value
                this.handleContextMenu(item)
            }

        })
    }

    // обработка выбора в контекстном меню
    handleContextMenu(item) {
        switch (item) {
            case CONCRETE_CONTEXT_MENU.edit: // редактирование выделленой книгиbreak
                this.updateConcrete()
                break
            case CONCRETE_CONTEXT_MENU.remove: // удаление выделенной книгиbreak
                this.deleteConcrete()
                break
            case CONCRETE_CONTEXT_MENU.take: // добавление книги
                // получение выделенного элемента
                let concrete = this.view.datatable.getSelectedItem()
                if (!concrete) {
                    webix.message('Выделите строку')
                    return
                }
                if (!concrete.ID) {
                    console.error('Incorrect ID of item:', concrete.ID)
                    return
                }

                // проверка статуса книги
                if (concrete.status === CONCRETE_STATUS.available) {
                    webix.message('Товар не выдан')
                    return
                }

                eventModel.createTakeEvent(concrete.ID).then(() => {
                    this.refreshTable()
                })
                break
            default:
                console.error(`Неизвестное значение пункта меню: ${item}.`)
                break
        }
    }

    // обработка выбора в submenu
    handleSubMenu(empItem) {
        // получения сотрудника из submenu
        let submenu = $$(this.view.datatableContextMenu.getItem(CONCRETE_CONTEXT_MENU.give).submenu)
        let employee = submenu.getItem(empItem)

        // получение выделенного элемента
        let concrete = this.view.datatable.getSelectedItem()
        if (!concrete) {
            webix.message('Выделите строку')
            return
        }
        if (!concrete.ID) {
            console.error('Incorrect ID of item:', concrete.ID)
            return
        }

        // проверка статуса товара
        if (concrete.status === CONCRETE_STATUS.notAvailable) {
            webix.message('Книга уже выдана')
            return
        }

        eventModel.createGiveEvent(concrete.ID, employee.ID).then(() => {
            this.refreshTable()
            this.updateEventsDatatable()
        })
    }

    // функция обновления таблицы абстрактных товаров
    refreshTable(concretes) {
        if (concretes) {
            this.view.datatable.clearAll()
            this.view.datatable.parse(concretes)
            return
        } else {
            concreteModel.getConcretes().then((concretes) => {
                // проверка наличия данных
                if (concretes) {
                    // преобразование даты издания
                    concretes.map((concrete) => {
                        concrete.year = new Date(concrete.year)
                    })
                }

                // заполнение таблицы окна данными книги
                this.view.datatable.clearAll()
                this.view.datatable.parse(concretes)
            })
        }
    }

    // метод отображения таба с фильтрацией по книге
    showByConcreteID(concreteID) {
        concreteModel.getBookByID(concreteID).then((concrete) => {
            // проверка наличия данных
            if (!concrete) {
                return
            }

            // применение фильтров
            this.view.datatable.getFilter('ISBN').value = concrete.ISBN
            this.view.datatable.filterByAll()

            // выделение нужной строки
            for (let rowID = 0; rowID < this.view.datatable.serialize().length; rowID++) {
                let item = this.view.datatable.serialize()[rowID]

                if (item.ID === concreteID) {
                    this.view.datatable.select(item.id)
                    break
                }
            }
        })
    }

    // функция переключения оторбажения элементов управления таба
    switchControlls() {
        switch (this.view.controlls.isVisible()) {
            case true:
                this.hideControlls()
                break;
            case false:
                this.showControlls()
                break;
        }
    }

    // функция отображения элементов управления таба
    showControlls() {
        this.view.controlls.show()
    }

    // функция сокрытия элементов управления таба
    hideControlls() {
        this.view.controlls.hide()
    }

    // функция создания книги
    createConcrete() {
        this.window.parse(new concrete())
        this.window.switch(CONCRETE_WINDOW_TYPE.create)
    }

    // функция изменения книги
    updateConcrete() {
        // получение выделенного элемента
        let selected = this.view.datatable.getSelectedItem()

        // проверка выделенного элемента
        if (!selected) {
            webix.message('Выделите строку')
            return
        }
        // проверка наличия поля ID у выделенного элемента
        if (!selected.ID) {
            console.error('Incorrect ID of item:', selected.ID)
            return
        }
        concreteModel.getBookByID(selected.ID).then((concrete) => {
            // проверка наличия данных
            if (!concrete) {
                return
            }

            // преобразование даты издания
            let time = new Date(concrete.year)
            concrete.year = time.getFullYear()

            // заполнение полей окна данными книги
            this.window.parse(concrete)
            this.window.switch(CONCRETE_WINDOW_TYPE.update)
        })
    }

    // функция удаления книги
    deleteConcrete() {
        // получение выделенного элемента
        let selected = this.view.datatable.getSelectedItem()

        if (!selected) {
            webix.message('Выделите строку')
            return
        }
        if (!selected.ID) {
            console.error('id of item is ', selected.ID)
            return
        }
        concreteModel.getConcreteByID(selected.ID).then((concrete) => {
            // проверка наличия данных
            if (!concrete) {
                return
            }
            // проверка выданности книги
            if (concrete.status === CONCRETE_STATUS.notAvailable) {
                webix.message('Нельзя удалить выданный товар')
                return
            }

            // преобразование даты издания
            let time = new Date(concrete.year)
            concrete.year = time.getFullYear()

            // заполнение полей окна данными книги
            this.window.parse(concrete)
            this.window.switch(CONCRETE_WINDOW_TYPE.delete)
        })
    }
}

// допустимые значения пунктов контекстного меню таба Книги
export const CONCRETE_CONTEXT_MENU = {
    give: 'Выдать',
    add: 'Добавить',
    edit: 'Изменить',
    remove: 'Удалить'
}