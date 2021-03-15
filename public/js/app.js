const table = document.querySelector('table.table');
const addBtn = document.getElementById('js-add');
const form = addBtn?.parentNode;

/**
 * Return the nth parentNode
 * @param {Node} node
 * @param {Number} depth
 * @returns {Node}
 */
function getParentNode(node, depth)
{
    for (let i = 0; i < depth; i++) {
        node = node.parentNode
    }
    return node;
}

/**
 * Do the ajax request and log the results + callback
 * @param {Object} datas
 * @param {CallableFunction} callback
 */
function fetchJson(datas, callback)
{
    let headers = {method: datas.method};
    if (datas.body) headers['body'] = datas.body
    fetch(datas.url, headers)
        .then(response => {
            let status = 'error';
            let message = 'Une erreur est survenu, veuillez réessayer'
            if (response.ok) {
                response.json().then(json => {
                    message = json.message;
                    if (json.code === 200) {
                        status = 'success';
                        callback(json);
                    }
                    console.log(`${status} : ${message}`);
                })
            } else {
                console.log(`${status} : ${message}`);
            }
        })
}

/**
 * Check if the add form is valid or not
 * @returns {boolean}
 */
function formIsValid()
{
    let condition1 = document.getElementById('voiture_name').value.length >= 5;
    let condition2 = document.getElementById('voiture_description').value.length >= 10;
    return condition1 && condition2;
}

/**
 * Get a formatted date from YYYY-MM-DDTHH:MM:SS format
 * @param {String} date
 * @returns {String}
 */
function getDate(date)
{
    let frags = date.split('-');
    let time = frags[2].matchAll(/\d{2}/g);

    return `${time.next().value}/${frags[1]}/${frags[0]} à ${time.next().value}:${time.next().value}`
}

/**
 * Add the new line in the table
 * @param {Object} datas
 */
function addLine(datas)
{
    let html =
        `<tr>
            <td><a href="/voiture/${datas.id}">${datas.name}</a></td>
            <td>${datas.description}</td>
            <td>${getDate(datas.createdAt)}</td>
            <td>
                <form method="post" action="/voiture/${datas.id}" onsubmit="return confirm('Voulez-vous supprimer cet élément ?');">
                    <button id="js-delete" class="btn btn-danger">Supprimer</button>
                </form>
            </td>
        </tr>`
    let tbody = table.querySelector('tbody')
    if (document.getElementById('order-down')) {
        tbody.innerHTML += html;
    } else {
        tbody.innerHTML = html + tbody.innerHTML;
    }
}

/**
 * Sort the table by the date field
 * @param inverted
 */
function sortTable(inverted = false) {
    let rows = table.querySelectorAll('tr');
    rows = [...rows];
    rows.shift();
    rows.pop();

    let toSort = [];
    console.log(rows)

    for (let i = 0; i < rows.length; i++) {
        toSort = [...toSort, {'row': rows[i], 'date': rows[i].querySelector('td:nth-child(3)').innerText}]
    }

    toSort.sort((a, b) => {
        let strDate = [];
        [a, b].forEach(row => {
            let frags = row.date.split('/');
            let year = frags[2].match(/\d{4}/);
            let time = frags[2].replace(/\d{4} à /, '').matchAll(/\d{2}/g);
            strDate = [... strDate, `${year}${frags[1]}${frags[0]}${time.next().value}${time.next().value}`]
        })
        let value = 0;
        value = (strDate[0] > strDate[1]) ? 1 : -1;
        return value;
    })

    if (inverted) toSort = toSort.reverse();

    let tbody = table.querySelector(('tbody'));

    for (let row of rows) {
        row.remove();
    }
    for (let row of toSort) {
        tbody.appendChild(row.row);
    }
}



//Event listeners

// Enable or disable the add btn
form?.addEventListener('input', () => {
    if (formIsValid()) {
        addBtn.removeAttribute('disabled');
    } else {
        addBtn.setAttribute('disabled', 'true');
    }
})

// Delete the elements
table?.addEventListener('click', (e) => {
    switch (e.target.id) {
        case 'js-delete':
            e.preventDefault();
            let url = e.target.parentNode.getAttribute('action');
            fetchJson({'url': url, 'method': 'DELETE'}, () => {
                getParentNode(e.target, 3).remove();
            })
            break;
        case 'order-down': {
            let caret = e.target;
            caret.classList.replace('fa-caret-down', 'fa-caret-up');
            sortTable(true);
            caret.id = 'order-up';
            break;
        }
        case 'order-up': {
            let caret = e.target;
            caret.classList.replace('fa-caret-up', 'fa-caret-down');
            sortTable();
            caret.id = 'order-down';
            break;
        }
    }
})

// Add a new element
addBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    if (formIsValid()) {
        fetchJson({
            'url' : '/voiture/new',
            'method' : 'POST',
            'body' : new FormData(form)
        }, (json) => {
            addLine(json.data)
        })
    }
})
