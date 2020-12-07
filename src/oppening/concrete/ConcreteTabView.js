import { CONCRETE_CONTEXT_MENU } from './CConcreteTab.js';

// возвращает webix конфигурацию таба для работы с книгами
export function ConcreteTabView() {
    return {
        id: 'concreteTab',
        rows: [
            {
                view: 'datatable',
                id: 'concreteTabDatatable',
                select: true,
                columns: [
                    { id: 'ID', header: ['', { content: 'textFilter' }], hidden: true },
                    { id: 'ISBN', header: ['ISBN', { content: 'textFilter' }], sort: 'string', width: 140, },
                    { id: 'name', header: ['Название', { content: 'textFilter' }], sort: 'string', fillspace: true, },
            //        { id: 'cost', header: ['Стоимость', { content: 'textFilter' }], sort: 'string', fillspace: true, },
            //        { id: 'count', header: ['Количество', { content: 'textFilter' }], sort: 'string', fillspace: true, },
            //        { id: 'status', header: ['Статус', { content: 'selectFilter' }], sort: 'string', width: 120, },
			//		{ id: 'warranty', header: ['Гарантия', { content: 'textFilter' }], sort: 'date', format: webix.Date.dateToStr("%Y"), width: 80, },
				],
                data: [],
                onContext: {},
            },
        ]
    }
}

// возвращает webix конфигурацию контекстного меню таба
export function ConcreteTabContextMenu(employees) {
    return {
        view: 'contextmenu',
        id: 'concreteTabDatatableContextMenu',
        data: [
            {
                value: CONCRETE_CONTEXT_MENU.give,
                id: CONCRETE_CONTEXT_MENU.give,
                submenu: employees,
            },
            CONCRETE_CONTEXT_MENU.edit,
            CONCRETE_CONTEXT_MENU.remove
        ],
    }
}

// элементы управления для таба
export function TabControllsView() {
    return {
        id: 'concreteTab-controlls',
        hidden: true,
        cols: [
            {
                id: 'concreteTab-add-btn',
                view: 'icon',
                tooltip: 'Добавить',
                icon: 'plus',
                width: 30,
            },
            {
                id: 'concreteTab-edit-btn',
                view: 'icon',
                tooltip: 'Редактировать',
                icon: 'pencil',
                width: 30,
            },
            {
                id: 'concreteTab-remove-btn',
                view: 'icon',
                tooltip: 'Удалить',
                icon: 'trash',
                width: 30,
            },
            { width: 30 },
        ]
    }
}