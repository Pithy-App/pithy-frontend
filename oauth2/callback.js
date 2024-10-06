const redditUrlInput = document.getElementById('reddit-url');
const queryList = document.getElementById('query-list');
const submitBtn = document.getElementById('submit-btn');
const addQueryBtn = document.getElementById('add-query-btn');
let queryCount = 1;

function checkFormValidity() {
    const isUrlValid = redditUrlInput.checkValidity();
    const allQueriesFilled = Array.from(document.querySelectorAll('input[name="queries[]"]'))
        .every(input => input.value.trim() !== '');

    submitBtn.disabled = !(isUrlValid && allQueriesFilled);
}

addQueryBtn.addEventListener('click', function() {
    queryCount++;
    const newQuery = document.createElement('div');
    newQuery.innerHTML = `
        <label for="query-${queryCount}">Query ${queryCount}:</label>
        <input type="text" id="query-${queryCount}" name="queries[]" placeholder="Enter a query" required>
    `;
    queryList.appendChild(newQuery);
});

redditUrlInput.addEventListener('input', checkFormValidity);
queryList.addEventListener('input', checkFormValidity);

submitBtn.onclick = function(event) {
    event.preventDefault();
    
    const urlParams = new URLSearchParams(window.location.search);
    const state = urlParams.get('state');
    const code = urlParams.get('code');
    const redditUrl = redditUrlInput.value;
    const queries = Array.from(document.querySelectorAll('input[name="queries[]"]'))
        .map(input => input.value.trim());

    console.log({ state, code, redditUrl, queries });

    // TODO: Call backend with data.
};