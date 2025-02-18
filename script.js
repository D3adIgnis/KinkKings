import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getFirestore, collection, getDocs, query, orderBy, limit, doc, updateDoc, increment } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

let db; // Global Firestore database reference

/**
 * Fetch Firebase configuration securely
 */
async function getFirebaseConfig() {
    try {
        const response = await fetch("firebase-config.json");
        if (!response.ok) throw new Error("❌ ERROR: Failed to load Firebase config.");
        return await response.json();
    } catch (error) {
        console.error(error);
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
        db = getFirestore(app);
        console.log("✅ Firebase Initialized Successfully");

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

    carouselContainer.innerHTML = `<p class="loading-message">🔄 Loading best sellers...</p>`;

    try {
        const q = query(collection(db, "products"), orderBy("sales_count", "desc"), limit(6));
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
 * Event Listener: Detect clicks on "Add to Cart" buttons dynamically
 */
document.addEventListener("click", function(event) {
    if (event.target.classList.contains("add-to-cart")) {
        const productId = event.target.dataset.id;
        updateSalesCount(productId);
    }
});

/**
 * Hamburger Menu (Sidebar Navigation)
 */
document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.getElementById("menu-toggle");
    const sidebar = document.getElementById("sidebar");
    const closeBtn = document.getElementById("close-btn");
    const overlay = document.getElementById("overlay");

    if (menuToggle && sidebar && closeBtn && overlay) {
        // Open Sidebar
        menuToggle.addEventListener("click", () => {
            sidebar.classList.add("show");
            overlay.classList.add("show");
        });

        // Close Sidebar
        closeBtn.addEventListener("click", () => {
            sidebar.classList.remove("show");
            overlay.classList.remove("show");
        });

        // Close when clicking outside
        overlay.addEventListener("click", () => {
            sidebar.classList.remove("show");
            overlay.classList.remove("show");
        });

        // Close on "Escape" key press
        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                sidebar.classList.remove("show");
                overlay.classList.remove("show");
            }
        });
    } else {
        console.error("❌ ERROR: Sidebar elements missing from the DOM.");
    }
});

/**
 * Load Firebase securely when page loads
 */
document.addEventListener("DOMContentLoaded", initFirebase);
