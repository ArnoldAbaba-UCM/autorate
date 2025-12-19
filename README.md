# autorate

paste rani sa console par:

```javascript
const scriptUrl = 'https://raw.githubusercontent.com/ArnoldAbaba-UCM/autorate/main/autoratenigga.js';

fetch(scriptUrl)
  .then(response => response.text())
  .then(scriptText => {
      // Execute the loaded script
      eval(scriptText);
      console.log('✅ Script loaded and executed.');
  })
  .catch(error => console.error('❌ Failed to load script:', error));```
