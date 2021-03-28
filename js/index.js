"use strict";


// Add specific <head> stuff
// Here's where you add <link> and <title>, specific to this page
// Dataset så man kommer åt de olika arrayn variabelt.

let fontawesome = document.createElement("script");
fontawesome.setAttribute("src","https://kit.fontawesome.com/0bbe81ee43.js");
fontawesome.setAttribute("crossorigin","anonymous");

let studentjs = document.createElement("script");
studentjs.setAttribute("src", "css/students.js");
let coursesjs = document.createElement("script");
coursesjs.setAttribute("src", "css/courses.js");


document.querySelector("head").appendChild(fontawesome);
document.body.prepend(studentjs);
document.body.prepend(coursesjs);

let dataset = {
    students: STUDENTS,
    courses: COURSES,
    teachers: TEACHERS,
    filterKey: "students"
};

// Lägger till ett generellt table element.
const main = document.querySelector("main");
let tableEl = document.createElement("table");
tableEl.className = "content-table";
main.prepend(tableEl);

let table = document.querySelector("table");

renderTableSet(dataset);
main.prepend(sidebar());

// Kollar vilken Filterkey som används och skickar vidare rätt dataset för att generera table
function renderTableSet(dataset) {  
    let dataKeys = Object.keys(dataset[dataset.filterKey][0]);

    // Lägger manuellt till en extra key för checkboxarna
    dataKeys.unshift("select");

    generateTableHead(table, dataKeys);
    generateTableBody(table, dataset[dataset.filterKey]);
}

function generateTableHead(table, data) {
    let thead = table.createTHead();
    let row = thead.insertRow();
    
    data = data.splice(0,4);

    // Lägger manuellt till en extra key för pilarna
    data.push("");
    for ( let key of data ) {

        // Lägger till mellanrum och gör allt uppercase
        key.includes("ID") ? 
        key = key.split(/(?=[I])/)[0].toUpperCase() + " " +  key.split(/(?=[I])/)[1] :
        key = key.split(/(?=[A-Z])/).length == 1 ?
        key = key.split(/(?=[A-Z])/)[0].toUpperCase() :
        key = key.split(/(?=[A-Z])/)[0].toUpperCase() + " " +  key.split(/(?=[A-Z])/)[1].toUpperCase();

        let th = document.createElement("th");
        let text = document.createTextNode(key);
        th.appendChild(text);
        row.appendChild(th);
    }
}

function generateTableBody(table, data) {

    let tbody = table.createTBody();

    for (let element of data) {
        
        element = Object.keys(element).slice(0, 3).reduce((result, key) => {
            result[key] = element[key];

            return result;
        }, {});

    let row = tbody.insertRow();
    row.addEventListener("click", collapseRow);

    let checkContainer = document.createElement("td");

    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "checkbox";
    checkbox.addEventListener("click", selectingRow);
    checkContainer.appendChild(checkbox);

    row.prepend(checkContainer);

    // Course har Credits som nummer i sista td, så därför får de en annan style.
    if ( dataset.filterKey == "courses" ) row.className = "course row";
    if ( dataset.filterKey != "courses" ) row.className = "table row";
    for (let key in element) {
    let cell = row.insertCell();
    let text = document.createTextNode(element[key]);
    cell.appendChild(text);
    }

    let iconContainer = document.createElement("td");
    let icon = document.createElement("i");
    icon.className = "fas fa-chevron-down";
    iconContainer.appendChild(icon);
    row.append(iconContainer);
    }
}

// Lägger till en sidebar som har nkappar för att välja vilken array vi vill ha
// Och en search bar, kommer till lite olika filterfunktioner och en exportfunktion.
function sidebar() {
    let sidebar = document.createElement("div");
    sidebar.className = "sidebar";
    sidebar.appendChild(tableChoice());
    let sidebarChoices = document.createElement("div");
    sidebarChoices.innerHTML = `
    <label>Search:</label>
    <input id="searchbar" placeholder="..."></input>  
    `;

    sidebar.appendChild(sidebarChoices);

    return sidebar;
}

function tableChoice() {
    
    let menu = document.createElement("div");
    menu.className = "menu";
    
    let choices = Object.keys(dataset);
    choices.splice(choices.length-1);

    choices.forEach( choice => {
        choice = choice.charAt(0).toUpperCase() + choice.slice(1);
        let button = document.createElement("button");
        button.textContent = choice;
        if ( choice.toLowerCase() == dataset.filterKey ) button.classList.add("active");
        button.addEventListener("click", filterTable);
        menu.appendChild(button);
    })

    return menu;
}

function filterTable() {
    dataset.filterKey = this.textContent.toLowerCase();
    clearTable();
    renderTableSet(dataset);
    setActiveButton(this);
}

function clearTable() {
    table.innerHTML = "";
}

function setActiveButton(btn) {
    document.querySelectorAll(".menu button").forEach( btn => btn.classList.remove("active") );
    btn.classList.add("active");
}

function collapseRow() {
    event.stopPropagation();
    let row = this;

    if ( row.nextSibling.className != "details" ) {

        row.querySelectorAll("td").forEach( td => td.style.fontWeight = "bold" );

        let id = row.children[1].textContent;
        let container = document.createElement("tr");
        container.className = "details";
        let div = document.createElement("div");
        
        let set = dataset[dataset.filterKey][id];
        
        Object.keys(set).forEach( key => {
            
                if (typeof(set[key]) == "object") {
                    set[key].forEach( c => {

                        /*
                        
                        Jag håller på att hitta varje students kurs för collapsiga raderna i tabellen.
                        Vill nog gärna fixa in en till tabell kanske? Oavsett vill jag kunna bearbeta om personen är med i kursen eller inte.
                        
                        */
                        let course = COURSES.find( course => course.courseID == c.courseID);
                        let courseName = course.title;
                        
                        let span = document.createElement("li");
                        span.textContent = courseName;

                        div.appendChild(span);
                    })
                }

        } );
        container.appendChild(div);

        row.after(container);

        row.lastChild.children[0].style.transform = "rotate(180deg)";

    }

    else {
        row.nextSibling.remove();
        row.querySelectorAll("td").forEach( td => td.style.fontWeight = "normal" );
        row.lastChild.children[0].style.transform = "rotate(0)";
    }
}

function selectingRow() {
    event.stopPropagation();
}