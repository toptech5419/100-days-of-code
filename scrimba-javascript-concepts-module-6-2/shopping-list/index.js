const addItemBtn = document.getElementById('add-item-btn'); 
const itemInput = document.getElementById('item-input');
const list = document.getElementById('list');
let removeAllBtn = document.getElementById('remove-all-btn');


let shoppingList = JSON.parse(localStorage.getItem('shoppingList')) || [];
updateDOMFromStorage();

function addItem() {
    const item = itemInput.value.trim(); 
    if (!item) {
        alert('Item cannot be empty');
        removeAllBtn.disabled = shoppingList.length === 0;
    } else if (shoppingList.includes(item)) {
        alert('No duplicates allowed');
    } else {
        shoppingList.push(item);
        updateLocalStorage();
        addItemToDOM(item);
        removeAllBtn.disabled = false;
    }
    itemInput.value = ''; 
}


function addItemToDOM(item) {
    const li = document.createElement('li');
    li.classList.add('list-item');
    li.innerHTML = `
        ${item} <button class="remove-btn">Remove</button>
    `;

    
    const removeBtn = li.querySelector('.remove-btn');
    removeBtn.addEventListener('click', function () {
        removeItem(item, li);
    });

    list.appendChild(li);
}


function removeItem(item, listItem) {
    const index = shoppingList.indexOf(item);
    if (index > -1) {
        shoppingList.splice(index, 1); 
        updateLocalStorage();
        list.removeChild(listItem); 
    }
    removeAllBtn.disabled = shoppingList.length === 0;
}


function removeAll() {
    if (shoppingList.length > 0) {
        shoppingList = []; 
        updateLocalStorage();
        list.innerHTML = ''; 
        removeAllBtn.disabled = true;
    }
}


function updateLocalStorage() {
    localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
}


function updateDOMFromStorage() {
    shoppingList.forEach(addItemToDOM);
    removeAllBtn.disabled = shoppingList.length === 0;
}


addItemBtn.addEventListener('click', addItem);


itemInput.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        addItem();
    }
});

removeAllBtn.addEventListener('click', removeAll);
