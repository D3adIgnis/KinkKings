import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getFirestore, collection, getDocs, query, orderBy, limit, doc, updateDoc, increment } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

let db; // Global Firestore database reference

/**
 * Fetch Firebase configuration securely
 */
async function getFirebaseConfig() {
    try {
        const response = await fetch("firebase-config.json");
        if (!response.ok) throw new Error("Failed to load Firebase config. Ensure the file is available.");
        return await response.json();
    } catch (error) {
        console.error("❌ ERROR: Firebase configuration load failed:", error);
        return null;
    }
}

/**
 * Initialize Firebase and Firestore
 */
async function initFirebase() {
    const firebaseConfig = await getFirebaseConfig();
    if (!firebaseConfig) {
        console.error("❌ ERROR: Firebase initialization aborted due to missing config.");
        return;
    }

    try {
        const app = initializeApp(firebaseConfig);
        db = getFirestore(app); // Assign Firestore database globally
        console.log("✅ Firebase Initialized Securely");

        fetchBestSellers();
    } catch (error) {
        console.error("❌ ERROR: Firebase initialization failed:", error);
    }
}

/**
 * Fetch and display best-selling products in the carousel
 */
async function fetchBestSellers() {
    const carouselContainer = document.getElementById("best-sellers-carousel");
    if (!carouselContainer) {
        console.error("❌ ERROR: Carousel container not found.");
        return;
    }

    carouselContainer.innerHTML = `<p class="loading-message">🔄 Loading best sellers...</p>`; // Show loading message

    try {
        const q = query(
            collection(db, "products"),
            orderBy("sales_count", "desc"),
            limit(6)
        );

        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            console.warn("⚠️ No best-selling products found.");
            carouselContainer.innerHTML = `<p class="no-products">No best sellers available at the moment.</p>`;
            return;
        }

        let slides = "";
        querySnapshot.forEach((doc) => {
            const product = doc.data();
            const productImage = product.images?.[0] || 'https://via.placeholder.com/300x300?text=No+Image';
            const productTitle = product.title || "Unnamed Product";

            slides += `
                <div class="swiper-slide">
                    <div class="carousel-item">
                        <img src="${productImage}" alt="${productTitle}" loading="lazy">
                        <p class="carousel-title">${productTitle}</p>
                    </div>
                </div>
            `;
        });

        carouselContainer.innerHTML = slides;
        initializeSwiper();

    } catch (error) {
        console.error("❌ ERROR: Failed to load best sellers:", error);
        carouselContainer.innerHTML = `<p class="error-message">⚠️ Failed to load best sellers. Please try again later.</p>`;
    }
}

/**
 * Initialize Swiper.js after best sellers are loaded
 */
function initializeSwiper() {
    if (window.swiperInstance) {
        window.swiperInstance.destroy(true, true); // Destroy existing instance before reinitializing
    }

    window.swiperInstance = new Swiper('.swiper-container', {
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

    console.log("✅ Swiper Initialized Successfully");
}

/**
 * Update `sales_count` when an item is purchased
 */
async function updateSalesCount(productId) {
    if (!productId) {
        console.error("❌ ERROR: Missing product ID.");
        return;
    }

    try {
        const productRef = doc(db, "products", productId);
        await updateDoc(productRef, {
            sales_count: increment(1)
        });
        console.log(`✅ SUCCESS: Sales count updated for product ID: ${productId}`);
    } catch (error) {
        console.error(`❌ ERROR: Failed to update sales count for product ID: ${productId}`, error);
    }
}

/**
 * Event Listener: Detect clicks on "Add to Cart" buttons
 */
document.addEventListener("click", function(event) {
    if (event.target.classList.contains("add-to-cart")) {
        const productId = event.target.dataset.id;
        updateSalesCount(productId);
    }
});

/**
 * Hamburger Menu - Top Left Corner
 */
document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.querySelector(".menu-toggle");
    const slideMenu = document.querySelector(".slide-menu");
    const closeMenu = document.querySelector(".close-menu");

    if (menuToggle && slideMenu) {
        menuToggle.addEventListener("click", () => {
            slideMenu.classList.toggle("show");
        });

        closeMenu.addEventListener("click", () => {
            slideMenu.classList.remove("show");
        });
    }
});

/**
 * Load Firebase securely when page loads
 */
document.addEventListener("DOMContentLoaded", initFirebase);
