// Grab modal element
const reviewModalEl = document.getElementById('addReviewModal');

// Wait until close to reset
if (reviewModalEl) {
    reviewModalEl.addEventListener('hidden.bs.modal', function () {
        const form = document.getElementById('fastFoodForm');
        if (form) {
            form.reset();
        }
    });
}

function loadReviews() {
    // FIX 2: Removed trailing formatting comma syntax error
    fetch(`${SERVER_URL}`)
        .then(res => {
            if (!res.ok) throw new Error("Server HTTP error status: " + res.status);
            return res.json();
        })
        .then(data => {
            const tbody = document.getElementById('reviewTableBody');
            if (!tbody) return;
            tbody.innerHTML = ''; // Wipe stale entries cleanly

            data.forEach(row => {
                // Drop persistent pin on your main map layout if active
                if (window.map && row.latitude && row.longitude) {
                    new google.maps.Marker({
                        position: { lat: parseFloat(row.latitude), lng: parseFloat(row.longitude) },
                        map: window.map,
                        title: row.restaurant_name
                    });
                }

                // Rating Badge system mapping (1-2 danger, 3 warning, 4-5 success)
                let badgeClass = row.rating >= 4 ? "bg-success" : (row.rating == 3 ? "bg-warning text-dark" : "bg-danger");

                // FIX 3: Reverted column property variables back to snake_case mapping from your PHP output
                tbody.innerHTML += `
                <tr>
                    <th class="px-3 py-3">${row.id}</th>
                    <td class="py-3">${row.restaurant_name || "-"}</td>
                    <td class="py-3">${row.date_review || "-"}</td>
                    <td class="py-3"><span class="badge rounded-pill ${badgeClass}">${row.rating || "0"} Stars</span></td>
                    <td class="py-3">${row.waiting_time || "-"}</td>
                    <td class="py-3">${row.description || "-"}</td>
                    <td class="py-3">${row.latitude || "-"}</td>
                    <td class="py-3">${row.longitude || "-"}</td>
                    <td class="py-3 text-center">
                        <button class="btn btn-sm btn-danger" onclick="deleteRecord(${row.id})">Delete</button>
                    </td>
                </tr>
                `;
            });
        })
        .catch(err => console.error('Error fetching data rows:', err));
}