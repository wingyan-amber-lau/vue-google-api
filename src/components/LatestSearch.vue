<template>
    <div class="card rounded-0 border-bottom-0 border-right-0">
                <div class="card-body">
                    <h5 class="card-title">Latest Search</h5>
                    <p class="card-text">
                        <table class="table">
                            <tr><th>Location</th><td>{{ (locations.length > 0) ? locations.at(-1).resultName : '' }}</td></tr>
                            <tr><th>Timezone</th><td>{{ timezone }}</td></tr>
                            <tr><th>Time</th><td>{{ time }}</td></tr>
                        </table>
                    </p>
                </div>
            </div>
</template>

<script>
export default {
    props:['locations','timezone','time']
}
</script>
