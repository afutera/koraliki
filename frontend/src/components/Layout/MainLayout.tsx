import {Link, Outlet } from "react-router"

const MainLayout = ()=>{ return(
    <><nav className='nav navbar navbar-expand headerFooterColor navbar-dark'>
        <span className="navbar-brand">
        <Link to="/galeria" >
        <img src="/favicon.svg" className="logo"/></Link>
        <span>Koraliki</span></span>
        <ul className="navbar-nav flex-grow-1">
            <li className="nav-item"><Link to="/galeria">Galeria</Link></li>
            <li className="nav-item"><Link to="/edytor">Stwórz wzór</Link></li>
        </ul>
    </nav>
    <div className="content"><Outlet/></div>
    <footer className="headerFooterColor footer border-top">Praca inżynierska - A. Futera 2027</footer>
    </>)
}

export default MainLayout