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

const details = {
    students: showStudentInformation,
    courses: showCourseInformation,
    teachers: showTeacherInformation
};

// Lägger till ett generellt table element.
const main = document.querySelector("main");
let tableEl = document.createElement("table");
tableEl.className = "content-table";
main.prepend(tableEl);

let table = document.querySelector("table");

renderTableSet(dataset);
main.prepend(sidebar());

function generateDetailsHead(keys, parentRow) {

    let row = document.createElement("tr");
    row.className="details";
    createHead( keys, row );

    parentRow.after(row);
}

function showStudentInformation(set, key, parentRow) {
    if (typeof(set[key]) == "object") {

        let courseKeys;

        set[key].forEach( c => {
            let tr = document.createElement("tr");
            tr.className = "details";
            let course = COURSES.find( course => course.courseID == c.courseID);
            courseKeys = Object.keys(course);
            courseKeys.forEach( key => {

                if( key == "teachers") {
                    let teacherID = course[key];
                    teacherID.forEach( id => {
                        let staff = document.createElement("li");
                        let firstName = TEACHERS.find( teacher => teacher.teacherID == id ).firstName;
                        let lastName = TEACHERS.find( teacher => teacher.teacherID == id ).lastName;
                        let post = TEACHERS.find( teacher => teacher.teacherID == id ).post;
                        staff.textContent = `${firstName[0]} ${lastName} (${post})`;
                        tr.appendChild(staff);
                    });
                }

                // if ( key == "courseResponsible") {
                //     let id = [TEACHERS.find( teacher => teacher.teacherID == course.courseResponsible ).teacherID];
                //     let firstName = TEACHERS.find( teacher => teacher.teacherID == id ).firstName;
                //     let lastName = TEACHERS.find( teacher => teacher.teacherID == id ).lastName;
                //     let post = TEACHERS.find( teacher => teacher.teacherID == id ).post;
                //     let resp = document.createElement("li");
                //     resp.textContent = `${firstName[0]} ${lastName} (${post})`;
                //     tr.appendChild(resp);
                // }
                else {
                let td = document.createElement("td");
                td.textContent = course[key];      
                tr.appendChild(td);
                }
            })
            parentRow.after(tr);
        })
        generateDetailsHead(courseKeys, parentRow);
    }
}

function showCourseInformation(){}

function showTeacherInformation(){}

function collapseRow() {
    event.stopPropagation();
    let row = this;

    if ( row.nextSibling.className != "details" ) {

        row.querySelectorAll("td").forEach( td => td.classList.add("selected") );

        let id = row.children[1].textContent;
        let set = dataset[dataset.filterKey][id];

        Object.keys(set).forEach( key => details[dataset.filterKey](set, key, row) );
        row.lastChild.children[0].style.transform = "rotate(180deg)";
    }

    else {
        while(row.nextSibling.classList.contains("details")) row.nextSibling.remove();

        row.querySelectorAll("td").forEach( td => td.classList.remove("selected") );
        row.lastChild.children[0].style.transform = "rotate(0)";
    }
}

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
    createHead(data, row);
}

function createHead(data, row) {
    for ( let key of data ) {
        let th = document.createElement("th");
        let text = document.createTextNode(capitaliseKeys(key));
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

function selectingRow() {
    event.stopPropagation();
}

function capitaliseKeys(key) {
    key.includes("ID") ? 
        key = key.split(/(?=[I])/)[0].toUpperCase() + " " +  key.split(/(?=[I])/)[1] :
        key = key.split(/(?=[A-Z])/).length == 1 ?
        key = key.split(/(?=[A-Z])/)[0].toUpperCase() :
        key = key.split(/(?=[A-Z])/)[0].toUpperCase() + " " +  key.split(/(?=[A-Z])/)[1].toUpperCase();
    return key;
}