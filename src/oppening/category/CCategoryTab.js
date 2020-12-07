import { CategoryTabView, CategoryTabContextMenu, TabControllsView } from './CategoryTab.js'
import { CategoryTabWindow, Category_WINDOW_TYPE } from './CategoryWindow/CCategoryWindow.js'

import abstractModel from '../../models/abstractModel.js'
import categoryModel from '../../models/categoryModel.js'
import concreteModel from '../../models/concreteModel.js'
import employeeModel from '../../models/employeeModel.js'
import shoppingCartModel from '../../models/shoppingCartModel.js'
import transactionModel from '../../models/transactionModel.js'

// класс таба 'Абстрактные товары'
export class CCategoryTab {
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

        this.window = new CCategoryWindow() // инициализация компонента окна
        this.window.init(
            () => { this.refreshTable() }
        ) // вызова инициализации компонента окна

        this.names = [] // массив сотрудников в сабменю
    }

    // метод получения webix конфигурации компонента
    config() {
        // т.к. window и popup расположены не в дереве приложения, а поверх слоев, его нужно отрисовывать отдельно
        webix.ui(this.window.config())
        webix.ui(CategoryTabContextMenu(this.names))

        // вызов функции представления
        return CategoryTabView()
    }

    // метод получения webix конфигурации элементов управления таба
    configTabControlls() {
        return TabControllsView()
    }

    // метод инициализации обработчиков событий компонента
    attachEvents() {
        // инициализация используемых представлений
        this.view = {
            datatable: $$('categoryTabDatatable'),
            datatableContextMenu: $$('categoryTabDatatableContextMenu'),
            controlls: $$('categorytab-controlls'),
            btns: {
                createBtn: $$('categorytab-add-btn'),
                updateBtn: $$('categorytab-edit-btn'),
                deleteBtn: $$('categorytab-remove-btn'),
            }
        }

        // создание абстрактного товара
        this.view.btns.createBtn.attachEvent('onItemClick', () => {
            this.createCategory()
        })

        // изменение абстрактного товара
        this.view.btns.updateBtn.attachEvent('onItemClick', () => {
            this.updateCategory()
        })

        // удаление абстрактного товара
        this.view.btns.deleteBtn.attachEvent('onItemClick', () => {
            this.deleteCategory()
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
            case CATEGORY_CONTEXT_MENU.edit: // редактирование выделленой книгиbreak
                this.updateCategory()
                break
            case CATEGORY_CONTEXT_MENU.remove: // удаление выделенной книгиbreak
                this.deleteCategory()
                break
            case CATEGORY_CONTEXT_MENU.take: // добавление книги
                // получение выделенного элемента
                let category = this.view.datatable.getSelectedItem()
                if (!category) {
                    webix.message('Выделите строку')
                    return
                }
                if (!category.ID) {
                    console.error('Incorrect ID of item:', category.ID)
                    return
                }

                // проверка статуса книги
                if (category.status === CATEGORY_STATUS.available) {
                    webix.message('Товар не выдан')
                    return
                }

                eventModel.createTakeEvent(category.ID).then(() => {
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
        let submenu = $$(this.view.datatableContextMenu.getItem(CATEGORY_CONTEXT_MENU.give).submenu)
        let employee = submenu.getItem(empItem)

        // получение выделенного элемента
        let category = this.view.datatable.getSelectedItem()
        if (!category) {
            webix.message('Выделите строку')
            return
        }
        if (!category.ID) {
            console.error('Incorrect ID of item:', category.ID)
            return
        }

        // проверка статуса товара
        if (category.status === CATEGORY_STATUS.notAvailable) {
            webix.message('Книга уже выдана')
            return
        }

        eventModel.createGiveEvent(category.ID, employee.ID).then(() => {
            this.refreshTable()
            this.updateEventsDatatable()
        })
    }

    // функция обновления таблицы абстрактных товаров
    refreshTable(categorys) {
        if (categorys) {
            this.view.datatable.clearAll()
            this.view.datatable.parse(categorys)
            return
        } else {
            categoryModel.getCategorys().then((categorys) => {
                // проверка наличия данных
                if (categorys) {
                    // преобразование даты издания
                    categorys.map((category) => {
                        category.year = new Date(category.year)
                    })
                }

                // заполнение таблицы окна данными книги
                this.view.datatable.clearAll()
                this.view.datatable.parse(categorys)
            })
        }
    }

    // метод отображения таба с фильтрацией по книге
    showByCategoryID(categoryID) {
        categoryModel.getBookByID(categoryID).then((category) => {
            // проверка наличия данных
            if (!category) {
                return
            }

            // применение фильтров
            this.view.datatable.getFilter('ISBN').value = category.ISBN
            this.view.datatable.filterByAll()

            // выделение нужной строки
            for (let rowID = 0; rowID < this.view.datatable.serialize().length; rowID++) {
                let item = this.view.datatable.serialize()[rowID]

                if (item.ID === categoryID) {
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
    createCategory() {
        this.window.parse(new category())
        this.window.switch(CATEGORY_WINDOW_TYPE.create)
    }

    // функция изменения книги
    updateCategory() {
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
        categoryModel.getBookByID(selected.ID).then((category) => {
            // проверка наличия данных
            if (!category) {
                return
            }

            // преобразование даты издания
            let time = new Date(category.year)
            category.year = time.getFullYear()

            // заполнение полей окна данными книги
            this.window.parse(category)
            this.window.switch(CATEGORY_WINDOW_TYPE.update)
        })
    }

    // функция удаления книги
    deleteCategory() {
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
        categoryModel.getCategoryByID(selected.ID).then((category) => {
            // проверка наличия данных
            if (!category) {
                return
            }
            // проверка выданности книги
            if (category.status === CATEGORY_STATUS.notAvailable) {
                webix.message('Нельзя удалить выданный товар')
                return
            }

            // преобразование даты издания
            let time = new Date(category.year)
            category.year = time.getFullYear()

            // заполнение полей окна данными книги
            this.window.parse(category)
            this.window.switch(CATEGORY_WINDOW_TYPE.delete)
        })
    }
}

// допустимые значения пунктов контекстного меню таба Книги
export const CATEGORY_CONTEXT_MENU = {
    give: 'Выдать',
    add: 'Добавить',
    edit: 'Изменить',
    remove: 'Удалить'
}