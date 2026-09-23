import { useEffect, useState } from "react";
import SendFirstStep from "../components/send_page/SendFirstStep";
import SendSecondStep from "../components/send_page/SendSecondStep";
import { useLanguage } from "../locales/LoginContext";

type NetworksTypes = 'LAN' | 'WAN' | null
function Send() {
    const [network, setNetwork] = useState<NetworksTypes>(null)
    const [currentStep, setStep] = useState<number>(0)
    const [role, setRole] = useState<'HOST' | 'PEER'>('HOST')//for title translator
    const {t} = useLanguage()

    //searching for room link and navigating
    useEffect(() => {
        const hasRoomParameter = new URLSearchParams(window.location.search).get('room')
        if (hasRoomParameter) {
            setRole('PEER')
            setStep(1)
        }
    }, [])
    //changing website title (with steps)
    useEffect(() => {
        if (currentStep === 0) document.title = t('title.sendTitle')
        if (currentStep === 1 && role === 'HOST' && network === 'LAN') document.title = t('title.sendTitleHostLan')
        if (currentStep === 1 && role === 'HOST' && network === 'WAN') document.title = t('title.sendTitleHostWan')
        if (currentStep === 1 && role === 'PEER') document.title = t('title.sendTitlePeer')
    }, [t, currentStep])

    return (
        <>
            {/* send elements */}
            {currentStep === 0 &&
                <SendFirstStep selectedNetwork={(network) => setNetwork(network)} closeFirstStep={() => setStep(1)}/>
            }
            {currentStep === 1 &&
                <SendSecondStep selectedNetwork={network}/>
            }
        </>
    )
}

export default Send