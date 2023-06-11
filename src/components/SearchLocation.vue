<template>
    <div class="row">
        <div class="col p-0">
            <CurrentLocation :map='map' />
        </div>
    </div>
    <div class="row">
        <div class="col p-0">
            <div class="card rounded-0 border-left-0 border-bottom-0">
                <div class="card-body">
                    <h5 class="card-title">Map</h5>
                    <div class="d-flex justify-content-center">
                        <div class="input-group w-80">
                            <input id="searchInput" v-model="searchInput" class="form-control" type="search"
                                placeholder="Search Location" />
                            <button @click="triggerSearch" class="btn btn-primary">Search</button>
                        </div>
                    </div>

                    <div id="map"></div>
                </div>
            </div>

        </div>
        <div class="col p-0">
            <LatestSearch :locations='locations' :timezone='timezone' :time='time' />

            <SearchHistory :locations='locations' :map='map' :markers='markers' @deleteLocations="deleteHistory" />
        </div>
    </div>

    <div>

    </div>
</template>

<script>
import moment from 'moment-timezone';
import api from '../services/api';
import SearchHistory from './SearchHistory.vue';
import LatestSearch from './LatestSearch.vue';
import CurrentLocation from './CurrentLocation.vue';
export default {
    data() {
        return {
            searchInput: '',
            center: { lat: 43.651070, lng: -79.347015 },
            locations: [],
            markers: [],
            timezone: '',
            time: '',
            searchBox: null,
            map: null,
            zoom: 12
        }
    },
    components: {
        SearchHistory,
        LatestSearch,
        CurrentLocation
    },
    mounted() {
        this.initAutocomplete();
        this.getDummyData();
    },
    methods: {
        getDummyData() {
            // create dummy data
            this.addLocation({ lat: this.center.lat, lng: this.center.lng }, 'Dummy1');
            this.addLocation({ lat: this.center.lat, lng: this.center.lng + 0.01 }, 'Dummy2');
            this.addLocation({ lat: this.center.lat, lng: this.center.lng + 0.02 }, 'Dummy3');
            this.addLocation({ lat: this.center.lat, lng: this.center.lng + 0.03 }, 'Dummy4');
            this.addLocation({ lat: this.center.lat, lng: this.center.lng + 0.04 }, 'Dummy5');
            this.addLocation({ lat: this.center.lat, lng: this.center.lng + 0.05 }, 'Dummy6');
            this.addLocation({ lat: this.center.lat, lng: this.center.lng + 0.06 }, 'Dummy7');
            this.addLocation({ lat: this.center.lat, lng: this.center.lng + 0.07 }, 'Dummy8');
            this.addLocation({ lat: this.center.lat, lng: this.center.lng + 0.08 }, 'Dummy9');
        },
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
        addLocation(coordinates, resultName) {
            const id = Date.now().toString();
            const searchName = this.searchInput || 'Dummy';
            this.locations.push({ id, searchName, resultName, coordinates });
            this.markers.push(
                new google.maps.Marker({
                    position: coordinates,
                    map: this.map,
                    title: resultName
                })
            );
        },
        initAutocomplete() {

            this.map = new google.maps.Map(document.getElementById("map"), {
                center: this.center,
                zoom: this.zoom,
                mapTypeId: "roadmap",
            });

            // Create the search box and link it to the UI element.
            const input = document.getElementById("searchInput");
            this.searchBox = new google.maps.places.SearchBox(input);


            // Listen for the event fired when the user selects a prediction and retrieve
            // more details for that place.
            this.searchBox.addListener("places_changed", this.searchPlace);
        },
        triggerSearch(){
            const input = document.getElementById("searchInput");
            google.maps.event.trigger(input, 'focus', {});
            google.maps.event.trigger(input, 'keydown', { keyCode: 13 });
            google.maps.event.trigger(this, 'focus', {});
        },
        searchPlace() {
            const places = this.searchBox.getPlaces();
            if (places.length == 0) {
                alert('No relevant place.');
                return;
            }

            // get the first result if more than one match
            const place = places[0];

            // For each place, get the icon, name and location.
            const bounds = new google.maps.LatLngBounds();

            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }

            this.map.fitBounds(bounds);
            this.addLocation(place.geometry.location, place.name);
            this.updateLocationTimezone(place.geometry.location);

        },
        deleteHistory(updatedMakers,updatedLocations) {
            this.locations = updatedLocations;
            this.markers = updatedMakers;

        },
        async updateLocationTimezone(location) {
            try {
                const response = await api.fetchLocationTimezone(location);
                this.timezone = response.data.timeZoneId;
                // if (this.timezone)
                this.time = moment().tz(response.data.timeZoneId).format('YYYY-MM-DD HH:mm:ss');
            }
            catch (err) {
                console.log(err);
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

            // const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${import.meta.env.VITE_KEY}`;
            // await axios.get(geocodeUrl)
            //     .then(response => {
            //         const results = response.data.results;
            //         if (results.length > 0) {
            //             this.currentLocation.address = results[0].formatted_address;
            //         }
            //     })
            //     .catch(error => {
            //         console.error('Error retrieving place name:', error);
            //     });
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

<style>
#map {
    height: 550px;
    width: 100%;
}

.search {
    width: 100%;
}
</style>
