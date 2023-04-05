import React, { Component } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Map, View } from 'ol';
import 'ol/ol.css';
import './custom.css';
import Projection from 'ol/proj/Projection.js';
import Static from 'ol/source/ImageStatic.js';
import { getCenter, createEmpty } from 'ol/extent.js';
import ImageLayer from 'ol/layer/Image.js';



export default class App extends Component {
    constructor(props) {
        super(props);



        this.state = {
            center: [0, 0],
            zoom: 0,
        };

        this.extent = [0, 0, 0, 0];

        
    }

    componentDidMount() {
        fetch('https://localhost:44480/Maps/GetJsonMap/Aspid')
            .then(res => res.json())
            .then((result) => {
                this.extent = [0, 0, result.extent.y2, result.extent.x2];
                this.projection = new Projection({
                    code: 'xkcd-image',
                    units: 'pixels',
                    extent: this.extent,
                });
                this.map = new Map({
                    target: "map-container",
                    layers: [
                        new ImageLayer({
                            source: new Static({
                                url: 'https://localhost:44480/Maps/GetMap/' + 'Aspid',
                                projection: this.projection,
                                imageExtent: this.extent,
                                interpolate: false,
                            }),
                        })
                    ],
                    view: new View({
                        projection: this.projection,
                        center: getCenter(this.extent),
                        zoom: 2,
                        maxZoom: 8,
                        showFullExtent: true,
                    }),
                });
            });
    }

    componentDidUpdate() {
        console.log(this.extent);
        this.map = new Map({
            target: "map-container",
            layers: [
                new ImageLayer({
                    source: new Static({
                        url: 'https://localhost:44480/Maps/GetMap/' + 'Aspid',
                        projection: this.projection,
                        imageExtent: this.extent,
                        interpolate: false,
                    }),
                })
            ],
            view: new View({
                projection: this.projection,
                center: getCenter(this.extent),
                zoom: 2,
                maxZoom: 8,
                showFullExtent: true,
            }),
        });
    }

    render() {
        return (
            <div style={{ height: '100vh', width: '100%' }} id="map-container" className="map-container" />
        );
    }
}
