import { Assets } from '../assets/Assets';
import { Burger } from '../Components/Burger';

export function HomePage() {

    return (
        <div className="home">

            <nav className="nav">
                <div className="burger">
                    <img src={Assets.menu} alt="img"></img>
                </div>
                <ul className="elements">
                    <li>Home</li>
                    <li>Statistics</li>
                    <li>Summary</li>

                </ul>
            </nav>
            <Burger />



        </div>
    );
}