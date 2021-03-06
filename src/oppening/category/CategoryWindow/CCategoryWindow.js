import CategoryWindowView from './CategoryWindowView.js'
import categoryModel from './../../../models/categoryModel.js'

// компонент окна для работы с сущностью книги
export class CCategoryWindow {
    constructor() {
        this.view       // объект для быстрого доступа к представлениям
        this.type       // тип текущего отображения окна
        this.onChange   // callback функция при CUD операциях над книгой
    }

    // метод инициализации компонента
    init(onChange) {
        this.onChange = onChange // callback функция при CUD операциях над книгой
    }

    // метод получения webix конфигурации компонента
    config() {
        return CategoryWindowView()
    }

    // метод инициализации обработчиков событий компонента
    attachEvents() {
        // инициализация используемых представлений
        this.view = {
            window: $$('categoryWindow'),
            windowLabel: $$('categoryWindowLabel'),
            windowCancelBtn: $$('categoryWindowCancelBtn'),
            windowConfirmBtn: $$('categoryWindowConfirmBtn'),
            form: $$('categoryWindowForm'),
            formfields: {
                ISBN: $$('categoryWindowFormISBN'),
                name: $$('categoryWindowFormName'),
            //    cost: $$('categoryWindowFormAuthor'),
            //    count: $$('categoryWindowFormPublisher'),
            //    status: $$('categoryWindowFormStatus'),
            //    warranty: $$('categoryWindowFormYear'),
            }
        }

        // обработка закрытия окна
        this.view.windowCancelBtn.attachEvent('onItemClick', () => {
            this.view.window.hide()
        })

        // обработка события 'принять'
        this.view.windowConfirmBtn.attachEvent('onItemClick', () => {
            // валидация введенных данных по обязательным полям
            if (!this.validate()) {
                webix.message('Заполните поля отмеченные *', 'error')
                return;
            }

            switch (this.type) {
                case CATEGORY_WINDOW_TYPE.create:
                    categoryModel.createCategory(this.fetch()).then(() => {
                        this.onChange()
                        this.hide()
                    })
                    break;
                case CATEGORY_WINDOW_TYPE.update:
                    categoryModel.updateCategory(this.fetch()).then(() => {
                        this.onChange()
                        this.hide()
                    })
                    break;
                case CATEGORY_WINDOW_TYPE.delete:
                    categoryModel.deleteCategory(this.fetch()).then(() => {
                        this.onChange()
                        this.hide()
                    })
                    break;
            }
        })
    }

    // метод вызова модального окна
    switch(type) {
        switch (this.view.window.isVisible()) {
            case true:
                this.hide()
                break;
            case false:
                this.show(type)
                break;
        }
    }

    // метод отображения окна
    show(type) {
        switch (type) {
            case CATEGORY_WINDOW_TYPE.create:
                this.view.windowLabel.setHTML('Добавление книги')
                this.view.formfields.status.hide()
                this.view.window.resize()
                break;
            case CATEGORY_WINDOW_TYPE.update:
                this.view.windowLabel.setHTML('Редактирование книги')
                break;
            case CATEGORY_WINDOW_TYPE.delete:
                this.view.windowLabel.setHTML('Удаление книги')
                this.view.formfields.ISBN.disable()
                this.view.formfields.name.disable()
            //    this.view.formfields.cost.disable()
            //    this.view.formfields.count.disable()
            //    this.view.formfields.status.disable()
            //    this.view.formfields.warranty.disable()
                this.view.window.resize()
                break;
            default:
                console.error('Неизвестный тип отображения окна для работы с сущностью абстрактного товара');
                return;
        }

        this.type = type
        this.view.window.show()
    }

    // метод сокрытия окна
    hide() {
        this.view.window.hide()
    }

    // метод получения сущности из формы окна
    fetch() {
        return this.view.form.getValues()
    }

    // метод размещения сущности в форме окна
    parse(values) {
        this.view.form.setValues(values)
    }

    // функция валидации формы
    validate() {
        let isValid = false

        // удаление пробелов в полях формы
        this.view.formfields.ISBN.setValue(this.view.formfields.ISBN.getValue().trim())
        this.view.formfields.ISBN.setValue(this.view.formfields.ISBN.getValue().replace(/-/g, ''))
        this.view.formfields.name.setValue(this.view.formfields.name.getValue().trim())
    //    this.view.formfields.cost.setValue(this.view.formfields.cost.getValue().trim())
    //    this.view.formfields.count.setValue(this.view.formfields.count.getValue().trim())
     //   this.view.formfields.warranty.setValue(this.view.formfields.warranty.getValue().trim())

        // проверка длины isbn
        if (this.view.formfields.ISBN.getValue().length > 13) {
            webix.message('ISBN не может превышать 13 символов', 'error')
            return
        }

        // валидация webix
        isValid = this.view.form.validate()

        return isValid
    }
}

// типы отображения модального окна для работы с сущностью категории
export const CATEGORY_WINDOW_TYPE = {
    create: 'CREATE',
    update: 'UPDATE',
    delete: 'DELETe',
}