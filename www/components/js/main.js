// Grab modal element
const reviewModalEl = document.getElementById('addReviewModal');

// Wait until close
reviewModalEl.addEventListener('hidden.bs.modal', function () {
    const form = document.getElementById('fastFoodForm');
    
    if (form) {
        // Reset form
        form.reset(); 
    }
});


let map;

// 1. GOOGLE MAPS API INTEGRATION
function initMap() {
    const defaultLocation = { lat: 6.4325, lng: 100.4312 }; // Changlun context

    // Check if map div exists before initializing
    const mapDiv = document.getElementById("map");
    if (mapDiv) {
        map = new google.maps.Map(mapDiv, {
            zoom: 15,
            center: defaultLocation,
            disableDefaultUI: true
        });
    }

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const userPos = { lat: position.coords.latitude, lng: position.coords.longitude };

            if (map) {
                map.setCenter(userPos);
                new google.maps.Marker({ position: userPos, map: map, title: "You are here" });
            }

            // Safely set hidden form coordinates if they exist in HTML
            const latInput = document.getElementById('latitude');
            const lngInput = document.getElementById('longitude');
            if (latInput && lngInput) {
                latInput.value = userPos.lat;
                lngInput.value = userPos.lng;
            }
        }, () => {
            console.warn("Location access denied or failed.");
        });
    }

    loadReviews();
}

// FORM VALIDATION, SUBMIT & RESET
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('fastFoodForm');
    if (!form) return;

    form.addEventListener('reset', () => {
        document.getElementById('reviewRating').value = "0";
        document.getElementById('ratingFeedback').style.display = 'none';
        setRating(0); // Reuses the function to quickly empty all stars!
        form.classList.remove('was-validated');
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        let isValid = form.checkValidity();
        const ratingValue = document.getElementById('reviewRating').value;

        if (ratingValue === "0") {
            document.getElementById('ratingFeedback').style.display = 'block';
            isValid = false;
        }

        form.classList.add('was-validated');

        if (isValid) {
            const formData = new FormData();
            formData.append('restaurant_name', document.getElementById('restaurantName').value);
            formData.append('date', document.getElementById('reviewDate').value);
            formData.append('rating', ratingValue);
            formData.append('waiting_time', document.getElementById('waitingTime').value);
            formData.append('description', document.getElementById('reviewDescription').value);

            // Send empty string if coordinates weren't captured
            formData.append('latitude', document.getElementById('latitude')?.value || "");
            formData.append('longitude', document.getElementById('longitude')?.value || "");

            fetch('php/insert_review.php', { method: 'POST', body: formData })
                .then(res => res.json())
                .then(data => {
                    if (data.status === 'success') {
                        bootstrap.Modal.getInstance(document.getElementById('addReviewModal')).hide();
                        form.reset();
                        loadReviews();
                        alert("Review added successfully!");
                    } else {
                        alert("Error: " + data.message);
                    }
                })
                .catch(err => console.error('Form Submit Error:', err));
        }
    });
});

// LOAD RECORDS & DISPLAY
function loadReviews() {
    fetch('php/read_reviews.php')
        .then(res => res.json())
        .then(data => {
            const tbody = document.getElementById('reviewTableBody');
            if (!tbody) return;
            tbody.innerHTML = '';

            data.forEach(row => {
                if (map && row.latitude && row.longitude) {
                    new google.maps.Marker({
                        position: { lat: parseFloat(row.latitude), lng: parseFloat(row.longitude) },
                        map: map,
                        title: row.restaurant_name
                    });
                }

                let badgeClass = row.rating >= 4 ? "bg-success" : (row.rating == 3 ? "bg-warning text-dark" : "bg-danger");

                tbody.innerHTML += `
                <tr>
                    <th class="px-3 py-3">${row.id}</th>
                    <td class="py-3">${row.restaurant_name}</td>
                    <td class="py-3">${row.date}</td>
                    <td class="py-3"><span class="badge rounded-pill ${badgeClass}">${row.rating} Stars</span></td>
                    <td class="py-3">${row.waiting_time}</td>
                    <td class="py-3">${row.description}</td>
                    <td class="py-3">${row.latitude}</td>
                    <td class="py-3">${row.longitude}</td>
                    <td class="py-3 text-center">
                        <button class="btn btn-sm btn-danger" onclick="deleteRecord(${row.id})">Delete</button>
                    </td>
                </tr>
            `;
            });
        })
        .catch(err => console.error('Data Load Error:', err));
}

// DELETE RECORD
function deleteRecord(id) {
    if (confirm("Are you sure you want to delete this review?")) {
        const formData = new FormData();
        formData.append('id', id);

        fetch('php/delete_review.php', { method: 'POST', body: formData })
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    loadReviews();
                } else {
                    alert("Error deleting review.");
                }
            })
            .catch(err => console.error('Delete Error:', err));
    }
}

function refreshTable() {
    loadReviews();
}