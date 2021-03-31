"use strict";

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
    filterKey: "teachers"
};

const details = {
    students: showStudentInformation,
    courses: showCourseInformation,
    teachers: showTeacherInformation
};

// Lägger till ett generellt table element + sidebar
const main = document.querySelector("main");
let tableEl = document.createElement("table");
tableEl.className = "content-table";
main.prepend(tableEl);

let table = document.querySelector("table");

renderTableSet(dataset);
renderSidebar(dataset.filterKey);

let searchbar = document.getElementById("searchbar");
searchbar.addEventListener("keyup", function(){ searchTable(this) });

// För att kunna ta bort antingen table eller sidebar filterfunktioner för omrendering
const site = {
    clearTable() { table.innerHTML = ""; },
    clearSidebar() { document.querySelector(".sidebar div:last-child").remove() }
}

// Skapar detaljradhuvuden
function generateDetailsHead(keys, parentRow) {
    let row = document.createElement("tr");
    row.className="details";
    createHead( keys, row );
    parentRow.after(row);
}

// Detaljrader för studenterna
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
                    let td = document.createElement("td");
                    teacherID.forEach( id => {
                        let staff = document.createElement("li");
                        let firstName = TEACHERS.find( teacher => teacher.teacherID == id ).firstName;
                        let lastName = TEACHERS.find( teacher => teacher.teacherID == id ).lastName;
                        let post = TEACHERS.find( teacher => teacher.teacherID == id ).post;
                        staff.textContent = `${firstName[0]} ${lastName}`;
                        td.appendChild(staff);
                    });
                    tr.appendChild(td);
                }

                else if ( key == "courseResponsible") {
                    let td = document.createElement("td");
                    let id = [TEACHERS.find( teacher => teacher.teacherID == course.courseResponsible ).teacherID];
                    let firstName = TEACHERS.find( teacher => teacher.teacherID == id ).firstName;
                    let lastName = TEACHERS.find( teacher => teacher.teacherID == id ).lastName;
                    let post = TEACHERS.find( teacher => teacher.teacherID == id ).post;
                    let resp = document.createElement("li");
                    resp.textContent = `${firstName[0]} ${lastName}`;
                    td.appendChild(resp);
                    tr.appendChild(td);
                }
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

// Detaljrader för kurserna
function showCourseInformation(set, key, parentRow){
        let value = set[key];

        let teacherKeys;
        
        if ( key == "teachers" || key == "courseResponsible" ) {
        if (typeof(value) == "number") value = [value];
        if ( value.length > 1 ) {
            let index = set.teachers.indexOf(set.courseResponsible);
            value.splice(index,1);
        }
            value.forEach( id => {
                let tr = document.createElement("tr");
                tr.className = "details";
                let teacher = TEACHERS.find( teacher => teacher.teacherID == id );
                teacher.role = key == "teachers" ? "Teacher" : "Course Responsible";
                teacherKeys = Object.keys(teacher);
                Object.keys(teacher).forEach( key => {
                    let td = document.createElement("td");
                    td.textContent = teacher[key];
                    tr.append(td);
                })
                parentRow.after(tr);
            })
            generateDetailsHead(teacherKeys, parentRow);
        }
}

// Detaljrader för lärarna
function showTeacherInformation(set, key, parentRow){
    let id;
    let courseKeys;
    if ( typeof(set[key]) == "number" ) id = set[key];
    
    if (id || id == 0) {
        let courses = COURSES.filter( course => course.teachers.includes(id) || course.courseResponsible == id );
        courses.forEach( course => {
            let tr = document.createElement("tr");
            tr.className = "details";
            courseKeys = Object.keys(course);
            courseKeys.splice(3, 3);
            courseKeys.push("Role", "");
            console.log(courseKeys);
            courseKeys.forEach( key => {
                let td = document.createElement("td");
                td.textContent = course[key];
                if ( key == "Role" ) td.textContent = course.courseResponsible == id ? "Responsible" : "Teacher";
                tr.append(td);
            })
            parentRow.after(tr);
        })
        generateDetailsHead(courseKeys, parentRow);
    }
}

// Collapsar raderna, sortering fixar också att raderna collapsar.
// De tas bort varje gång för att vara uppdaterade nästa gång de renderas ifall datan skulle ha ändrats.
// Finns en skillnad om alla tas bort eller om bara siblingen till den som man klickade tar bort
function collapseRow(row, remove) {
    event.stopPropagation();
    if (remove) {
        // Om det är sista elementet i tabellen så finns det inget sibling.
        let siblingExists = (row.nextSibling == null || row.nextSibling.className != "details") ? true : false; 
        if ( siblingExists ) {
            row.querySelectorAll("td").forEach( td => td.classList.add("selected") );
            let id = row.children[1].textContent;
            let set = dataset[dataset.filterKey][id];
            Object.keys(set).forEach( key => details[dataset.filterKey](set, key, row) );
            row.lastChild.children[0].style.transform = "rotate(180deg)";
        }
        else { removeDetails(row); }
    }

    else { removeDetails(row); };

    function removeDetails(row) {
        try { while(row.nextSibling.classList.contains("details")) row.nextSibling.remove(); } catch{}
        row.querySelectorAll("td").forEach( td => td.classList.remove("selected") );
        row.lastChild.children[0].style.transform = "rotate(0)";
    }
}

