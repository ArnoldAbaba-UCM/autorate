// Pinterest Image Extractor v3.0 - Direct DOM Assault
// Paste this into console on ANY Pinterest page to extract ALL high-quality images
// This script tears through their obfuscation like a digital chainsaw

(function() {
    'use strict';
    
    // Create injection point for our rebel UI
    const injectStyle = () => {
        const style = document.createElement('style');
        style.textContent = `
            .rebel-extractor-ui {
                position: fixed !important;
                top: 20px !important;
                left: 20px !important;
                background: #000 !important;
                border: 3px solid #e60023 !important;
                padding: 20px !important;
                z-index: 2147483647 !important;
                border-radius: 12px !important;
                color: white !important;
                font-family: 'Courier New', monospace !important;
                max-width: 500px !important;
                box-shadow: 0 0 30px rgba(230, 0, 35, 0.7) !important;
                backdrop-filter: blur(10px) !important;
            }
            .rebel-header {
                color: #e60023 !important;
                font-size: 18px !important;
                font-weight: bold !important;
                margin-bottom: 15px !important;
                text-transform: uppercase !important;
                letter-spacing: 1px !important;
            }
            .rebel-url {
                word-break: break-all !important;
                background: #111 !important;
                padding: 10px !important;
                margin: 10px 0 !important;
                border-left: 3px solid #e60023 !important;
                font-size: 12px !important;
                max-height: 100px !important;
                overflow-y: auto !important;
            }
            .rebel-image-container {
                margin: 15px 0 !important;
                border: 2px solid #333 !important;
                border-radius: 8px !important;
                overflow: hidden !important;
                max-height: 300px !important;
            }
            .rebel-image-container img {
                width: 100% !important;
                height: auto !important;
                display: block !important;
            }
            .rebel-button {
                flex: 1 !important;
                background: #e60023 !important;
                color: white !important;
                border: none !important;
                padding: 12px !important;
                cursor: pointer !important;
                font-weight: bold !important;
                border-radius: 6px !important;
                margin: 5px !important;
                transition: all 0.2s !important;
            }
            .rebel-button:hover {
                background: #ff1a36 !important;
                transform: translateY(-2px) !important;
            }
            .rebel-button.secondary {
                background: #333 !important;
            }
            .rebel-button.secondary:hover {
                background: #444 !important;
            }
            .rebel-button-group {
                display: flex !important;
                gap: 10px !important;
                margin-top: 15px !important;
                flex-wrap: wrap !important;
            }
            .rebel-stats {
                font-size: 11px !important;
                color: #888 !important;
                margin-top: 10px !important;
                display: flex !important;
                justify-content: space-between !important;
            }
            .rebel-close {
                position: absolute !important;
                top: 10px !important;
                right: 10px !important;
                background: transparent !important;
                color: #888 !important;
                border: none !important;
                font-size: 20px !important;
                cursor: pointer !important;
                width: 30px !important;
                height: 30px !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
            }
            .rebel-close:hover {
                color: white !important;
            }
        `;
        document.head.appendChild(style);
    };

    // Extract ALL possible image sources with aggressive DOM traversal
    const extractAllImages = () => {
        console.log('%c[REBEL EXTRACTOR]%c Scanning DOM for hidden treasures...', 
                   'color:red;font-weight:bold;font-size:14px;', 'color:white;');
        
        const imageSources = new Set();
        const highQualitySources = [];
        
        // Phase 1: Direct image elements
        document.querySelectorAll('img').forEach(img => {
            if (img.src && img.src.includes('pinimg.com')) {
                const cleanUrl = img.src.split('?')[0];
                imageSources.add(cleanUrl);
                
                // Prioritize high-res sources
                if (cleanUrl.includes('/originals/') || 
                    cleanUrl.includes('/736x/') || 
                    cleanUrl.includes('/750x/') ||
                    cleanUrl.includes('/1200x/')) {
                    highQualitySources.push(cleanUrl);
                }
            }
        });
        
        // Phase 2: Background images (Pinterest's favorite hiding spot)
        document.querySelectorAll('*').forEach(element => {
            const style = window.getComputedStyle(element);
            const bgImage = style.backgroundImage;
            
            if (bgImage && bgImage.includes('pinimg.com')) {
                const urlMatch = bgImage.match(/url\(["']?(.*?)["']?\)/);
                if (urlMatch && urlMatch[1]) {
                    const cleanUrl = urlMatch[1].split('?')[0];
                    imageSources.add(cleanUrl);
                    
                    if (cleanUrl.includes('/originals/')) {
                        highQualitySources.push(cleanUrl);
                    }
                }
            }
        });
        
        // Phase 3: Data attributes and meta tags
        document.querySelectorAll('[data-test-id*="image"], [data-test-id*="pin"], [data-test-id*="closeup"]').forEach(el => {
            ['src', 'data-src', 'data-image-url', 'data-original-url', 'data-pin-url'].forEach(attr => {
                const val = el.getAttribute(attr);
                if (val && val.includes('pinimg.com')) {
                    const cleanUrl = val.split('?')[0];
                    imageSources.add(cleanUrl);
                }
            });
        });
        
        // Phase 4: JSON-LD structured data (often contains originals)
        const scriptTags = document.querySelectorAll('script[type="application/ld+json"]');
        scriptTags.forEach(script => {
            try {
                const data = JSON.parse(script.textContent);
                if (data.image) {
                    const urls = Array.isArray(data.image) ? data.image : [data.image];
                    urls.forEach(url => {
                        if (url.includes('pinimg.com')) {
                            const cleanUrl = url.split('?')[0];
                            imageSources.add(cleanUrl);
                            if (cleanUrl.includes('/originals/')) {
                                highQualitySources.push(cleanUrl);
                            }
                        }
                    });
                }
                
                // Recursive search in nested objects
                const findImages = (obj) => {
                    if (!obj || typeof obj !== 'object') return;
                    
                    for (let key in obj) {
                        if (key.toLowerCase().includes('image') || key.toLowerCase().includes('url')) {
                            const value = obj[key];
                            if (typeof value === 'string' && value.includes('pinimg.com')) {
                                const cleanUrl = value.split('?')[0];
                                imageSources.add(cleanUrl);
                            }
                        } else if (typeof obj[key] === 'object') {
                            findImages(obj[key]);
                        }
                    }
                };
                findImages(data);
            } catch (e) {
                // Silently fail - we're rebels, not perfectionists
            }
        });
        
        // Phase 5: srcset attributes
        document.querySelectorAll('img[srcset]').forEach(img => {
            const srcset = img.getAttribute('srcset');
            if (srcset) {
                srcset.split(',').forEach(source => {
                    const url = source.trim().split(' ')[0];
                    if (url.includes('pinimg.com')) {
                        const cleanUrl = url.split('?')[0];
                        imageSources.add(cleanUrl);
                    }
                });
            }
        });
        
        // Sort by quality - originals first, then by resolution
        const sortedImages = Array.from(imageSources).sort((a, b) => {
            const aIsOriginal = a.includes('/originals/');
            const bIsOriginal = b.includes('/originals/');
            
            if (aIsOriginal && !bIsOriginal) return -1;
            if (!aIsOriginal && bIsOriginal) return 1;
            
            // Extract resolution from URL pattern
            const getResolution = (url) => {
                const match = url.match(/\/(\d+)x(\d+)\//);
                return match ? parseInt(match[1]) * parseInt(match[2]) : 0;
            };
            
            return getResolution(b) - getResolution(a);
        });
        
        return {
            allImages: sortedImages,
            bestImage: highQualitySources[0] || sortedImages[0],
            count: sortedImages.length
        };
    };
    
    // Create the rebel interface
    const createRebelUI = (results) => {
        // Remove existing UI if present
        const existingUI = document.querySelector('.rebel-extractor-ui');
        if (existingUI) existingUI.remove();
        
        injectStyle();
        
        const ui = document.createElement('div');
        ui.className = 'rebel-extractor-ui';
        
        let imagePreview = '';
        if (results.bestImage) {
            imagePreview = `
                <div class="rebel-image-container">
                    <img src="${results.bestImage}" 
                         onerror="this.parentElement.innerHTML='<div style=\\'padding:20px;color:#888;\\'>Preview failed to load<br>Direct extraction still works</div>'">
                </div>
            `;
        }
        
        ui.innerHTML = `
            <button class="rebel-close" onclick="this.parentElement.remove()">×</button>
            <div class="rebel-header">REBEL IMAGE EXTRACTOR</div>
            ${imagePreview}
            <div class="rebel-url" id="rebelUrlDisplay">${results.bestImage || 'No image found'}</div>
            <div class="rebel-button-group">
                <button class="rebel-button" onclick="window.open('${results.bestImage}', '_blank')">OPEN IN TAB</button>
                <button class="rebel-button secondary" onclick="navigator.clipboard.writeText('${results.bestImage}').then(() => alert('URL copied!'))">COPY URL</button>
                <button class="rebel-button" onclick="extractAndDownload()">DOWNLOAD ALL (${results.count})</button>
            </div>
            <div class="rebel-stats">
                <span>${results.count} images found</span>
                <span>${results.bestImage ? '✓ HQ extraction' : '✗ No HQ source'}</span>
            </div>
        `;
        
        document.body.appendChild(ui);
        
        // Add download function to global scope
        window.extractAndDownload = async () => {
            console.log('%c[DOWNLOAD]%c Initiating mass extraction...', 
                       'color:cyan;font-weight:bold;', 'color:white;');
            
            let downloaded = 0;
            const failed = [];
            
            for (let i = 0; i < results.allImages.length; i++) {
                const url = results.allImages[i];
                try {
                    const response = await fetch(url);
                    const blob = await response.blob();
                    const blobUrl = URL.createObjectURL(blob);
                    
                    const a = document.createElement('a');
                    a.href = blobUrl;
                    a.download = `pinterest_${Date.now()}_${i}.jpg`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    
                    URL.revokeObjectURL(blobUrl);
                    downloaded++;
                    
                    // Update UI progress
                    const stats = ui.querySelector('.rebel-stats');
                    if (stats) {
                        stats.innerHTML = `<span>Downloaded: ${downloaded}/${results.allImages.length}</span>
                                          <span>Failed: ${failed.length}</span>`;
                    }
                    
                    // Small delay to prevent browser choking
                    await new Promise(resolve => setTimeout(resolve, 100));
                    
                } catch (error) {
                    console.error(`Failed to download ${url}:`, error);
                    failed.push(url);
                }
            }
            
            alert(`Download complete!\nSuccess: ${downloaded}\nFailed: ${failed.length}`);
            
            if (failed.length > 0) {
                console.log('Failed URLs:', failed);
            }
        };
    };
    
    // Main execution
    const results = extractAllImages();
    
    if (results.allImages.length > 0) {
        console.log('%c[SUCCESS]%c Found', 'color:green;font-weight:bold;', 
                   `${results.allImages.length} images. Best source:`, results.bestImage);
        console.log('All sources:', results.allImages);
        
        createRebelUI(results);
        
        // Auto-copy best URL if user consents
        if (confirm(`Found ${results.allImages.length} images!\nBest quality: ${results.bestImage}\n\nCopy best URL to clipboard?`)) {
            navigator.clipboard.writeText(results.bestImage).then(() => {
                console.log('%c[CLIPBOARD]%c Best URL copied', 'color:cyan;font-weight:bold;');
            });
        }
    } else {
        console.log('%c[FAILURE]%c No Pinterest images detected', 'color:orange;font-weight:bold;');
        alert('No Pinterest images found on this page.\nMake sure you\'re on a Pinterest pin or board page.');
    }
    
    // Return results for programmatic access
    return results;
})();
