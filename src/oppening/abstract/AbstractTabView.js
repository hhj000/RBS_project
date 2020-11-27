import { ABSTRACT_CONTEXT_MENU } from './CAbstractTab.js';

// возвращает webix конфигурацию таба для работы с книгами
export function AbstractTabView() {
    return {
        id: 'abstractTab',
        rows: [
            {
                view: 'datatable',
                id: 'abstractTabDatatable',
                select: true,
                columns: [
                    { id: 'ID', header: ['', { content: 'textFilter' }], hidden: true },
                    { id: 'ISBN', header: ['ISBN', { content: 'textFilter' }], sort: 'string', width: 140, },
                    { id: 'name', header: ['Название', { content: 'textFilter' }], sort: 'string', fillspace: true, },
                    { id: 'cost', header: ['Стоимость', { content: 'textFilter' }], sort: 'string', fillspace: true, },
                    { id: 'count', header: ['Количество', { content: 'textFilter' }], sort: 'string', fillspace: true, },
					{ id: 'status', header: ['Статус', { content: 'selectFilter' }], sort: 'string', width: 120, },
                    { id: 'warranty', header: ['Срок гарантии', { content: 'textFilter' }], sort: 'date', format: webix.Date.dateToStr("%Y"), width: 80, },
                ],
                data: [],
                onContext: {},
            },
        ]
    }
}

// возвращает webix конфигурацию контекстного меню таба
export function AbstractTabContextMenu(employees) {
    return {
        view: 'contextmenu',
        id: 'abstractTabDatatableContextMenu',
        data: [
            {
                value: ABSTRACT_CONTEXT_MENU.give,
                id: ABSTRACT_CONTEXT_MENU.give,
                submenu: employees,
            },
            ABSTRACT_CONTEXT_MENU.edit,
            ABSTRACT_CONTEXT_MENU.remove
        ],
    }
}

// элементы управления для таба
export function TabControllsView() {
    return {
        id: 'abstractTab-controlls',
        hidden: true,
        cols: [
            {
                id: 'abstractTab-add-btn',
                view: 'icon',
                tooltip: 'Добавить',
                icon: 'plus',
                width: 30,
            },
            {
                id: 'abstractTab-edit-btn',
                view: 'icon',
                tooltip: 'Редактировать',
                icon: 'pencil',
                width: 30,
            },
            {
                id: 'abstractTab-remove-btn',
                view: 'icon',
                tooltip: 'Удалить',
                icon: 'trash',
                width: 30,
            },
            { width: 30 },
        ]
    }
}