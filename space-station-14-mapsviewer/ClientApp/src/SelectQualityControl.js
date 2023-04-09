import { Control} from 'ol/control.js';

export default class SelectQualityControl extends Control {
    constructor(options) {
        const comboBox = document.createElement('select');

        comboBox.addEventListener("change", function () {
            fetch('Maps/GetJsonMap/' + comboBox.value + '/' + options.state.name)
                .then(res => res.json())
                .then((result) => {
                    options.setState(
                        {
                            getUrl: comboBox.value,
                            extent: [0, 0, result.extent.x2, result.extent.y2],
                            url: result.url
                        })
                });
            
        });
        comboBox.id = 'quality-selector';
        comboBox.className = 'ol-unselectable ol-control';
        comboBox.style = 'pointer-events: auto;';

        super({
            element: comboBox
        });


        var option = document.createElement("option");

        option.value = "webp";
        option.text = "Low Quality";

        comboBox.appendChild(option);

        var option = document.createElement("option");

        option.value = "png";
        option.text = "High Quality";

        comboBox.appendChild(option);
    }
}