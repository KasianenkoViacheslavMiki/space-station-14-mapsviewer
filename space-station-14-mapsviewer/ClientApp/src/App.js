import React, { Component } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Map, View } from 'ol';
import 'ol/ol.css';
import OSM from 'ol/source/OSM.js';
import TileLayer from 'ol/layer/Tile.js';
import Projection from 'ol/proj/Projection.js';
import Static from 'ol/source/ImageStatic.js';
import { getCenter } from 'ol/extent.js';
import ImageLayer from 'ol/layer/Image.js';

const extent = [0, 0, 5000, 5000];

const projection = new Projection({
    code: 'xkcd-image',
    units: 'pixels',
    extent: extent,
});

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            center: [0, 0],
            zoom: 0,
            png: null
        };
    }

    componentDidMount() {
        new Map({
            target: "map-container",
            layers: [
                new ImageLayer({
                    source: new Static({
                        url: 'https://localhost:44480/Maps/GetMap/Box',
                        projection: projection,
                        imageExtent: extent,
                    }),
                }),
                new ImageLayer({
                    source: new Static({
                        url: 'https://localhost:44480/Maps/GetMap/Meta',
                        projection: projection,
                        imageExtent: extent,
                    }),
                }),
            ],
            view: new View({
                projection: projection,
                center: getCenter(extent),
                zoom: 2,
                maxZoom: 8,
            }),
        });
    }

    render() {
        return (
            <div style={{ height: '100vh', width: '100%' }} id="map-container" className="map-container" />
        );
    }
}
