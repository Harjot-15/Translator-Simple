// Waits for the DOM content to be fully loaded before executing any scripts
document.addEventListener('DOMContentLoaded', function() {
    // Populates the language options in the dropdowns
    populateLanguageOptions();
    // Ensures the source and target languages are different
    ensureDifferentLanguages();
    // Adds event listeners to handle various interactions
    document.getElementById('sourceText').addEventListener('input', translateText);
    document.getElementById('sourceLanguage').addEventListener('change', ensureDifferentLanguages);
    document.getElementById('targetLanguage').addEventListener('change', ensureDifferentLanguages);
    document.querySelector('.swap-languages').addEventListener('click', swapLanguages);
});

// Function to populate the language selection dropdowns
function populateLanguageOptions() {
    // Defines available language options,And We Can Add More.
    const languageOptions = {
        'en': 'English',
        'es': 'Spanish',
        'pa': 'Punjabi',
        'hi': 'Hindi',
        'ur': 'Urdu',
        'fa': 'Persian',
        'fr': 'French',
        'tr': 'Turkish',
    };

    // Get references to the source and target language dropdown elements
    let sourceLanguageSelect = document.getElementById('sourceLanguage');
    let targetLanguageSelect = document.getElementById('targetLanguage');

    // Populates the dropdowns with language options
    Object.entries(languageOptions).forEach(([code, language]) => {
        sourceLanguageSelect.add(new Option(language, code));
        targetLanguageSelect.add(new Option(language, code));
    });
    // Sets default languages for the dropdowns
    sourceLanguageSelect.value = 'en'; // Sets source language to English
    targetLanguageSelect.value = 'hi'; // Sets target language to Hindi
}

// Function to ensure that the source and target languages are not the same
function ensureDifferentLanguages() {
    // Gets the currently selected values for source and target languages
    let sourceLang = document.getElementById('sourceLanguage').value;
    let targetLang = document.getElementById('targetLanguage').value;

    // If the source and target languages are the same, changes the target language
    if (sourceLang === targetLang) {
        let targetLanguageSelect = document.getElementById('targetLanguage');
        for (let i = 0; i < targetLanguageSelect.options.length; i++) {
            if (targetLanguageSelect.options[i].value !== sourceLang) {
                targetLanguageSelect.value = targetLanguageSelect.options[i].value;
                break;
            }
        }
    }
}

// Function to translate text when input is provided
function translateText() {
    // Get the text input and selected languages
    let text = document.getElementById('sourceText').value.trim();
    let sourceLang = document.getElementById('sourceLanguage').value;
    let targetLang = document.getElementById('targetLanguage').value;

    // If there's no text, clears the translation field and exits the function
    if (!text) {
        document.getElementById('translatedText').value = '';
        return;
    }

    // Defines the API key and endpoint URL for the translation service
  // We Read About How to Take The API Hidden Using ENV file but didn't Get That How To Set That Up SO Used IN This Way
    const apiKey = 'Your_API_Key';
    const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;

    // Makes a POST request to the translation service
    fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            q: text,
            source: sourceLang,
            target: targetLang,
            format: 'text'
        })
    })
    .then(response => response.json())
    .then(data => {
        // Updates the translation field with the translated text
        if (data.data && data.data.translations) {
            document.getElementById('translatedText').value = data.data.translations[0].translatedText;
        }
    })
    .catch(error => {
        // Logs any errors to the console To Get The Problem
        console.error('Error with the translation request:', error);
    });
}

// Function to swap the source and target languages
function swapLanguages() {
    // Get references to the source and target language dropdowns
    let sourceLanguageSelect = document.getElementById('sourceLanguage');
    let targetLanguageSelect = document.getElementById('targetLanguage');
    // Swaps the values of the source and target languages
    [sourceLanguageSelect.value, targetLanguageSelect.value] = [targetLanguageSelect.value, sourceLanguageSelect.value];
    // Re-translates the text with the new language settings
    translateText();
}
    // Toggloe Between Dark And Light Mode
document.getElementById('modeToggle').addEventListener('change', function() {
    document.body.classList.toggle('dark-mode', this.checked);
});
