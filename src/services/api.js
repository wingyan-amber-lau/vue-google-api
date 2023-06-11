import axios from 'axios';

export default{
    fetchLocationTimezone(location) {
        const key = import.meta.env.VITE_KEY;
        const url = 'https://maps.googleapis.com/maps/api/timezone/json?location=' + location.lat() + ',' + location.lng() + '&timestamp=' + Math.floor(Date.now() / 1000) + '&language=es&key=' + key;
        return axios.get(url);
    },
    fetchPlaceName(lat, lng){
        const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${import.meta.env.VITE_KEY}`;
        return axios.get(geocodeUrl);
    }
}