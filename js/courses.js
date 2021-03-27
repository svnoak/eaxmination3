"use strict";


// Add specific <head> stuff
// Here's where you add <link> and <title>, specific to this page
// Kolla i commonElements.js jag har laggt till en egen grejs där som anpassar css utifrån vilken sida den är på
// för att undvika koddublicering.

// Add Elements in main
const main = document.querySelector("main");

// Add the list (before the filter because wee need it so the filter
// knows where to append the list elements)


main.innerHTML = `
    <div class="listContainer"></div>
`;

// ===============
// Append Filter (place it before the list)
// Läs vad som står på commonElements.js så du vet vilka nycklar och värden data ska ha.
// Notera att DOMFilter bara tar emot ett argument, det måste vara ett objekt med
// flera nyklar.


let data = {
    baseArray: "" ,
    filterKey: "",
    filterLabelName: "Search Courses By Title",
    filterLabel: "",
    filterLabelKey: "",
    DOMCreator() {

    }
};
main.prepend(DOMFilter(data));








// Här kodar du funktionen som ska skapa DOM-elementet för varje kurs.
// Se videon för detaljer om vad som ska ingå i elementet.
// DOMCourse:
// 1) Tar emot ett argument som är ett av objekten i COURSES
// 2) Returnerar ett DOM-element som placeras i .listContainer (det gör DOMFilter)
function DOMCourse(course){
    
    let container = document.createElement("div");
    container.classList.add("course");

    // We add information through functions to make the code more readable.
    // In order to organise the code we declare the functions 
    // inside DOMCourse, since they will only be called from inside DOMCourse.

    // Add Title
    container.append(courseTitle());

    // Add Staff
    container.append(courseStaff());

    // Add Students
    container.append(courseStudents());
    
    return container;



    // We can put these declarations after the return because they are function declarations,
    // not "normal" executable code. "Normal" executable code is not executed
    // if it is placed after a return instruction.

    function courseTitle(){    
        // FYLL_I_HÄR_RÄTT_KOD
    }

    function courseStaff(){
        // FYLL_I_HÄR_RÄTT_KOD
    }

    function courseStudents(){

        // First find all the students that have studied this course
        // let students = ... FYLL_I_HÄR_RÄTT_KOD

        // Then use the array of students that have studied the course to create 
        // another array where each element is an object with the keys:
        // {firstName, lastName, passedCredits (in this course), started: {year, semester} (this course) }
        let studentArray = students.map(student => {
            // In the object student there is information about ALL the courses she has studied.
            // We want to extract the data for one course (the one with courseID)

            // FYLL_I_HÄR_RÄTT_KOD
        });

        // Then sort the students ascending by started.year
        // FYLL_I_HÄR_RÄTT_KOD
    
        // Now do the DOM stuff
        let containerStudents = document.createElement("div");
        containerStudents.classList.add("students");
        container.append(containerStudents);

        containerStudents.innerHTML = `
            <div>Students:</div>
            <div class="list"></div>
        `;
        studentArray.forEach(student => {
            let containerStudent = document.createElement("div");
            containerStudent.classList.add("student");

            // FYLL_I_HÄR_RÄTT_KOD

            containerStudents.querySelector(".list").append(containerStudent);
        });
        
        return containerStudents;
    }

}


// Eftersom du behöver skapa Teachers i två olika platser (under Course Responsible ochunder Teachers)
// så är det enda rimliga att skapa en funktion som tar emot info om läraren och returnerar
// ett DOM-element som kan appendas på rätt ställe.
function DOMTeacher(teacherID){

    // FYLL_I_HÄR_RÄTT_KOD
    
}