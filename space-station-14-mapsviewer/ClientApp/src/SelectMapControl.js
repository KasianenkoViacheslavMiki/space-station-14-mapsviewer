import { Control} from 'ol/control.js';

export default class SelectMapControl extends Control {
    constructor(options) {
        const comboBox = document.createElement('select');

        comboBox.addEventListener("change", function () {
            fetch('Maps/GetJsonMap/' + comboBox.value)
                .then(res => res.json())
                .then((result) => {
                    options.setState(
                        {
                            extent: [0, 0, result.extent.x2, result.extent.y2],
                            url: result.url
                        })
                });
            fetch('Maps/GetParallaxes/' + comboBox.value)
                .then(res => res.json())
                .then((result) => {
                    options.setState(
                        {
                            urlParallax: result.url
                        })
                });
        });
        comboBox.id = 'map-selector';
        comboBox.className = 'ol-unselectable ol-control';
        comboBox.style = 'pointer-events: auto;';

        super({
            element: comboBox
        });

        var state = { listName: [] };
        fetch('Maps/GetNameMaps')
            .then(res => res.json())
            .then((result) => {
                state = {
                    listName: result
                };
                state.listName.forEach(x => {
                    var option = document.createElement("option");
                    option.value = x;
                    option.text = x;
                    comboBox.appendChild(option);
                })
            });
    }
}