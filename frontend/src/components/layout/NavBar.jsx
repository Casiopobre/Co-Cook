import { Link } from 'react-router-dom';
import './NavBar.css';
import userLogo from '../../assets/user.png';

function NavBar(){

    return (
        <nav>
            <ul>
                <li><Link to="/">Inicio</Link></li>
                <li><Link to="/comidas">Comidas</Link></li>
                <li><Link to="/lista">Lista de la compra</Link></li>
                <li><Link to="/alacena">Alacena</Link></li>
            </ul>
            <figure>
                <img src={userLogo} alt="user" width="40" height="40"/>
            </figure>
        </nav>
    );
}

export default NavBar