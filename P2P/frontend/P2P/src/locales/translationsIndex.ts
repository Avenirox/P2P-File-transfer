import navPL from './pl/home_page/navbar'
import navEN from './en/home_page/navbar'

import HomePL from './pl/home_page/HomePage'
import HomeEN from './en/home_page/HomePage'

import SendPL from './pl/send_page/SendPage'
import SendEN from './en/send_page/SendPage'

import TitlePL from './pl/Others/titles'
import TitleEN from './en/Others/titles'

export default {
    pl: {
        nav: navPL,
        home: HomePL,
        send: SendPL,
        title: TitlePL
    },
    en: {
        nav: navEN,
        home: HomeEN,
        send: SendEN,
        title: TitleEN
    }
}