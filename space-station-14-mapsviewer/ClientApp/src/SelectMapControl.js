import { Control, defaults as defaultControls } from 'ol/control.js';

class SelectMapControl extends Control {
    changeLayer() {

        //if (activeLayer != null) {
        //    activeLayer.setVisibility(false); 
        //}
        //layer.setVisibility(true);
        //activeLayer = layer;
    }
    constructor(options) {
        const comboBox = document.createElement('select');
        comboBox.addEventListener("change", function () {
            const img = new Image();
            img.onload = function () {
                extent = [0, 0, this.width, this.height];
                console.log(extent);
            }
            img.src = 'https://localhost:44480/Maps/GetMap/' + comboBox.value;

            var s = new Static({
                url: 'https://localhost:44480/Maps/GetMap/' + comboBox.value,
                projection: projection,
                imageExtent: extent,
            });
            var l = options.map.getLayers().getArray()[0];
            l.setSource(s);

        });
        comboBox.id = 'map-selector';
        comboBox.className = 'ol-unselectable ol-control';
        comboBox.style = 'pointer-events: auto;';

        super({
            element: comboBox
        });
        var state = { listName: [] };
        fetch('https://localhost:44480/Maps/GetNameMaps')
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