// возвращает webix конфигурацию рабочего пространства приложения
export default function WorkedPlaceView(bookTab, employeeTab, journalTab, userInfo) {
    return {
        id: 'workedPlace',
        rows: [
            // header
            userInfo.config(),
            {
                id: 'main',
                cols: [
                    {
                        view: 'tabbar',
                        id: 'main-tabbar',
                        value: 'listView',
                        width: 600,
                        multiview: true,
                        options: [
                            { id: 'abstractTab', value: 'Сотрудники' },
                            { id: 'categoryTab', value: 'Транзакции' },
                            { id: 'concreteTab', value: 'Товары' },
							{ id: 'employeeTab', value: 'Экземпляры' },
							{ id: 'shoppingCart', value: 'Категории' },
							{ id: 'transactionTab', value: 'Категории' }
                        ]

                    },
                    {},
                    {
                        id: 'tab-controlls',
                        rows: [
                            abstractTab.configTabControlls(),
                            categoryTab.configTabControlls(),
                            concreteTab.configTabControlls(),
							employeeTab.configTabControlls(),
							shoppingCart.configTabControlls(),
							transactionTab.configTabControlls(),
                        ]
                    }, // элементы управления табов
                ],
            },
            // содержимое табов
            {
                view: 'multiview',
                id: 'main-views',
                cells: [
                    abstractTab.config(),
                    categoryTab.config(),
                    concreteTab.config(),
					employeeTab.config(),
					shoppingCart.config(),
					transactionTab.config()
                ]
            },
        ],
    }
}