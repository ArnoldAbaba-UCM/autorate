// Faculty Evaluation Auto-Rater
(function() {
    console.log('🎓 Faculty Evaluation Auto-Rater Activated...');
    
    // Configuration variable - change this value to set all ratings
    const DEFAULT_RATING = 5; // Change to 5, 4, 3, 2, or 1
    
    class EvaluationAutoRater {
        constructor() {
            this.currentRating = DEFAULT_RATING;
            this.isActive = false;
            this.panel = null;
        }
        
        initialize() {
            this.createControlPanel();
            console.log(`✅ Auto-Rater Ready! Default rating: ${this.currentRating}`);
        }
        
        createControlPanel() {
            // Remove existing panel if present
            const existingPanel = document.getElementById('auto-rater-panel');
            if (existingPanel) existingPanel.remove();
            
            // Create control panel
            this.panel = document.createElement('div');
            this.panel.id = 'auto-rater-panel';
            this.panel.innerHTML = `
                <div style="
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: #1a237e;
                    color: white;
                    padding: 15px;
                    border-radius: 8px;
                    z-index: 10000;
                    font-family: Arial, sans-serif;
                    font-size: 14px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                    min-width: 200px;
                    border: 2px solid #3949ab;
                ">
                    <div style="
                        display: flex;
                        align-items: center;
                        margin-bottom: 10px;
                        font-weight: bold;
                    ">
                        <span style="margin-right: 10px;">🎯</span>
                        <span>Evaluation Auto-Rater</span>
                    </div>
                    
                    <div style="margin-bottom: 15px;">
                        <div style="font-size: 12px; margin-bottom: 5px; opacity: 0.8;">Set All Ratings:</div>
                        <div style="display: flex; gap: 5px; margin-bottom: 10px;">
                            <button class="rating-btn" data-rating="5" style="background: #4caf50;">5</button>
                            <button class="rating-btn" data-rating="4" style="background: #2196f3;">4</button>
                            <button class="rating-btn" data-rating="3" style="background: #ff9800;">3</button>
                            <button class="rating-btn" data-rating="2" style="background: #ff5722;">2</button>
                            <button class="rating-btn" data-rating="1" style="background: #f44336;">1</button>
                        </div>
                        <div style="font-size: 12px;">
                            Current Rating: <span id="current-rating-display">${this.currentRating}</span>
                            <span id="rating-description" style="margin-left: 5px; font-weight: bold;"></span>
                        </div>
                    </div>
                    
                    <div style="display: flex; gap: 5px;">
                        <button id="apply-rating-btn" style="
                            flex: 1;
                            background: #673ab7;
                            color: white;
                            border: none;
                            padding: 8px;
                            border-radius: 4px;
                            cursor: pointer;
                            font-size: 12px;
                        ">Apply to All</button>
                        <button id="fill-comment-btn" style="
                            flex: 1;
                            background: #009688;
                            color: white;
                            border: none;
                            padding: 8px;
                            border-radius: 4px;
                            cursor: pointer;
                            font-size: 12px;
                        ">Fill Comment</button>
                    </div>
                    
                    <div style="margin-top: 10px; font-size: 11px; opacity: 0.7; text-align: center;">
                        Auto-rate all ${this.countQuestions()} questions
                    </div>
                </div>
            `;
            
            document.body.appendChild(this.panel);
            
            // Add event listeners
            this.addEventListeners();
            this.updateRatingDescription();
        }
        
        addEventListeners() {
            // Rating button clicks
            document.querySelectorAll('.rating-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    this.currentRating = parseInt(e.target.dataset.rating);
                    document.getElementById('current-rating-display').textContent = this.currentRating;
                    this.updateRatingDescription();
                    this.highlightSelectedButton();
                });
            });
            
            // Apply rating button
            document.getElementById('apply-rating-btn').addEventListener('click', () => {
                this.applyRatingToAll();
            });
            
            // Fill comment button
            document.getElementById('fill-comment-btn').addEventListener('click', () => {
                this.fillComment();
            });
            
            this.highlightSelectedButton();
        }
        
        highlightSelectedButton() {
            document.querySelectorAll('.rating-btn').forEach(btn => {
                const rating = parseInt(btn.dataset.rating);
                if (rating === this.currentRating) {
                    btn.style.transform = 'scale(1.1)';
                    btn.style.boxShadow = '0 0 0 2px white';
                } else {
                    btn.style.transform = 'scale(1)';
                    btn.style.boxShadow = 'none';
                }
            });
        }
        
        updateRatingDescription() {
            const descriptions = {
                5: 'Excellent',
                4: 'Very Satisfactory',
                3: 'Satisfactory',
                2: 'Fair/Less Satisfactory',
                1: 'Poor/Unsatisfactory'
            };
            
            const display = document.getElementById('rating-description');
            display.textContent = descriptions[this.currentRating] || '';
            display.style.color = this.getRatingColor(this.currentRating);
        }
        
        getRatingColor(rating) {
            const colors = {
                5: '#4caf50',
                4: '#2196f3',
                3: '#ff9800',
                2: '#ff5722',
                1: '#f44336'
            };
            return colors[rating] || '#666';
        }
        
        countQuestions() {
            // Count all unique radio button groups
            const radioGroups = new Set();
            document.querySelectorAll('input[type="radio"].ratingval').forEach(input => {
                radioGroups.add(input.name);
            });
            return radioGroups.size;
        }
        
        applyRatingToAll() {
            console.log(`Applying rating ${this.currentRating} to all questions...`);
            
            // Get all unique radio button groups
            const radioGroups = {};
            document.querySelectorAll('input[type="radio"].ratingval').forEach(input => {
                if (!radioGroups[input.name]) {
                    radioGroups[input.name] = [];
                }
                radioGroups[input.name].push(input);
            });
            
            let appliedCount = 0;
            
            // For each group, select the radio with matching value
            Object.values(radioGroups).forEach(group => {
                const radioToSelect = group.find(input => parseInt(input.value) === this.currentRating);
                if (radioToSelect) {
                    radioToSelect.checked = true;
                    appliedCount++;
                    
                    // Trigger change event
                    radioToSelect.dispatchEvent(new Event('change', { bubbles: true }));
                }
            });
            
            // Show success message
            this.showFeedback(`✅ Applied rating ${this.currentRating} to ${appliedCount} questions`);
            console.log(`Applied rating to ${appliedCount} questions`);
        }
        
        fillComment() {
            const commentBox = document.getElementById('comment');
            if (commentBox) {
                const comments = {
                    5: "Excellent performance! The teacher consistently demonstrates exceptional skills in all areas, providing outstanding education and support to students.",
                    4: "Very satisfactory performance. The teacher shows strong competence and dedication, creating a positive and effective learning environment.",
                    3: "Satisfactory performance. The teacher meets expectations and provides adequate instruction and support to students.",
                    2: "Fair performance with room for improvement. Some aspects of teaching could be enhanced for better student learning outcomes.",
                    1: "Performance needs significant improvement. Several areas require attention to meet the expected teaching standards."
                };
                
                commentBox.value = comments[this.currentRating] || "Overall satisfactory performance.";
                commentBox.dispatchEvent(new Event('input', { bubbles: true }));
                
                this.showFeedback(`✅ Filled comment for rating ${this.currentRating}`);
                console.log('Comment filled');
            } else {
                this.showFeedback('❌ Comment box not found');
            }
        }
        
        showFeedback(message) {
            // Remove existing feedback
            const existingFeedback = document.getElementById('rater-feedback');
            if (existingFeedback) existingFeedback.remove();
            
            // Create feedback element
            const feedback = document.createElement('div');
            feedback.id = 'rater-feedback';
            feedback.textContent = message;
            feedback.style.cssText = `
                position: fixed;
                top: 80px;
                right: 20px;
                background: #333;
                color: white;
                padding: 10px 15px;
                border-radius: 4px;
                z-index: 10001;
                font-family: Arial, sans-serif;
                font-size: 12px;
                animation: fadeIn 0.3s;
            `;
            
            document.body.appendChild(feedback);
            
            // Remove after 3 seconds
            setTimeout(() => {
                if (feedback.parentNode) {
                    feedback.style.opacity = '0';
                    feedback.style.transition = 'opacity 0.5s';
                    setTimeout(() => feedback.remove(), 500);
                }
            }, 3000);
        }
        
        // Add CSS styles
        addStyles() {
            const style = document.createElement('style');
            style.textContent = `
                .rating-btn {
                    flex: 1;
                    color: white;
                    border: none;
                    padding: 8px 0;
                    border-radius: 4px;
                    cursor: pointer;
                    font-weight: bold;
                    transition: all 0.2s;
                }
                
                .rating-btn:hover {
                    opacity: 0.9;
                    transform: translateY(-1px);
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Initialize the auto-rater
    const rater = new EvaluationAutoRater();
    rater.initialize();
    rater.addStyles();
    
    // Make rater globally accessible for console use
    window.evaluationRater = rater;
    
    // Add global function to set rating from console
    window.setAllRatings = function(rating) {
        if (rating >= 1 && rating <= 5) {
            rater.currentRating = rating;
            document.getElementById('current-rating-display').textContent = rating;
            rater.updateRatingDescription();
            rater.highlightSelectedButton();
            rater.applyRatingToAll();
        } else {
            console.error('Rating must be between 1 and 5');
        }
    };
    
    console.log('💡 Use setAllRatings(5) in console to rate all questions 5');
    console.log('💡 Or use the control panel (top-right) to select rating');

})();