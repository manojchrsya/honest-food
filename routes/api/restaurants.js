const config = require('../../config');
const https = require('https');
const fs = require('fs');
const tj = require('togeojson');
const { DOMParser } = require('xmldom');
const inside = require('point-in-geopolygon');
const dbFile = 'database.kml';

module.exports = {
  search: async function(options) {
    const coordinates = await this.getCordinates(options.address) || [];
    const geoJSON = this.getGeoJSON(dbFile);
    return inside.feature(geoJSON, coordinates);
  },
  getGeoJSON: function(dbFile) {
    const kml = new DOMParser().parseFromString(fs.readFileSync(dbFile, 'utf8'));
    const converted = tj.kml(kml);
    const polyGonMap = {
      type: 'FeatureCollection',
      features: [],
    };
    converted.features = converted.features.map((feature) => {
      if (feature.geometry && feature.geometry.type === 'Polygon') {
        polyGonMap.features.push(feature);
      }
      return feature;
    });
    return polyGonMap;
  },
  getCordinates: async function(address) {
    const url = this.getApiUrl(address);
    return new Promise((resolve) => {
      https.get(url, (resp) => {
        let data = '';
        resp.on('data', (chunk) => {
          data += chunk;
        });
        resp.on('end', () => {
          const details = JSON.parse(data);
          let coordinates = [];
          if (details.features.length > 0) {
            coordinates = details.features[0].geometry.coordinates;
          }
          resolve(coordinates);
        });
      }).on('error', (e) => {
        console.error(e);
        // TODO:: need to handle the execptions
        resolve([]);
      });
    });
  },
  getApiUrl: function(address) {
    return `${config.END_POINT}?q=${address}&key=${config.OPEN_API_KEY}`;
  },
};