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

    // Sample Product Data (Replace with JSON from CSV)
    const products = [
        {
            title: "Magic Wand Original HV-260",
            image: "https://cdn.shopify.com/s/files/1/0070/9994/0905/products/1_large.jpg",
            price: "$98.50",
            stock: 2626
        },
        {
            title: "Coochy Shave Cream-Au Natural 32oz",
            image: "https://cdn.shopify.com/s/files/1/0070/9994/0905/products/2_large.jpg",
            price: "$62.00",
            stock: 2273
        }
        // Add more products here or load dynamically
    ];

    // Display Products on Website
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
});
