import React, { Component } from 'react';
import { Map, View } from 'ol';
import 'ol/ol.css';
import './custom.css';
import Projection from 'ol/proj/Projection.js';
import Static from 'ol/source/ImageStatic.js';
import { getCenter } from 'ol/extent.js';
import ImageLayer from 'ol/layer/Image.js';
import SelectMapControl from './SelectMapControl.js';
import {defaults as defaultControls } from 'ol/control.js';



export default class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            center: [0, 0],
            zoom: 0,
            extent: [0, 0, 0, 0],
            name: 'Aspid',
        };
    }

    componentDidMount() {
        this.map = new Map({
            controls: defaultControls().extend([new SelectMapControl(this)]),
            target: "map-container",
        });

        fetch('https://localhost:44480/Maps/GetJsonMap/Aspid')
            .then(res => res.json())
            .then((result) => {
                this.setState({ extent: [0, 0, result.extent.y2, result.extent.x2] })
            });
    }

    componentDidUpdate() {

        console.log('componentDidUpdate');

        this.projection = new Projection({
            code: 'xkcd-image',
            units: 'pixels',
            extent: this.state.extent,
        });

        this.map.setLayers([
            new ImageLayer({
                source: new Static({
                    url: 'https://localhost:44480/Maps/GetMap/' + this.state.name,
                    projection: this.projection,
                    imageExtent: this.state.extent,
                    interpolate: false,
                }),
            })
        ]);

        this.map.setView(new View({
            projection: this.projection,
            center: getCenter(this.state.extent),
            zoom: 2,
            maxZoom: 8,
            showFullExtent: true,
        }));
    }

    render() {
        return (
            <div style={{ height: '100vh', width: '100%' }} id="map-container" className="map-container" />
        );
    }
}
