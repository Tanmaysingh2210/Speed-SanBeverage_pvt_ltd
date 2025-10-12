import { Assets } from '../../assets/Assets';
import { Burger } from '../Burger'


export function SkuNav() {

    return (
        <div className="home">

            <nav className="nav">
                <div className="burger">
                    <img src={Assets.menu} alt="img"></img>
                </div>
                <ul className="elements">
                    <li>Container</li>
                    <li>Package</li>
                    <li>Flavour</li>
                    <li>Item</li>

                </ul>
            </nav>
            <Burger />

        </div>
    );
}