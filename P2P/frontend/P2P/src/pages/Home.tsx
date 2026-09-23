import { useNavigate } from "react-router-dom";
import HomePage from "../components/home_page/HomePage";
import { useEffect } from "react";
import { useLanguage } from "../locales/LoginContext";

function Home() {
    const navigate = useNavigate()
    const {t} = useLanguage()

    //changing and aplying title for home page
    useEffect(() => {
        document.title = t('title.mainTitle')
    }, [t])

    return (
        
        <>
            <HomePage selectedPage={(page) => navigate(`/${page}`)}/>
        </>
    )
}

export default Home