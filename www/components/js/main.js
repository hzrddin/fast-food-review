function setRating(ratingValue) {
    // 1. Update the hidden input value for database
    document.getElementById('reviewRating').value = ratingValue;

    // 2. Hide the custom validation error message if they clicked a star
    document.getElementById('ratingFeedback').style.display = 'none';

    // 3. Define the drawing paths for the Empty and Filled stars
    const emptyStarPath = "M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z";
    
    const filledStarPath = "M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z";

    // 4. Select all the <svg> tags inside the star container (NOT img tags anymore!)
    const stars = document.querySelectorAll('#starContainer svg');

    // 5. Loop through the SVGs and change the <path> inside them
    stars.forEach((svg, index) => {
        
        // Find the <path> tag inside specific SVG
        const path = svg.querySelector('path'); 
        
        if (index < ratingValue) {
            // Change it FILLED star drawing
            path.setAttribute('d', filledStarPath);
        } else {
            // Change it EMPTY star drawing
            path.setAttribute('d', emptyStarPath);
        }
    });
}