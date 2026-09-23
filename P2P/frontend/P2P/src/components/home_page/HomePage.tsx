import { useEffect, useState } from 'react';
import P2Plogo2 from '../../assets/P2P_logo_2.png'
import Github from '../../assets/github.png'
import AveniroxLogo from '../../assets/avenirox.png'
import { useLanguage } from "../../locales/LoginContext";
import { ChartColumnStacked, ChevronDown, ChevronUp, CircleQuestionMark, CodeXml, EyeOff, Gauge, GlobeLock, Key, Lock, MessageCircleQuestionMark, SectionIcon, ShieldCheck, UserShield } from 'lucide-react';

interface HomePagesProps {
    selectedPage: (page: PagesHomeTypes) => void
}

type PagesHomeTypes = 'get' | 'send' | 'home'
type OpenIndexTypes = 0 | 1 | 2 | 3 | 4 | 5 | null

function HomePage({ selectedPage: onPageChange}: HomePagesProps) {
    const {t} = useLanguage()
    const [selectedPage, setSelectedPage] = useState<PagesHomeTypes>('home')
    const [openIndex, setOpenIndex] = useState<OpenIndexTypes>(null)

    const SECTION1BUTTONS = [
        {type: 'send', label: t('home.send')},
    ]

    const HOWITWORKSSECTIONCOLS = [
        { header: t('home.howItWorksCol.header1'), subHeader: t('home.howItWorksCol.subHeader1') },
        { header: t('home.howItWorksCol.header2'), subHeader: t('home.howItWorksCol.subHeader2') },
        { header: t('home.howItWorksCol.header3'), subHeader: t('home.howItWorksCol.subHeader3') },
        { header: t('home.howItWorksCol.header4'), subHeader: t('home.howItWorksCol.subHeader4') },
        { header: t('home.howItWorksCol.header5'), subHeader: t('home.howItWorksCol.subHeader5') },
        { header: t('home.howItWorksCol.header6'), subHeader: t('home.howItWorksCol.subHeader6') },
        { header: t('home.howItWorksCol.header7'), subHeader: t('home.howItWorksCol.subHeader7') },
    ]

    const PRIVATESECTIONSCOLS = [
        { header: t('home.privateCol.header1'), subHeader: t('home.privateCol.subHeader1'), icon: <GlobeLock size={50} color='#1d67de'/>},
        { header: t('home.privateCol.header2'), subHeader: t('home.privateCol.subHeader2'), icon: <Key size={50} color='#1d67de'/>},
        { header: t('home.privateCol.header3'), subHeader: t('home.privateCol.subHeader3'), icon: <EyeOff size={50} color='#1d67de'/>}
    ]

    const COMPIRASIONTABLECOLS = [
        { char: t('home.comparisonCol.tableHeader1'), P2P: t('home.comparisonCol.p2p1'), cloud: t('home.comparisonCol.cloud1')},
        { char: t('home.comparisonCol.tableHeader2'), P2P: t('home.comparisonCol.p2p2'), cloud: t('home.comparisonCol.cloud2')},
        { char: t('home.comparisonCol.tableHeader3'), P2P: t('home.comparisonCol.p2p3'), cloud: t('home.comparisonCol.cloud3')},
        { char: t('home.comparisonCol.tableHeader4'), P2P: t('home.comparisonCol.p2p4'), cloud: t('home.comparisonCol.cloud4')},
        { char: t('home.comparisonCol.tableHeader5'), P2P: t('home.comparisonCol.p2p5'), cloud: t('home.comparisonCol.cloud5')}
    ]

    const QUESTIONSCOLS = [
        { question: t('home.questions.question1'), reply: t('home.questions.reply1') },
        { question: t('home.questions.question2'), reply: t('home.questions.reply2') },
        { question: t('home.questions.question3'), reply: t('home.questions.reply3') },
        { question: t('home.questions.question4'), reply: t('home.questions.reply4') },
        { question: t('home.questions.question5'), reply: t('home.questions.reply5') },
        { question: t('home.questions.question6'), reply: t('home.questions.reply6') }
    ]

    const handleChangePage = (type: PagesHomeTypes) => {
        setSelectedPage(type)
        onPageChange(type)
    }

    const handleOpenIndex = (index: OpenIndexTypes) => {
        if (openIndex === index) {
            setOpenIndex(null)
        }
        else {
            setOpenIndex(index)
        }
    }

    useEffect(() => {
        const animateObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.remove("opacity-0", "translate-y-7")
                    entry.target.classList.add("opacity-100", "translate-y-0")
                }
            })
        })
        document.querySelectorAll('.animate-on-scroll')
        .forEach((el) => animateObserver.observe(el))
        
        return () => animateObserver.disconnect()
    }, [])

    return (
        <>
            <div className="w-[100dvw] h-[100dvh] overflow-x-hidden pt-30 dark:bg-zinc-800 dark:text-white">
                <div className="flex flex-col justify-center items-center gap-10">
                    <div className="md:w-[calc(100%-200px)] h-full bg-p2p-bg dark:bg-zinc-900 animate-on-scroll opacity-0 translate-y-10 transition-all duration-1500">
                        <div className="flex flex-col justify-center items-center w-full h-full p-4 shadow-[0_0_12px_rgba(0,0,0,0.3)]">
                            <img 
                                src={P2Plogo2} 
                                alt="P2P logo 2" 
                                className="w-30 my-5"
                            />
                            <h1 className="text-center text-font-sans text-2xl m-2">{t('home.header')}</h1>
                            <h2 className="text-center text-font-sans text-xl max-w-[80ch] m-2">{t('home.subHeader')}</h2>
                            <div className='flex gap-4 my-4'>
                                {SECTION1BUTTONS.map(btn => (
                                    <button
                                        key={btn.type}
                                        className='py-2 px-4 bg-p2p-secondary/40 rounded-2xl cursor-pointer hover:bg-p2p-secondary/50 hover:shadow-[0_0_10px_rgba(0,0,0,0.3)] dark:text-black dark:bg-p2p-secondary dark:hover:bg-p2p-primary transition-bg-shadow duration-300'
                                        onClick={() => handleChangePage(btn.type as PagesHomeTypes)}>
                                        {btn.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="md:w-[calc(100%-200px)] h-full bg-p2p-bg dark:bg-zinc-900 animate-on-scroll opacity-0 translate-y-10 transition-all duration-1500">
                        <div className='flex flex-col justify-center items-center w-full h-full p-4 shadow-[0_0_12px_rgba(0,0,0,0.3)]'>
                            <h2 className='text-center text-font-sans text-2xl m-2 flex flex-col items-center gap-4'><Lock size={60} color='#3b82f6'/> {t('home.header2')}</h2>
                            <div className='grid md:grid-cols-3 grid-cols-1 mt-6 gap-8'>
                                {PRIVATESECTIONSCOLS.map((section, index) => (
                                    <div className='flex flex-col justify-center items-center gap-4 p-8 bg-p2p-secondary/20 rounded-2xl' key={index}>
                                        {section.icon}
                                        <h2 className='text-2xl'>{section.header}</h2>
                                        <h3 className='text-xl text-center'>{section.subHeader}</h3>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className='md:w-[calc(100%-200px)] h-full bg-p2p-bg dark:bg-zinc-900 animate-on-scroll opacity-0 translate-y-10 transition-all duration-1500'>
                        <div className='flex flex-col justify-center items-center w-full h-full p-4 shadow-[0_0_12px_rgba(0,0,0,0.3)]'>
                            <h2 className='text-center text-font-sans text-2xl m-2 flex flex-col items-center gap-4'><ShieldCheck size={60} color='#3b82f6'/> {t('home.header3')}</h2>
                            <h3 className='text-center text-font-sans text-xl m-2 max-w-[80ch]'>{t('home.subHeader3')}</h3>
                        </div>
                    </div>
                    <div className='md:w-[calc(100%-200px)] h-full bg-p2p-bg dark:bg-zinc-900 animate-on-scroll opacity-0 translate-y-10 transition-all duration-1500'>
                        <div className='flex flex-col justify-center items-center w-full h-full p-4 shadow-[0_0_12px_rgba(0,0,0,0.3)]'>
                            <h2 className='text-center text-font-sans text-2xl m-2 flex flex-col items-center gap-4'><CircleQuestionMark size={60} color='#3b82f6'/>{t('home.header4')}</h2>
                            <div className='grid grid-cols-[repeat(auto-fit,_minmax(350px,_1fr))] mt-6'>
                                {HOWITWORKSSECTIONCOLS.map((section, index) => (
                                    <div key={index} className={`flex flex-col justify-center items-center gap-4 p-8 m-4 rounded-2xl bg-p2p-secondary/20`}>
                                        <span className='text-3xl text-center font-bold text-[#3b82f6]'>{String(index + 1) + "."}</span>
                                        <h2 className='text-2xl text-center'>{section.header}</h2>
                                        <h3 className='text-xl text-center'>{section.subHeader}</h3>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className='md:w-[calc(100%-200px)] h-full bg-p2p-bg dark:bg-zinc-900 animate-on-scroll opacity-0 translate-y-10 transition-all duration-1500'>
                        <div className='flex flex-col justify-center items-center w-full h-full p-4 shadow-[0_0_12px_rgba(0,0,0,0.3)]'>
                            <h2 className='text-center text-font-sans text-2xl m-2 flex flex-col items-center gap-4'><CodeXml size={60} color='#3b82f6'/> {t('home.header5')}</h2>
                            <h3 className='text-center text-font-sans text-xl m-2 max-w-[80ch]'>{t('home.subHeader5')}</h3>
                            <a 
                                target='_blank'
                                href="https://github.com/Avenirox/P2P-File-transfer.git"
                                className='py-2 px-4 bg-p2p-secondary/40 rounded-2xl cursor-pointer hover:bg-p2p-secondary/50 hover:shadow-[0_0_10px_rgba(0,0,0,0.3)] mt-4 dark:text-black dark:bg-p2p-secondary dark:hover:bg-p2p-primary transition-bg-shadow duration-300'>
                                {t('home.openSource')}
                            </a>
                        </div>
                    </div>
                    <div className='md:w-[calc(100%-200px)] h-full bg-p2p-bg dark:bg-zinc-900 animate-on-scroll opacity-0 translate-y-10 transition-all duration-1500'>
                        <div className='flex flex-col justify-center items-center w-full h-full p-4 shadow-[0_0_12px_rgba(0,0,0,0.3)]'>
                            <h2 className='text-center text-font-sans text-2xl m-2 flex flex-col items-center gap-4'><UserShield size={60} color='#3b82f6'/> {t('home.header6')}</h2>
                            <h3 className='text-center text-font-sans text-xl m-2 max-w-[80ch]'>{t('home.subHeader6')}</h3>
                        </div>
                    </div>
                    <div className='md:w-[calc(100%-200px)] h-full bg-p2p-bg dark:bg-zinc-900 animate-on-scroll opacity-0 translate-y-10 transition-all duration-1500'>
                        <div className='flex flex-col justify-center items-center w-full h-full p-4 shadow-[0_0_12px_rgba(0,0,0,0.3)]'>
                            <h2 className='text-center text-font-sans text-2xl m-2 flex flex-col items-center gap-4'><Gauge size={60} color='#3b92f6'/> {t('home.header7')}</h2>
                            <h3 className='text-center text-font-sans text-xl m-2 max-w-[80ch]'>{t('home.subHeader7')}</h3>
                        </div>
                    </div>
                    <div className='md:w-[calc(100%-200px)] w-full h-full bg-p2p-bg dark:bg-zinc-900 animate-on-scroll opacity-0 translate-y-10 transition-all duration-1500'>
                        <div className='flex flex-col justify-center md:items-center w-full h-full p-4 shadow-[0_0_12px_rgba(0,0,0,0.3)]'>
                            <h2 className='text-center text-font-sans text-2xl m-2 flex flex-col items-center gap-4'><ChartColumnStacked size={60} color='#3b82f6'/> {t('home.header8')}</h2>
                            <div className='w-full md:m-5 p-5'>
                                <div className='w-full overflow-x-auto'>
                                    <table className='w-full min-w-max'>
                                        <thead>
                                            <tr className='bg-p2p-primary/40 p-2 rounded text-xl font-bold'>
                                                <th className='p-3'>{t('home.comparisonCol.header1')}</th>
                                                <th className='p-3'>{t('home.comparisonCol.header2')}</th>
                                                <th className='p-3'>{t('home.comparisonCol.header3')}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {COMPIRASIONTABLECOLS.map((col, index) => (
                                                <tr key={index} className='odd:bg-p2p-secondary/20'>
                                                    <td className='p-5 bg-p2p-primary/20'>{col.char}</td>
                                                    <td className='p-5'>{col.P2P}</td>
                                                    <td className='p-5'>{col.cloud}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='md:w-[calc(100%-200px)] h-full bg-p2p-bg dark:bg-zinc-900 animate-on-scroll opacity-0 translate-y-10 transition-all duration-1500'>
                        <div className='flex flex-col justify-center items-center w-full h-full p-4 shadow-[0_0_12px_rgba(0,0,0,0.3)]'>
                            <h2 className='text-center text-font-sans text-2xl flex flex-col items-center gap-4'><MessageCircleQuestionMark size={60} color='#3b82f6'/> {t('home.header9')}</h2>
                                {QUESTIONSCOLS.map((question, index) => (
                                    <div key={index} className='flex flex-col w-full h-full p-7'>
                                        <h3 className='text-xl cursor-pointer flex items-center gap-5 w-fit' 
                                            onClick={() => handleOpenIndex(index as OpenIndexTypes)}>
                                            {question.question} 
                                            <button
                                                className='cursor-pointer p-5' 
                                                onClick={() => handleOpenIndex(index as OpenIndexTypes)}>
                                                {openIndex === index ? <ChevronUp /> : <ChevronDown />}
                                            </button>
                                        </h3>
                                        {openIndex === index && (
                                            <h4 className={`text-lg mt-5`}>{question.reply}</h4>
                                        )}
                                        <span className='block w-full h-[4px] bg-gray-300'></span> 
                                    </div>
                                ))}
                        </div>
                    </div>
                    <footer className='w-full min-h-[200px] mt-20'>
                        <div className='w-full min-h-[200px] bg-p2p-secondary/20 dark:bg-zinc-900 p-10'>
                            <div className='w-full h-full flex flex-col justify-center items-center'>
                                <div className='flex gap-10 justify-center items-center'>
                                    <a
                                        href=''
                                    >
                                        <img 
                                            src={P2Plogo2} 
                                            alt="P2P logo 2" 
                                            className='w-20 block'
                                        />
                                    </a>
                                    <a
                                        target='_blank'
                                        href=''
                                    >
                                        <img 
                                            src={Github} 
                                            alt="Github logo"
                                            className='w-20 cursor-pointer block dark:invert' 
                                        />
                                    </a>
                                </div>
                                <span className='block w-full h-[4px] bg-gray-300 mt-8'></span>
                                <div className='flex flex-col gap-4 mt-8 items-center justify-center'>
                                    <img src={AveniroxLogo} alt="Avenirox Logo" className='w-30 dark:invert'/>
                                    <h2 className='italic text-center'>{t('home.footer.avenirox')}</h2>
                                </div>
                            </div>
                        </div>
                    </footer>
                </div>
            </div>
        </>
    )
}

export default HomePage