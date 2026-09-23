import { useState } from "react";
import { useLanguage } from "../../locales/LoginContext";
import { Globe, Network } from "lucide-react";

interface SendFirstStepProps {
    selectedNetwork: (network: NetworksTypes) => void,
    closeFirstStep: () => void
}

type NetworksTypes = 'LAN' | 'WAN' | null

function SendFirstStep({ selectedNetwork: onNetworkChange, closeFirstStep }: SendFirstStepProps) {
    const {t} = useLanguage()
    const [selectedNetwork, setNetwork] = useState<NetworksTypes>(null)

    const handleNetworkSelect = (network: NetworksTypes) => {
        setNetwork(network),
        onNetworkChange(network),
        closeFirstStep()
    }

    return (
        <>
            <div className="w-[100dvw] h-[calc(100dvh-5rem)] mt-20 overflow-hidden">
                <h1 className="text-3xl fixed left-1/2 -translate-x-1/2 bg-[color-mix(in_srgb,var(--color-p2p-secondary)_20%,white)] dark:bg-black dark:text-white shadow-[0_0_10px_rgba(0,0,0,0.3)] py-3 px-5 rounded-2xl text-center top-25 z-10 md:top-30 md:w-fit w-full">{t('send.header1')}</h1>
                <div className="w-full h-full grid grid-cols-2">
                    <div className="w-full h-full bg-[color-mix(in_srgb,var(--color-p2p-primary)_40%,white)] dark:bg-zinc-800 flex flex-col gap-8 justify-center items-center cursor-pointer group hover:scale-120 hover:z-5 duration-600" onClick={() => handleNetworkSelect('LAN')}>
                        <Network size={60} className="text-blue-700 dark:text-white md:opacity-0 group-hover:opacity-100 duration-500"/>
                        <h2 className="text-6xl font-bold text-blue-700 dark:text-white md:opacity-50 group-hover:opacity-100 group-hover:text-7xl duration-400">LAN</h2>
                        <h3 className="hidden md:block md:opacity-0 md:text-2xl text-xl text-blue-700 dark:text-white group-hover:opacity-100 duration-500 max-w-[80%] text-center"><b>LAN</b>{t('send.LANdesc')}</h3>
                    </div>
                    <div className="w-full h-full bg-[color-mix(in_srgb,var(--color-p2p-secondary)_40%,white)] dark:bg-zinc-700 flex flex-col gap-8 justify-center items-center cursor-pointer group hover:scale-120 hover:z-5 duration-600" onClick={() => handleNetworkSelect('WAN')}>
                        <Globe size={60} className="text-blue-700 dark:text-white md:opacity-0 group-hover:opacity-100 duration-500"/>
                        <h2 className="text-6xl font-bold text-blue-700 dark:text-white md:opacity-50 group-hover:opacity-100 group-hover:text-7xl duration-400">WAN</h2>
                        <h3 className="hidden md:block md:opacity-0 md:text-2xl text-xl text-blue-700 dark:text-white group-hover:opacity-100 duration-500 max-w-[80%] text-center"><b>WAN</b>{t('send.WANdesc')}</h3>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SendFirstStep