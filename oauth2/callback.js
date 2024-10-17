const redditUrlInput = document.getElementById('reddit-url');
const queryList = document.getElementById('query-list');
const submitBtn = document.getElementById('submit-btn');
const addQueryBtn = document.getElementById('add-query-btn');
let queryCount = 1;

const colors = ['#4caf50', '#f44336', '#ff9800', '#2196f3', '#9c27b0'];
const greyedOutColor = '#d3d3d3';

let categoryPieChart = null;

function checkFormValidity() {
    const isUrlValid = redditUrlInput.checkValidity();
    const allQueriesFilled = Array.from(document.querySelectorAll('input[name="queries[]"]'))
        .every(input => input.value.trim() !== '');

    submitBtn.disabled = !(isUrlValid && allQueriesFilled);
}

addQueryBtn.addEventListener('click', function () {
    queryCount++;
    const newQuery = document.createElement('div');
    newQuery.innerHTML = `
        <label for="query-${queryCount}">Query ${queryCount}:</label>
        <input type="text" id="query-${queryCount}" name="queries[]" placeholder="Enter a query" required>
    `;
    queryList.appendChild(newQuery);
    checkFormValidity();
});

redditUrlInput.addEventListener('input', checkFormValidity);
queryList.addEventListener('input', checkFormValidity);

submitBtn.onclick = async function (event) {
    event.preventDefault();

    const redditUrl = redditUrlInput.value;
    const queries = Array.from(document.querySelectorAll('input[name="queries[]"]'))
        .map(input => input.value.trim());

    const queriesObject = queries.reduce((obj, query, index) => {
        obj[`query-${index + 1}`] = query;
        return obj;
    }, {});

    const payload = {
        platform: "reddit",
        postUrl: redditUrl,
        queries: queriesObject
    };

    try {
        const data = await fetchCommentsFromAPI(payload);
        // TODO: Uncomment
        //await getComments(data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

async function fetchCommentsFromAPI(payload) {
    const response = await fetch('https://bhdfgagbo8.execute-api.us-east-2.amazonaws.com/dev/processUserInput', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        throw new Error('Failed to fetch data from the API');
    }

    const result = await response.json();
    console.log('API Response:', result);

    return result;
}

async function getComments(data) {
    const categoryCounts = {};
    data.comments.forEach(comment => {
        categoryCounts[comment.category] = (categoryCounts[comment.category] || 0) + 1;
    });

    const labels = Object.keys(categoryCounts);
    const counts = Object.values(categoryCounts);

    let selectedCategory = null;

    if (categoryPieChart) {
        categoryPieChart.destroy();
    }

    const ctx = document.getElementById('pie-chart').getContext('2d');
    categoryPieChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: counts,
                backgroundColor: colors,
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                },
            },
            onClick: (event, elements) => {
                if (elements.length > 0) {
                    const clickedIndex = elements[0].index;
                    selectedCategory = labels[clickedIndex];
                    updateChartColors(labels, selectedCategory);
                    showCommentsByCategory(data, selectedCategory);
                }
            }
        }
    });
}

function showCommentsByCategory(data, category) {
    const commentsContainer = document.getElementById('comments-container');
    commentsContainer.innerHTML = '';

    const filteredComments = data.comments.filter(comment => comment.category === category);

    if (filteredComments.length === 0) {
        commentsContainer.innerHTML = '<p>No comments available for this category.</p>';
        return;
    }

    filteredComments.forEach(comment => {
        const commentElement = document.createElement('div');
        commentElement.className = 'comment';
        commentElement.textContent = comment.body;
        commentsContainer.appendChild(commentElement);
    });
}

function updateChartColors(labels, selectedCategory) {
    const newBackgroundColors = labels.map((label, index) => {
        return selectedCategory === label ? colors[index] : greyedOutColor;
    });

    if (categoryPieChart) {
        categoryPieChart.data.datasets[0].backgroundColor = newBackgroundColors;
        categoryPieChart.update();
    }
}
