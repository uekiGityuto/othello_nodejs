import { Controller } from './controllers/controller';
import { WHITE } from './models/model';

const main = () => {
    const ctrl = new Controller(WHITE);
    ctrl.start();
};
main();