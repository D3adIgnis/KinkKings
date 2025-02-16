import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getFirestore, collection, getDocs, query, orderBy, limit, doc, updateDoc, increment } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAvzEbwtrjRifb3C_Ee-UYyEfJb9g_4hLc",
    authDomain: "kinkkings-toys.firebaseapp.com",
    projectId: "kinkkings-toys",
    storageBucket: "kinkkings-toys.appspot.com",
    messagingSenderId: "628196071186",
    appId: "1:628196071186:web:6eaa266a2de6ef7ece45cb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Fetch Best-Selling Products and Update Carousel
async function fetchBestSellers() {
    const carouselContainer = document.querySelector(".swiper-wrapper");
    carouselContainer.innerHTML = ""; // Clear existing products

    try {
        const q = query(collection(db, "products"), orderBy("sales_count", "desc"), limit(6));
        const querySnapshot = await getDocs(q);
        
        querySnapshot.forEach((doc) => {
            const product = doc.data();
            const slide = `
                <div class="swiper-slide">
                    <div class="carousel-item">
                        <img src="${product.images[0] || 'default-image.jpg'}" alt="${product.title}">
                        <p class="carousel-title">${product.title}</p>
                    </div>
                </div>
            `;
            carouselContainer.innerHTML += slide;
        });

        // Initialize Swiper.js after images load
        new Swiper('.swiper-container', {
            slidesPerView: 1,
            spaceBetween: 10,
            loop: true,
            autoplay: {
                delay: 3000, // Switch image every 3 seconds
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
        console.error("Error loading best sellers:", error);
    }
}

// Function to update `sales_count` when an item is purchased
async function updateSalesCount(productId) {
    const productRef = doc(db, "products", productId);
    await updateDoc(productRef, {
        sales_count: increment(1)  // Increase sales count by 1
    });
    console.log(`✅ Sales count updated for product ID: ${productId}`);
}

// Add event listeners to all "Add to Cart" buttons
document.addEventListener("click", function(event) {
    if (event.target.classList.contains("add-to-cart")) {
        const productId = event.target.dataset.id;
        updateSalesCount(productId);
    }
});

// Load best sellers when the page loads
document.addEventListener("DOMContentLoaded", fetchBestSellers);
