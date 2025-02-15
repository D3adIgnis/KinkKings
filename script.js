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

    // Load Product Data from JSON File or API
    fetch('products.json') // Ensure you have a products.json file
        .then(response => response.json())
        .then(products => {
            const productContainer = document.getElementById("product-list");
            products.forEach(product => {
                let productCard = `
                    <div class="product-card">
                        <img src="${product.image}" alt="${product.title}">
                        <h3>${product.title}</h3>
                        <p>Price: ${product.price}</p>
                        <p>Stock: ${product.stock} available</p>
                    </div>
                `;
                productContainer.innerHTML += productCard;
            });
        })
        .catch(error => console.error('Error loading products:', error));
});