// Kollar vilken Filterkey som används och skickar vidare rätt dataset för att generera table
function renderTableSet(array) {
    array = array[dataset.filterKey] || array;
    let dataKeys = Object.keys(dataset[dataset.filterKey][0]);
    
    // Lägger manuellt till en extra key för checkboxarna
    dataKeys.unshift("select");
    generateTableHead(table, dataKeys);
    generateTableBody(table, array);
}

// Skapar en tablehead utifrån 
function generateTableHead(table, data) {
    let thead = table.createTHead();
    let row = thead.insertRow();
    
    data = data.splice(0,4);

    // Lägger manuellt till en extra key för pilarna för att de inte ska ha en titel.
    data.push("");
    createHead(data, row);

    for ( let i in table.querySelectorAll("thead tr th")) {
        i = i++;
        if (!isNaN(i)) {
            table.querySelectorAll("thead tr th")[i].className = ".headerbtn";
            table.querySelectorAll("thead tr th")[i].addEventListener("click", () => {
            sortTable(i);
            })
        }
    }
}

// Skapar Table head, oavsett om inne i TableBody eller det övergripande head.
function createHead(data, row) {
    for ( let key of data ) {
        let th = document.createElement("th");
        let arrow = document.createElement("i");
        let text = document.createTextNode(capitaliseKeys(key));
        arrow.appendChild(th);
        th.appendChild(text);
        row.appendChild(th);
    }
}

// Skapar TableBody
function generateTableBody(table, data) {
    let tbody = table.createTBody();

    for (let element of data) {
        
        element = Object.keys(element).slice(0, 3).reduce((result, key) => {
            result[key] = element[key];

            return result;
        }, {});

    let row = tbody.insertRow();
    row.addEventListener("click", function() {
        collapseRow(this, true);
    });

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
function renderSidebar() {
    let sidebar = document.createElement("div");
    sidebar.className = "sidebar";
    sidebar.appendChild(tableChoice());
    let sidebarChoices = document.createElement("div");
    sidebarChoices.innerHTML = `
    <label>Search:</label>
    <input id="searchbar" placeholder="..."></input>
    `;

    sidebar.appendChild(sidebarChoices);
    main.prepend(sidebar);
}

// Skapa knapparna som man kan välja mellan tabeller med. Den skapar så många knappar som det finns datasets.
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
        button.addEventListener("click", function() {chooseTable(dataset)});
        menu.appendChild(button);
    })

    return menu;
}

// Söka i tabell i sökfältet
function searchTable(search) {
    let searchKey = search.value.toLowerCase();
    let filteredArray;
    if ( dataset.filterKey == "courses" ) filteredArray = dataset[dataset.filterKey].filter( obj => obj.title.toLowerCase().includes(searchKey) );
    if ( dataset.filterKey != "courses" ) filteredArray = dataset[dataset.filterKey].filter( obj => obj.firstName.toLowerCase().includes(searchKey) ||  obj.lastName.toLowerCase().includes(searchKey) );
    site.clearTable();
    renderTableSet(filteredArray);
}

// välja vilken tabell som ska visas
function chooseTable(array) {
    if( event.target.textContent.toLowerCase() != dataset.filterKey ) {
        dataset.filterKey = event.target.textContent.toLowerCase();
        site.clearTable();
        renderTableSet(array);
        setActiveButton();
    }
}

// Sätter knappen som väljer tabell till active
function setActiveButton() {
    let btn = document.querySelectorAll(".menu button");
    document.querySelectorAll(".menu button").forEach( btn => btn.classList.remove("active") );
    btn.forEach( btn => { if (btn.textContent.toLowerCase() == dataset.filterKey) btn.classList.add("active") } );
}

// För att kunna putta in objekten och ladda ner.
function selectingRow() {
    event.stopPropagation();
}

// Gör keys stora som ska stå i head som rubriker/titlar
function capitaliseKeys(key) {
    key.includes("ID") ? 
        key = key.split(/(?=[I])/)[0].toUpperCase() + " " +  key.split(/(?=[I])/)[1] :
        key = key.split(/(?=[A-Z])/).length == 1 ?
        key = key.split(/(?=[A-Z])/)[0].toUpperCase() :
        key = key.split(/(?=[A-Z])/)[0].toUpperCase() + " " +  key.split(/(?=[A-Z])/)[1].toUpperCase();
    return key;
}

// Sorting the table when clicking on the head (only main head)
function sortTable(n) {

    var rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    switching = true;

    table.querySelectorAll(".row").forEach( row => collapseRow(row, false) );

    dir = "asc"; 

    while (switching) {

      switching = false;
      rows = table.rows;
      for (i = 1; i < (rows.length - 1); i++) {

        shouldSwitch = false;

        x = rows[i].getElementsByTagName("td")[n];
        y = rows[i + 1].getElementsByTagName("td")[n];

        let a = parseInt(x.innerHTML) || x.innerHTML.toLowerCase();
        let b = parseInt(y.innerHTML) || y.innerHTML.toLowerCase();

        if (dir == "asc") {
          if (a > b) {
            shouldSwitch= true;
            break;
          }
        } else if (dir == "desc") {
          if (a < b) {
            shouldSwitch = true;
            break;
          }
        }
      }
      if (shouldSwitch) {

        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;

        switchcount ++;      
      } else {

        if (switchcount == 0 && dir == "asc") {
          dir = "desc";
          switching = true;
        }
      }
    }
  }