document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const form = document.getElementById('prediction-form');
    const formCard = document.getElementById('form-card');
    const resultCard = document.getElementById('result-card');
    
    const priceResult = document.getElementById('price-result');
    const priceCategory = document.getElementById('price-category');
    
    const summaryArea = document.getElementById('summary-area');
    const summaryBedrooms = document.getElementById('summary-bedrooms');
    const summaryBathrooms = document.getElementById('summary-bathrooms');
    const summaryAge = document.getElementById('summary-age');
    
    const errorContainer = document.getElementById('error-container');
    const errorMessage = document.getElementById('error-message');
    const predictBtn = document.getElementById('predict-btn');
    const resetBtn = document.getElementById('reset-btn');
    const newPredictionBtn = document.getElementById('new-prediction-btn');
    
    const historyList = document.getElementById('history-list');
    const clearHistoryBtn = document.getElementById('clear-history-btn');
    
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    // State
    const HISTORY_KEY = 'housePriceHistory';
    let predictionHistory = JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];

    // Initialize
    renderHistory();

    // Event Listeners
    mobileMenu.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Close mobile menu on link click
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Hide previous errors
        errorContainer.classList.add('hidden');
        
        // Get values
        const area = parseFloat(document.getElementById('area').value);
        const bedrooms = parseInt(document.getElementById('bedrooms').value);
        const bathrooms = parseInt(document.getElementById('bathrooms').value);
        const age = parseInt(document.getElementById('age').value);

        // Validation
        if (area <= 0 || bedrooms <= 0 || bathrooms <= 0 || age < 0) {
            showError("Please enter valid positive numbers for all fields.");
            return;
        }

        // UI Loading State
        const originalBtnContent = predictBtn.innerHTML;
        predictBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Analyzing...';
        predictBtn.disabled = true;

        try {
            // API Call
            const response = await fetch('/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ area, bedrooms, bathrooms, age }),
            });

            const data = await response.json();

            if (data.error) {
                showError(data.error);
            } else {
                showResult(data.predicted_price, { area, bedrooms, bathrooms, age });
                saveToHistory(data.predicted_price, { area, bedrooms });
            }
        } catch (error) {
            showError("An error occurred while connecting to the server. Is it running?");
            console.error('Error:', error);
        } finally {
            // Restore button state
            predictBtn.innerHTML = originalBtnContent;
            predictBtn.disabled = false;
        }
    });

    resetBtn.addEventListener('click', () => {
        errorContainer.classList.add('hidden');
    });

    newPredictionBtn.addEventListener('click', () => {
        // Hide result, show form
        resultCard.classList.add('hidden');
        formCard.classList.remove('hidden');
        
        // Smooth scroll to predictor
        document.getElementById('predictor').scrollIntoView({ behavior: 'smooth' });
    });

    clearHistoryBtn.addEventListener('click', () => {
        predictionHistory = [];
        localStorage.removeItem(HISTORY_KEY);
        renderHistory();
    });

    // Helper Functions
    function showError(message) {
        errorMessage.textContent = message;
        errorContainer.classList.remove('hidden');
    }

    function showResult(price, inputs) {
        // Format price
        const formattedPrice = new Intl.NumberFormat('en-IN', {
            maximumFractionDigits: 0
        }).format(price);
        
        priceResult.textContent = formattedPrice;
        
        // Populate summary
        summaryArea.textContent = `${inputs.area} sq ft`;
        summaryBedrooms.textContent = inputs.bedrooms;
        summaryBathrooms.textContent = inputs.bathrooms;
        summaryAge.textContent = `${inputs.age} yrs`;
        
        // Determine category based on price
        if (price < 250000) {
            priceCategory.textContent = 'Budget';
            priceCategory.style.color = 'var(--text-main)';
            priceCategory.style.background = 'rgba(255, 255, 255, 0.2)';
        } else if (price < 500000) {
            priceCategory.textContent = 'Mid-Range';
            priceCategory.style.color = 'var(--primary-light)';
            priceCategory.style.background = 'rgba(76, 201, 240, 0.2)';
        } else {
            priceCategory.textContent = 'Premium';
            priceCategory.style.color = 'var(--success)';
            priceCategory.style.background = 'rgba(16, 185, 129, 0.2)';
        }
        
        // Hide form, show result
        formCard.classList.add('hidden');
        resultCard.classList.remove('hidden');
        
        // Scroll to result
        resultCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function saveToHistory(price, inputs) {
        const historyItem = {
            id: Date.now(),
            date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
            price: price,
            area: inputs.area,
            bedrooms: inputs.bedrooms
        };

        // Add to beginning of array
        predictionHistory.unshift(historyItem);
        
        // Keep only last 5
        if (predictionHistory.length > 5) {
            predictionHistory.pop();
        }
        
        localStorage.setItem(HISTORY_KEY, JSON.stringify(predictionHistory));
        renderHistory();
    }

    function renderHistory() {
        if (predictionHistory.length === 0) {
            historyList.innerHTML = '<li class="empty-history">No recent predictions.</li>';
            return;
        }

        historyList.innerHTML = '';
        
        predictionHistory.forEach(item => {
            const formattedPrice = new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
                maximumFractionDigits: 0
            }).format(item.price);
            
            const li = document.createElement('li');
            li.className = 'history-item';
            
            li.innerHTML = `
                <div class="history-meta">
                    <span><i class="fa-regular fa-clock"></i> ${item.date}</span>
                </div>
                <div class="history-details">
                    <span>${item.area} sq ft, ${item.bedrooms} bed</span>
                    <span class="history-price">${formattedPrice}</span>
                </div>
            `;
            
            historyList.appendChild(li);
        });
    }

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const nav = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            nav.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.5)';
        } else {
            nav.style.boxShadow = 'none';
        }
    });
});
