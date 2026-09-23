import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import Navbar from "./components/Navbar";

type PagesType = 'home' | 'get' | 'send'

function Router() {
    const location = useLocation()
    const navigate = useNavigate()
    
    const currentPage = (location.pathname.replace('/', '') || 'home') as PagesType

    return (
        <>
            <Navbar                 
                selectedPage={(page) => navigate(`/${page}`)}
                currentPage={currentPage}
            />

            <Outlet />
        </>
    )
}

export default Router