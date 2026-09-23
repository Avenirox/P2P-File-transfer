import { useEffect, useState } from "react";
import { useLanguage } from "../locales/LoginContext";
import { Check, Languages, Menu, Moon, Sun } from "lucide-react";
import P2PLogo1 from '../assets/P2P_logo_1.png'

interface NavProps {
    selectedPage: (page: selectedPageTypes) => void,
    currentPage: selectedPageTypes
}

export type selectedPageTypes = 'home' | 'send' | 'get'

function Navbar({ selectedPage: onPageChange, currentPage }: NavProps) {
    const [isChangeLangOpen, setIsChangeLangOpen] = useState<boolean>(false)
    const {language, setLanguage, t} = useLanguage()

    const [selectedPage, setSelectedPage] = useState<selectedPageTypes>(currentPage)
    useEffect(() => {
        setSelectedPage(currentPage)
    }, [currentPage])

    const [Darkmode, setDarkMode] = useState<boolean>(() => {
        return localStorage.getItem('Dark_mode') === 'true' || false
    })
    const [hamMenu, setHamMenu] = useState<boolean>(false)

    useEffect(() => {
        const root = document.documentElement.classList
        if (Darkmode) {
            root.add('dark')
        }
        else {
            root.remove('dark')
        }
        localStorage.setItem('Dark_mode', String(Darkmode))
    }, [Darkmode])

    const handlePageChange = (type: selectedPageTypes) => {
        setSelectedPage(type)
        onPageChange(type)
        setHamMenu(false)
    }

    const LANGUAGEBUTTONSDATA = [
        { lang: 'en', label: 'English US'},
        { lang: 'pl', label: 'Polski'}
    ]
    const NAVTABS = [
        { type: 'home', label: t('nav.btns.home')},
        { type: 'send', label: t('nav.btns.send')},
    ]
    return (
        <>
            <div className="w-[100dvw] h-20 fixed z-9999 top-0">
                <div className="w-full h-full bg-[color-mix(in_srgb,var(--color-p2p-secondary)_20%,white)] dark:bg-zinc-900">
                    <div className="w-full h-full grid grid-cols-[1fr_auto_1fr] gap-7 md:gap-0 justify-center items-center px-30">
                        <div>
                            <img src={P2PLogo1} alt="P2P logo 1" className="md:max-w-40 max-w-32"/>
                        </div>
                        <div>
                            <ul className="text-p2p-dark text-font-sans gap-4 md:flex hidden">
                                {NAVTABS.map(nav => (
                                    <li
                                        key={nav.type}
                                        onClick={() => {handlePageChange(nav.type as selectedPageTypes);}}
                                        className={`bg-p2p-secondary/40 py-2 px-4 rounded-2xl cursor-pointer hover:bg-p2p-secondary/50 hover:shadow-[0_0_10px_rgba(0,0,0,0.3)] ${selectedPage === nav.type ? 'opacity-100' : 'opacity-80'} dark:bg-p2p-secondary dark:hover:bg-p2p-primary transition-bg-shadow duration-300`}>
                                        {nav.label}
                                    </li>
                                ))}
                            </ul>
                            <div className="md:hidden relative">
                                <button
                                    className={`bg-p2p-secondary/40 py-2 px-4 rounded-2xl cursor-pointer hover:bg-p2p-secondary/50 hover:shadow-[0_0_10px_rgba(0,0,0,0.3)] dark:bg-p2p-secondary transition-bg-shadow duration-300 dark:hover:bg-p2p-primary`}
                                    onClick={() => setHamMenu(!hamMenu)}>
                                    <Menu />
                                </button>
                                {hamMenu && (
                                    <div className="absolute left-1/2 -translate-1/2 mt-12 w-[100dvw] text-center bg-[color-mix(in_srgb,var(--color-p2p-secondary)_20%,white)] flex justify-center gap-4 dark:bg-zinc-900 p-2">
                                      {NAVTABS.map((nav) => (
                                        <button
                                            key={nav.type}
                                            className={`bg-p2p-secondary/40 py-2 px-4 rounded-2xl cursor-pointer hover:bg-p2p-secondary/50 hover:shadow-[0_0_10px_rgba(0,0,0,0.3)] ${selectedPage === nav.type ? 'opacity-100' : 'opacity-80'} dark:bg-p2p-secondary transition-bg-shadow duration-300`}
                                            onClick={() => {handlePageChange(nav.type as selectedPageTypes)}}>
                                            {nav.label}
                                        </button>
                                      ))}  
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="justify-self-end flex gap-4">
                            <div className="relative">
                                <button 
                                    className="rounded-2xl bg-p2p-secondary/50 text-font-sans text-lg py-2 px-4 cursor-pointer hover:bg-p2p-secondary/60 hover:shadow-[0_0_10px_rgba(0,0,0,0.3)] dark:bg-p2p-secondary transition-bg-shadow duration-300"
                                    onClick={() => setIsChangeLangOpen(!isChangeLangOpen)}
                                    type="button">
                                    <Languages />
                                </button>
                                {isChangeLangOpen && 
                                    <div className="min-w-[200px] absolute left-1/2 -translate-x-1/2 bg-p2p-bg m-2 w-full rounded shadow-[0_0_10px_rgba(0,0,0,0.3)] dark:bg-zinc-800">
                                        <div className="flex flex-col items-center justify-center gap-2 m-2">
                                            {LANGUAGEBUTTONSDATA.map(btn => (
                                                <button
                                                    key={btn.lang}
                                                    className="w-full px-4 py-2 bg-p2p-secondary/40 rounded flex items-center justify-center gap-2 cursor-pointer hover:bg-p2p-secondary/50 dark:bg-p2p-secondary"
                                                    onClick={() => {
                                                        setLanguage(btn.lang)
                                                        setIsChangeLangOpen(false)
                                                    }}>
                                                    {btn.label}{language === btn.lang && <Check />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                }
                            </div>
                            <button
                                className="rounded-2xl bg-p2p-secondary/50 text-font-sans text-lg py-2 px-4 cursor-pointer hover:bg-p2p-secondary/60 hover:shadow-[0_0_10px_rgba(0,0,0,0.3)] dark:bg-p2p-secondary transition-bg-shadow duration-300"
                                onClick={() => {setDarkMode(!Darkmode);}}
                            >
                                {!Darkmode ? <Moon /> : <Sun />}
                            </button>                        
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Navbar