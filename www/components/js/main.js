// Grab modal element
const reviewModalEl = document.getElementById('addReviewModal');

// Reset when modal close
if (reviewModalEl) {
    reviewModalEl.addEventListener('hidden.bs.modal', function () {
        const form = document.getElementById('fastFoodForm');
        if (form) {
            form.reset();
        }
    });
}

//Replace this endpoint URL
const serverBaseUrl = window.APP_CONFIG.SERVER_URL;
const gmapApi = window.APP_CONFIG.GOOGLE_MAP_API;

loadGoogleMapsScript();

function loadGoogleMapsScript() {
    const script = document.createElement('script');

    script.src = `https://maps.googleapis.com/maps/api/js?key=${gmapApi}&loading=async&callback=initMap`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
}


//Save Review
function saveReview(event) {
    event.preventDefault();
    const form = document.getElementById('fastFoodForm');

    // Add Bootstrap validation class to show validation messages
    form.classList.add('was-validated');

    // Check if form is valid
    if (!form.checkValidity()) {
        return; // Stop if invalid
    }

    // Grab all your standard variables
    let restName = document.getElementById('restaurantName').value;
    let revDate = document.getElementById('reviewDate').value;
    let revRating = document.getElementById('ratingSelect').value;
    let waitTime = document.getElementById('waitingTime').value;
    let revDesc = document.getElementById('reviewDescription').value;

    // Grab your new map coordinates!
    let latitude = document.getElementById('userLat').value;
    let longitude = document.getElementById('userLng').value;

    // Build your FormData to send to PHP
    const formData = new FormData();
    formData.append('restaurantName', restName);
    formData.append('reviewDate', revDate);
    formData.append('rating', revRating);
    formData.append('waitingTime', waitTime);
    formData.append('reviewDesc', revDesc);
    formData.append('userLatitude', latitude);
    formData.append('userLongitude', longitude);

    // Run your fetch() POST here!
}

//Load All Reviews into Table
function loadReviews() {
    fetch(serverBaseUrl + 'getReviews.php')
        .then(res => {
            if (!res.ok) throw new Error("Server HTTP error status: " + res.status);
            return res.json();
        })
        .then(data => {
            const tbody = document.getElementById('reviewTableBody');
            if (!tbody) return;
            tbody.innerHTML = '';

            data.forEach(row => {
                let badgeClass = row.starRating >= 4 ? "bg-success" : (row.starRating == 3 ? "bg-warning text-dark" : "bg-danger");

                tbody.innerHTML += `
            <tr>
                <th class="px-3 py-3">${row.id}</th>
                <td class="py-3">${row.restaurantName}</td>
                <td class="py-3">${row.dateReview}</td>
                <td class="py-3"><span class="badge pill ${badgeClass}">${row.starRating} Stars</span></td>
                <td class="py-3">${row.waitingTime}</td>
                <td class="py-3">${row.reviewDesc}</td>
                <td class="py-3">${row.userLatitude}</td>
                <td class="py-3">${row.userLongitude}</td>
                <td class="py-3 text-center">
                    <button class="btn btn-sm btn-danger" onclick="deleteRecord(${row.id})">Delete</button>
                </td>
            </tr>
            `;
            });
        })
        .catch(err => console.error('Error fetching data rows:', err));
}

//Delete By ID
function deleteRecord(id) {
    if (confirm("Are you sure you want to remove this review?")) {
        const formData = new FormData();
        formData.append('id', id);

        fetch(serverBaseUrl + 'deleteReview.php', {
            method: 'POST',
            body: formData
        })
            .then(res => res.json())

            .then(data => {
                if (data.status === 'success') {
                    alert("ID " + id + " Sucessfully Deleted From The System");
                    loadReviews();

                } else {
                    alert("Deletion error: " + data.message);
                }
            })
            .catch(err => console.error('Deletion Exception:', err));
    }
}

//Map
let map;
let marker;

function initMap() {
    const defaultLocation = { lat: 6.4325, lng: 100.4316 };

    // 1. Build the map (Added mapId as required by the new marker)
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 15,
        center: defaultLocation,
        mapId: "DEMO_MAP_ID",
        mapTypeControl: false
    });

    // 2. Create the NEW AdvancedMarkerElement
    marker = new google.maps.marker.AdvancedMarkerElement({
        map: map,
        position: defaultLocation,
        gmpDraggable: true, // Notice the new property name here!
        title: "Drag me to your exact spot!"
    });

    updateLocationInputs(defaultLocation.lat, defaultLocation.lng);

    // 3. LISTEN FOR DRAGGING: Update inputs
    marker.addListener('dragend', function () {
        // Grab the new position directly from the marker
        updateLocationInputs(marker.position.lat, marker.position.lng);
    });

    // 4. Geolocation (Ask browser for GPS)
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const livePos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                map.setCenter(livePos);
                marker.position = livePos; // Move the marker
                updateLocationInputs(livePos.lat, livePos.lng);
            },
            () => console.warn("User blocked GPS or it failed.")
        );
    }
}