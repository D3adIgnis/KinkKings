// Initialize Firebase
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Fetch products from Firestore
async function fetchProducts() {
    const productContainer = document.getElementById("product-list");
    productContainer.innerHTML = ""; // Clear existing products

    try {
        const querySnapshot = await db.collection("products").limit(12).get();
        querySnapshot.forEach(doc => {
            const product = doc.data();
            
            // Build image carousel if multiple images exist
            let imageCarousel = "";
            if (product.images.length > 1) {
                imageCarousel = `
                    <div class="swiper-container">
                        <div class="swiper-wrapper">
                            ${product.images.map(img => `
                                <div class="swiper-slide">
                                    <img src="${img}" alt="${product.title}">
                                </div>`).join("")}
                        </div>
                        <div class="swiper-button-next"></div>
                        <div class="swiper-button-prev"></div>
                        <div class="swiper-pagination"></div>
                    </div>
                `;
            } else {
                imageCarousel = `<img src="${product.images[0]}" alt="${product.title}">`;
            }

            // Create product card
            let productCard = `
                <div class="product-card">
                    ${imageCarousel}
                    <h3>${product.title}</h3>
                    <p>Price: $${product.price.toFixed(2)}</p>
                    <p>Stock: ${product.stock} available</p>
                    <button class="add-to-cart" data-id="${doc.id}">Add to Cart</button>
                </div>
            `;
            
            productContainer.innerHTML += productCard;
        });

        // Initialize Swiper after images load
        new Swiper('.swiper-container', {
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

    } catch (error) {
        console.error("Error loading products:", error);
    }
}

// Load products when the page loads
document.addEventListener("DOMContentLoaded", fetchProducts);
