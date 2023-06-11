<template>
    <div class="card border-0">
        <div class="card-body">
            <div class="d-flex justify-content-between">
                <h5 class="card-title">Current Location</h5>
                <button @click="getCurrentLocation" class="btn btn-sm btn-primary mt-0 mb-2 p-1">Get Current
                    Location</button>
            </div>

            <p class="card-text">
                Coordinates: {{ coordinates }}<br>
                Address: {{ currentLocation.address }}
            </p>

        </div>
    </div>
</template>

<script>
import api from '../services/api';
export default {
    props: ['map'],
    data() {
        return {
            currentLocation: {},
        }
    },
    methods: {
        getCurrentLocation() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    this.currentLocation.lat = position.coords.latitude;
                    this.currentLocation.lng = position.coords.longitude;
                    this.getPlaceName(position.coords.latitude, position.coords.longitude);
                    this.map.setCenter({ lat: position.coords.latitude, lng: position.coords.longitude }, this.zoom);
                });

            }
        },
        async getPlaceName(lat, lng) {
            try {
                const response = await api.fetchPlaceName(lat, lng);
                const results = response.data.results;
                if (results.length > 0) {
                    this.currentLocation.address = results[0].formatted_address;
                }
            }
            catch (err) {
                console.log(err);
            }

        },
    },
    computed: {
        coordinates() {
            return this.currentLocation.lat && this.currentLocation.lng
                ? this.currentLocation.lat + " " + this.currentLocation.lng
                : "";
        }
    },

}
</script>