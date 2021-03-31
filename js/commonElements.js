"use strict";

let path = window.location.pathname;
let href = path.split("/").pop()
let page = href.split(".").shift();

// ==============
// HEAD STUFF
// Here's where you add the <link>s that are common to all pages in the website:
// the link for style.css and those to get the font from Google
let pageStyle = document.createElement("link");
    pageStyle.rel = "stylesheet";
    pageStyle.href = `css/${page}.css`;

let navStyle = document.createElement("link");
    navStyle.rel = "stylesheet";
    navStyle.href = "css/nav.css";

let style = document.createElement("link");
    style.rel = "stylesheet";
    style.href = "css/style.css";

document.querySelector("head").append(pageStyle, navStyle, style);

// Header
let DOMheader = document.createElement("header");
DOMheader.textContent = "MLADOK - FRIA UNIVERSITET - IN VINO VERITOS";

// Nav
const NAV_HELPER = {
    items: [
        {
            title: "Home",
            href: "index.html"        
        },
        {
            title: "Students",
            href: "students.html"        
        },
        {
            title: "Courses",
            href: "courses.html"        
        }
    ],
    isThisItemForCurrentPage(href) {
        let url = window.location.href;
        return url.includes(href);
    }
};

let DOMnav = document.createElement("nav");
NAV_HELPER.items.forEach(item => {
    let navItem = document.createElement("a");
    navItem.textContent = item.title;
    
    NAV_HELPER.isThisItemForCurrentPage( item.href ) ? undefined : navItem.href = item.href;
    if( !navItem.href ) navItem.className = "current";
    DOMnav.append(navItem);
});

// Main
let DOMmain = document.createElement("main");

// Footer
const DOMfooter = document.createElement("footer");

let footerLeft = document.createElement("span");
footerLeft.textContent = "Democratic Republic of PW21";

let footerRight = document.createElement("span");
footerRight.textContent = "Niagara Malmö";

DOMfooter.append(footerLeft, footerRight);


// Använd denna instruktion för att lägga till alla element till body
document.querySelector("body").append(DOMheader, DOMnav, DOMmain, DOMfooter);




// ======
// FILTER
/*

Tänk på det: Båda flikar (Students och Courses) är i princip exakt likadana:
1) De innehåller ett input fält som bestämmer vad som ska filtreras
2) De söker igenom en array av objekt med utgångspunkt i en av objektens nycklar
        array COURSES (nyckel: "title")
        array STUDENTS (nyckel: "lastName")
3) De presenterar ett DOM-element för varje element i den filtrerade arrayen

Vi skapar därför:
1) En funktion DOMFilter som:
    1) Tar emot dessa argument:
        a) Arrayen som ska filteras
        b) Stringar som berättar:
            b1) vilken nyckel som ska filtreras efter (title eller lastName)
            b2) Vad som ska stå så att användaren förstår hur det fungerar (se video)
        c) Funktionen som ska anropas för att skapa DOM-elementen. Det kommer att
           vara en funktion för Students och en annan för Courses

    2) Returnerar DOM-elementet för filtret så att course.js och student.js kan appenda det i main.
       DOM-elementet har följande element inuti:
        a) <label>, som informerar för användaren hur filtret fungerar
        b) <input>, där användaren skriver strängen vi använder för att filtrera Arrayen  
            b1) <input> ska ha en eventListener för "keyup" så att listan
                av Students eller Courses uppdateras vid varje tangent-tryckning


*/

function DOMFilter(data){
    
    let {baseArray, filterKey, filterLabelName, filterLabelKey, DOMCreator} = data;

    let container = document.createElement("div");
    container.classList.add("filter");

    container.innerHTML = `
        <label>${data.filterLabelName}</label>
        <input type="text" placeholder="case insensitive">
    `;

    // Event Keyup on input
    let input = container.querySelector("input");
    input.addEventListener("keyup", function(){
        filterLabelKey = this.value;
        filterLabelKey = filterLabelKey.toLowerCase();
        clear();
        let filteredArray = baseArray.filter( obj => obj[filterKey].toLowerCase().includes(filterLabelKey) );
        if(filterLabelKey) data.DOMCreator(filteredArray);
    });

    return container;    
}

function clear() {
   document.querySelector(".listContainer").innerHTML = "";
}