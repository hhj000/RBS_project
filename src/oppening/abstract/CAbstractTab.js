import { AbstractTab,/* BookTabContextMenu,*/ TabControllsView } from './AbstractTab.js'
import { AbstractTabWindow, Abstract_WINDOW_TYPE } from './AbstractWindow/CAbstractWindow.js'

import abstractModel from '../../models/abstractModel.js'
import categoryModel from '../../models/categoryModel.js'
import concreteModel from '../../models/concreteModel.js'
import employeeModel from '../../models/employeeModel.js'
import shoppingCartModel from '../../models/shoppingCartModel.js'
import transactionModel from '../../models/transactionModel.js'

// класс таба 'Абстрактные товары'
export class CAbstractTab {
    constructor() {
        this.refreshControlls       // функция обновления элементов управления в header'е
        this.view                   // объект для быстрого доступа к представлениям
        this.window                 // экземпляр окна для работы с книгами
        this.updateEventsDatatable  // функция обновления таблицы событий
        this.names                  // массив сотрудников в сабменю
    }

    // метод инициализации компонента
    init(updateEventsDatatable, refreshControlls) {
        this.updateEventsDatatable = updateEventsDatatable  // функция обновления таблицы событий
        this.refreshControlls = refreshControlls            // функция обновления элементов управления в header'е

        this.window = new CAbstractWindow() // инициализация компонента окна
        this.window.init(
            () => { this.refreshTable() }
        ) // вызова инициализации компонента окна

        this.names = [] // массив сотрудников в сабменю
    }

    // метод получения webix конфигурации компонента
    config() {
        // т.к. window и popup расположены не в дереве приложения, а поверх слоев, его нужно отрисовывать отдельно
        webix.ui(this.window.config())
        webix.ui(AbstractTabContextMenu(this.names))

        // вызов функции представления
        return AbstractTabView()
    }

    // метод получения webix конфигурации элементов управления таба
    configTabControlls() {
        return TabControllsView()
    }

    // метод инициализации обработчиков событий компонента
    attachEvents() {
        // инициализация используемых представлений
        this.view = {
            datatable: $$('AbstractTabDatatable'),
            datatableContextMenu: $$('AbstractTabDatatableContextMenu'),
            controlls: $$('abstracttab-controlls'),
            btns: {
                createBtn: $$('abstracttab-add-btn'),
                updateBtn: $$('abstracttab-edit-btn'),
                deleteBtn: $$('abstracttab-remove-btn'),
            }
        }

        // создание абстрактного товара
        this.view.btns.createBtn.attachEvent('onItemClick', () => {
            this.createAbstract()
        })

        // изменение абстрактного товара
        this.view.btns.updateBtn.attachEvent('onItemClick', () => {
            this.updateAbstract()
        })

        // удаление абстрактного товара
        this.view.btns.deleteBtn.attachEvent('onItemClick', () => {
            this.deleteAbstract()
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
            case ABSTRACT_CONTEXT_MENU.edit: // редактирование выделленой книгиbreak
                this.updateAbstract()
                break
            case ABSTRACT_CONTEXT_MENU.remove: // удаление выделенной книгиbreak
                this.deleteAbstract()
                break
            case ABSTRACT_CONTEXT_MENU.take: // добавление книги
                // получение выделенного элемента
                let abstract = this.view.datatable.getSelectedItem()
                if (!abstract) {
                    webix.message('Выделите строку')
                    return
                }
                if (!abstract.ID) {
                    console.error('Incorrect ID of item:', abstract.ID)
                    return
                }

                // проверка статуса книги
                if (abstract.status === ABSTRACT_STATUS.available) {
                    webix.message('Книга не выдана')
                    return
                }

                eventModel.createTakeEvent(abstract.ID).then(() => {
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
        let submenu = $$(this.view.datatableContextMenu.getItem(ABSTRACT_CONTEXT_MENU.give).submenu)
        let employee = submenu.getItem(empItem)

        // получение выделенного элемента
        let abstract = this.view.datatable.getSelectedItem()
        if (!abstract) {
            webix.message('Выделите строку')
            return
        }
        if (!abstract.ID) {
            console.error('Incorrect ID of item:', abstract.ID)
            return
        }

        // проверка статуса книги
        if (abstract.status === ABSTRACT_STATUS.notAvailable) {
            webix.message('Книга уже выдана')
            return
        }

        eventModel.createGiveEvent(abstract.ID, employee.ID).then(() => {
            this.refreshTable()
            this.updateEventsDatatable()
        })
    }

    // функция обновления таблицы абстрактных товаров
    refreshTable(abstracts) {
        if (abstracts) {
            this.view.datatable.clearAll()
            this.view.datatable.parse(abstracts)
            return
        } else {
            abstractModel.getAbstracts().then((abstracts) => {
                // проверка наличия данных
                if (abstracts) {
                    // преобразование даты издания
                    abstracts.map((abstract) => {
                        abstract.year = new Date(abstract.year)
                    })
                }

                // заполнение таблицы окна данными книги
                this.view.datatable.clearAll()
                this.view.datatable.parse(abstracts)
            })
        }
    }

    // метод отображения таба с фильтрацией по книге
    showByAbstractID(abstractID) {
        abstractModel.getBookByID(abstractID).then((abstract) => {
            // проверка наличия данных
            if (!abstract) {
                return
            }

            // применение фильтров
            this.view.datatable.getFilter('ISBN').value = abstract.ISBN
            this.view.datatable.filterByAll()

            // выделение нужной строки
            for (let rowID = 0; rowID < this.view.datatable.serialize().length; rowID++) {
                let item = this.view.datatable.serialize()[rowID]

                if (item.ID === abstractID) {
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
    createAbstract() {
        this.window.parse(new abstract())
        this.window.switch(ABSTRACT_WINDOW_TYPE.create)
    }

    // функция изменения книги
    updateAbstract() {
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
        abstractModel.getBookByID(selected.ID).then((abstract) => {
            // проверка наличия данных
            if (!abstract) {
                return
            }

            // преобразование даты издания
            let time = new Date(abstract.year)
            abstract.year = time.getFullYear()

            // заполнение полей окна данными книги
            this.window.parse(abstract)
            this.window.switch(ABSTRACT_WINDOW_TYPE.update)
        })
    }

    // функция удаления книги
    deleteAbstract() {
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
        abstractModel.getBookByID(selected.ID).then((abstract) => {
            // проверка наличия данных
            if (!abstract) {
                return
            }
            // проверка выданности книги
            if (abstract.status === ABSTRACT_STATUS.notAvailable) {
                webix.message('Нельзя удалить выданную книгу')
                return
            }

            // преобразование даты издания
            let time = new Date(abstract.year)
            abstract.year = time.getFullYear()

            // заполнение полей окна данными книги
            this.window.parse(abstract)
            this.window.switch(ABSTRACT_WINDOW_TYPE.delete)
        })
    }
}

// допустимые значения пунктов контекстного меню таба Книги
export const ABSTRACT_CONTEXT_MENU = {
    give: 'Выдать',
    add: 'Добавить',
    edit: 'Изменить',
    remove: 'Удалить'
}