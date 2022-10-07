const search = document.getElementById('search');

const submit = document.getElementById('submit');

const table = document.getElementById('table');

const tbody = document.getElementById('tbody');

submit.addEventListener('click', (e) => {
    e.preventDefault();
    const words = search.value;
    const query = createQuery(words);
    // clearTable();
    getData(query);
})

const createQuery = (words) => {
    const query = words.split(' ');
    let result = query[0];
    for (let i = 1; i < query.length; i++){
        result += `+${query[i]}`
    }

    return result;
}

let currentBooks = [];

async function getData (query){
    const url = `http://openlibrary.org/search.json?title=${query}`;
    await fetch(url)
        .then(res => res.json())
        .then(data => dataToBooks(data, 5));

    createEntries();
}

const dataToBooks = (data, num) => {
    currentBooks = [];
    for (let i = 0; i < num; i++){
        const current = data.docs[i];
        const title = current.title;
        const authors = current.author_name;
        const pubYear = current.first_publish_year;
        const numPages = current.number_of_pages_median;
        currentBooks.push([title, authors, pubYear, numPages])
    }
}

function createEntries(){
    clearBody();
    const tbody = document.createElement('tbody')
    for (let book of currentBooks){
        createEntry(tbody, book);
    }
    table.appendChild(tbody);
}

const createEntry = (tbody, entry) => {
    entry[1] = entry[1].join(',');
    const tr = document.createElement('tr');
    for (let arg of entry){
        const td = document.createElement('td')
        td.innerText = arg;
        tr.appendChild(td)
    }
    tbody.appendChild(tr);
}

const clearBody = () => {
    table.removeChild(table.getElementsByTagName("tbody")[0]);
}

