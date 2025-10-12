import {SkuNav} from './SkuNav';
import './Container.css';


export function Container() {
    return (
        <>
       <SkuNav />
            <table className="container-table">
                <thead>
                    <tr>
                        <th>S no.</th>
                        <th>Container</th>
                    </tr>
                </thead>

                <tbody>
                    <tr>
                        <td>1</td>
                        <td>Can</td>
                    </tr>

                    <tr>
                        <td>2</td>
                        <td>Bottle</td>

                    </tr>
                    <tr>
                        <td>3</td>
                        <td>Tetra</td>
                    </tr>
                </tbody>

            </table>



        </>
    );
}