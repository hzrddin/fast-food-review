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
    script.src = `https://maps.googleapis.com/maps/api/js?key=${gmapApi}&libraries=marker&loading=async&callback=initMap`;
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

    // Grab all variables
    let restName = document.getElementById('restaurantName').value;
    let revDate = document.getElementById('reviewDate').value;
    let revRating = document.getElementById('ratingSelect').value;
    let waitTime = document.getElementById('waitingTime').value;
    let revDesc = document.getElementById('reviewDescription').value;

    // Grab map coordinates
    let latitude = document.getElementById('userLat').value;
    let longitude = document.getElementById('userLng').value;

    // Build FormData to send to PHP
    const formData = new FormData();
    formData.append('restaurantName', restName);
    formData.append('reviewDate', revDate);
    formData.append('rating', revRating);
    formData.append('waitingTime', waitTime);
    formData.append('reviewDesc', revDesc);
    formData.append('userLatitude', latitude);
    formData.append('userLongitude', longitude);

    /*
    fetch(serverBaseUrl + 'saveReview.php')
    .then(res => {
        if(!res.ok)throw new Error("Server HTTP error status: " + res.status)
        return res.json();
        })
    */
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

//Update location
function updateLocationInputs(lat, lng) {
    //Grab value
    const latInput = document.getElementById('userLat');
    const lngInput = document.getElementById('userLng');
    
    //2 decimal point
    if (latInput && lngInput) {
        latInput.value = lat.toFixed(6);
        lngInput.value = lng.toFixed(6);
    }
}

let map;
let marker = null;

function initMap() {
    // Malaysia
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 6, // Low zoom to show the country
        center: { lat: 4.2105, lng: 101.9758 }, 
        mapId: "DEMO_MAP_ID",
        mapTypeControl: false
    });

    // Create/Move the pin
    function placeMarker(location) {
        if (!marker) {
            // Create the pin
            marker = new google.maps.marker.AdvancedMarkerElement({
                map: map,
                position: location,
                gmpDraggable: true,
                title: "Drag me to adjust!"
            });

            // Listen for dragging
            marker.addListener('dragend', function () {
                updateLocationInputs(marker.position.lat, marker.position.lng);
            });
        } else {
            // If already exists, move to the new spot
            marker.position = location;
        }

        // Update Lat & Long
        updateLocationInputs(location.lat, location.lng);
    }

    // 3. Ask browser for GPS
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const livePos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                map.setCenter(livePos); // Move camera to the user
                map.setZoom(15); // Zoom in close!
                placeMarker(livePos); // Drop the pin!
            },
            () => console.warn("User blocked GPS. They must click the map to drop a pin.")
        );
    }

    // Allow the user to click anywhere on the map to drop the pin manually
    map.addListener('click', (event) => {
        const clickedPos = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng()
        };
        placeMarker(clickedPos);
    });
}