const search = document.getElementById('search');

const submit = document.getElementById('submit');

const table = document.getElementById('table');

const tbody = document.getElementById('tbody');

submit.addEventListener('click', (e) => {
    e.preventDefault();
    const words = search.value;
    const query = createQuery(words);
    getData(query);
    setSorted();
})

// search
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
        const authors = current.author_name.join(',');
        const pubYear = current.first_publish_year;
        const numPages = current.number_of_pages_median;
        currentBooks.push([title, authors, pubYear, numPages])
    }
}

// create table entries
function createEntries(){
    clearBody();
    const tbody = document.createElement('tbody')
    for (let book of currentBooks){
        createEntry(tbody, book);
    }
    table.appendChild(tbody);
}

const createEntry = (tbody, entry) => {
    const tr = document.createElement('tr');
    for (let arg of entry){
        const td = document.createElement('td')
        td.innerText = arg;
        tr.appendChild(td)
    }
    tbody.appendChild(tr);
}

const clearBody = () => {
    const tbody = table.getElementsByTagName("tbody")[0];
    if (tbody) table.removeChild(table.getElementsByTagName("tbody")[0]);
}

// sort
const sorted = {};
const setSorted = () => {
    for (let i = 0; i < 4; i++){
        sorted[i] = false;
    }
}

const sorts = document.getElementsByClassName('sort');
for (let sort of sorts){
    sort.addEventListener('click', (e) => {
        e.preventDefault();
        const value = e.currentTarget.getAttribute('value')
        
        if (currentBooks.length > 0){
            if (value <= 1){
                if (!sorted[value]){
                    currentBooks.sort((a, b) => a[value].localeCompare(b[value]));
                    sorted[value] = true;
                } else {
                    currentBooks.sort((a, b) => b[value].localeCompare(a[value]));
                    sorted[value] = false;
                }
            } else {
                if (!sorted[value]){
                    currentBooks.sort((a, b) => a[value] - b[value]);
                    sorted[value] = true;
                } else {
                    currentBooks.sort((a, b) => b[value] - a[value]);
                    sorted[value] = false;
                }
            }
    
            createEntries();
        }
    })
}

