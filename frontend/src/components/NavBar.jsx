import './../styles/navbar.css';
import userLogo from './../assets/user.png'

function NavBar(){

    return (
        <nav>
            <ul>
                <li><a href="#inicio">Inicio</a></li>
                <li><a href="#comidas">Comidas</a></li>
                <li><a href="#lista">Lista de la compra</a></li>
                <li><a href="#alacena">Alacena</a></li>
            </ul>
            <figure>
                <img src={userLogo} alt="user" width="40" height="40"/>
            </figure>
        </nav>
    );
}

export default NavBar