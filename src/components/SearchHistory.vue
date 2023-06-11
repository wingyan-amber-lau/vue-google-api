<template>
    <div class="card rounded-0 border-bottom-0">
        <div class="card-body">
            <div class="d-flex justify-content-between">
                <h5 class="card-title">Search History </h5>
                <button @click="deleteSelectedLocations" class="btn btn-sm btn-danger mt-0 mb-2 p-1">Delete</button>
            </div>

            <div>
                <table class="table table-hover table-bordered">
                    <thead class="table-secondary">
                        <tr>
                            <th></th>
                            <th>Search Input</th>
                            <th>Search Location</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="location in paginatedLocations" :key="location.id">
                            <td><input type="checkbox" v-model="selectedLocations" :value="location" /></td>
                            <td>{{ location.searchName }}</td>
                            <td>{{ location.resultName }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="pagination">
                <button @click="changePageByDirection(-1)" :disabled="currentPage === 1">Previous</button>
                <button v-for="page in totalPages" :key="page" @click="changePage(page)"
                    :class="{ active: page === currentPage }">{{ page }}</button>
                <button @click="changePageByDirection(1)" :disabled="currentPage === totalPages">Next</button>
            </div>
        </div>
    </div>
</template>
<script>
import { toRaw } from 'vue';
export default {
    props: ['locations',
        'markers',
        'map'],
    emits: ['deleteLocations'],
    data() {
        return {
            pageSize: 10,
            currentPage: 1,
            selectedLocations: [],
        }
    },
    methods: {
        deleteSelectedLocations() {

            const selectedValues = this.selectedLocations.map(function (value) {
                return value.resultName;
            });
            let markersToBeRemove = [];
            this.markers.forEach((marker) => {

                if (selectedValues.includes(marker.title)) {
                    toRaw(marker).setMap(null);
                    markersToBeRemove.push(marker);
                }
            });
            const updatedMakers = this.markers.filter((marker) => !markersToBeRemove.includes(marker));
            const updatedLocations = this.locations.filter((location) => !this.selectedLocations.includes(location));
            this.$emit('deleteLocations', updatedMakers,updatedLocations);
            this.selectedLocations = [];
        },
        changePageByDirection(direction) {
            this.currentPage += direction;
        },
        changePage(page) {
            if (page === this.currentPage || page < 1 || page > this.totalPages) {
                return;
            }
            this.currentPage = page;
        },

    },
    computed: {
        paginatedLocations() {
            const startIndex = (this.currentPage - 1) * this.pageSize;
            const endIndex = startIndex + this.pageSize;
            return this.locations.slice(startIndex, endIndex);
        },
        totalPages() {
            return Math.ceil(this.locations.length / this.pageSize);
        }
    },

}
</script>

<style>
.pagination {
    display: flex;
    justify-content: center;
    margin-top: 16px;
}

.pagination button {
    background-color: #fff;
    border: 1px solid #ddd;
    color: #333;
    padding: 8px 16px;
    margin: 0 4px;
    cursor: pointer;
}

.pagination button.active {
    background-color: #ddd;
}
</style>
