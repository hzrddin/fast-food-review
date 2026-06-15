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

function saveReview(){

    let restName, revDate,  revRating, waitTime, revDesc;


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
                <td class="py-3"><span class="badge rounded-pill ${badgeClass}">${row.starRating} Stars</span></td>
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