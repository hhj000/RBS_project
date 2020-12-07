import { CATEGORY_CONTEXT_MENU } from './CCategoryTab.js';

// возвращает webix конфигурацию таба для работы с книгами
export function CategoryTabView() {
    return {
        id: 'categoryTab',
        rows: [
            {
                view: 'datatable',
                id: 'categoryTabDatatable',
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
export function CategoryTabContextMenu(employees) {
    return {
        view: 'contextmenu',
        id: 'categoryTabDatatableContextMenu',
        data: [
            {
                value: CATEGORY_CONTEXT_MENU.give,
                id: CATEGORY_CONTEXT_MENU.give,
                submenu: employees,
            },
            CATEGORY_CONTEXT_MENU.edit,
            CATEGORY_CONTEXT_MENU.remove
        ],
    }
}

// элементы управления для таба
export function TabControllsView() {
    return {
        id: 'categoryTab-controlls',
        hidden: true,
        cols: [
            {
                id: 'categoryTab-add-btn',
                view: 'icon',
                tooltip: 'Добавить',
                icon: 'plus',
                width: 30,
            },
            {
                id: 'categoryTab-edit-btn',
                view: 'icon',
                tooltip: 'Редактировать',
                icon: 'pencil',
                width: 30,
            },
            {
                id: 'categoryTab-remove-btn',
                view: 'icon',
                tooltip: 'Удалить',
                icon: 'trash',
                width: 30,
            },
            { width: 30 },
        ]
    }
}