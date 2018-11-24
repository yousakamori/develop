import { Elm } from '../elm/ElmTest';
(function () {
    const tmpNode = document.getElementById('test');
    if (tmpNode === null) {
        return;
    }
    const mountNode = tmpNode;
    const app = Elm.Main.init({ node: mountNode });
    app.ports.log.subscribe((model) => {
        console.log(model);
    });
}());
