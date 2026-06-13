function setRating(ratingValue) {
    // 1. Update the hidden input value for your database
    document.getElementById('reviewRating').value = ratingValue;

    // 2. Get all the image tags inside the star container
    const stars = document.querySelectorAll('#starContainer img');

    // 3. Loop through them and change the 'src' path
    stars.forEach((star, index) => {
        if (index < ratingValue) {
            // Change to your FILLED local star SVG
            star.src = 'components/images/star-fill.svg'; 
        } else {
            // Change back to your EMPTY local star SVG
            star.src = 'components/images/star.svg'; 
        }
    });
}