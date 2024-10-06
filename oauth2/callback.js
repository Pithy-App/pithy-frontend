// Enable submit button only if all fields are filled correctly
const redditUrlInput = document.getElementById('reddit-url');
const positiveQueryInput = document.getElementById('positive-query');
const negativeQueryInput = document.getElementById('negative-query');
const submitBtn = document.getElementById('submit-btn');

function checkFormValidity() {
    const isUrlValid = redditUrlInput.checkValidity();
    const isPositiveFilled = positiveQueryInput.value.trim() !== '';
    const isNegativeFilled = negativeQueryInput.value.trim() !== '';

    submitBtn.disabled = !(isUrlValid && isPositiveFilled && isNegativeFilled);
}

redditUrlInput.addEventListener('input', checkFormValidity);
positiveQueryInput.addEventListener('input', checkFormValidity);
negativeQueryInput.addEventListener('input', checkFormValidity);

submitBtn.onclick = function(event) {
    event.preventDefault();
    
    const urlParams = new URLSearchParams(window.location.search);
    const state = urlParams.get('state');
    const code = urlParams.get('code');

    const redditUrl = redditUrlInput.value;
    const positiveQuery = positiveQueryInput.value;
    const negativeQuery = negativeQueryInput.value;

    console.log(redditUrl, positiveQuery, negativeQuery, state, code);

    // TODO: Call backend with data.
};