document.addEventListener("DOMContentLoaded", function () {
    var swiper = new Swiper('.swiper-container', {
        slidesPerView: 1,
        spaceBetween: 10,
        loop: true,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
    });

    // Load Product Data from JSON File for Carousel and Product List
    fetch('products.json')
        .then(response => response.json())
        .then(products => {
            const swiperWrapper = document.querySelector(".swiper-wrapper");
            swiperWrapper.innerHTML = ""; // Clear existing slides
            const productContainer = document.getElementById("product-list");
            productContainer.innerHTML = ""; // Clear previous product listings

            // Loop through products and dynamically generate slides and product cards
            products.forEach(product => {
                // Add to Carousel
                let slide = `
                    <div class="swiper-slide">
                        <img src="${product["Image 1"]}" alt="${product["Product Title"]}">
                    </div>
                `;
                swiperWrapper.innerHTML += slide;

                // Add to Product List
                let productCard = `
                    <div class="product-card">
                        <img src="${product["Image 1"]}" alt="${product["Product Title"]}">
                        <h3>${product["Product Title"]}</h3>
                        <p>Price: ${product.price || "N/A"}</p>
                        <p>Stock: ${product.stock || "Out of Stock"} available</p>
                    </div>
                `;
                productContainer.innerHTML += productCard;
            });

            // Reinitialize Swiper after dynamically adding slides
            swiper.update();
        })
        .catch(error => console.error('Error loading products:', error));
});
