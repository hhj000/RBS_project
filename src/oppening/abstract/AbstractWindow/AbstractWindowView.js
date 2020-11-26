import { ABSTRACT_WINDOW_TYPE } from './CAbstractWindow.js';

// возвращает webix конфигурацию окна для работы с сущностью книги
export default function AbstractWindowView(type) {
    let headText = 'Книга' // текст заголовка модального окна

    switch (type) {
        case ABSTRACT_WINDOW_TYPE.create:
            headText = 'Добавление товара'
            break;
        case ABSTRACT_WINDOW_TYPE.update:
            headText = 'Редактирование товара'
            break;
        case ABSTRACT_WINDOW_TYPE.delete:
            headText = 'Удаление товара'
            break;
    }

    return {
        view: 'window',
        id: 'abstractWindow',
        head: {
            view: 'template',
            id: 'abstractWindowLabel',
            template: headText,
            css: 'webix_template'
        },
        modal: true,
        position: 'center',
        width: 400,
        body: {
            view: 'form',
            id: 'abstractWindowForm',
            elements: [
                {
                    view: 'text',
                    id: 'abstractWindowFormISBN',
                    label: 'ISBN',
                    name: 'ISBN',
                    required: true,
                    labelWidth: 150,
                },
                {
                    view: 'text',
                    id: 'abstractWindowFormName',
                    label: 'Название',
                    name: 'name',
                    required: true,
                    labelWidth: 150,
                },
                {
                    view: 'text',
                    id: 'abstractWindowFormCost',
                    label: 'Стоимость',
                    name: 'cost',
                    required: true,
                    labelWidth: 150,
                },
                {
                    view: 'text',
                    id: 'abstractWindowFormCount',
                    label: 'Количество',
                    name: 'count',
                    required: true,
                    labelWidth: 150,
                },
                {
                    view: 'text',
                    id: 'abstractWindowFormStatus',
                    label: 'Статус',
                    name: 'status',
                    disabled: true,
                    labelWidth: 150,
                },
                {
                    view: 'text',
                    id: 'abstractWindowFormWarranty',
                    label: 'Срок гарантии',
                    name: 'warranty',
                    required: true,
                    labelWidth: 150,
                },
                {
                    cols: [
                        {
                            view: 'button',
                            id: 'abstractWindowConfirmBtn',
                            value: 'Применить',
                        },
                        {
                            view: 'button',
                            id: 'abstractWindowCancelBtn',
                            value: 'Отмена',
                        },
                    ]
                },
            ]
        }
    }
}