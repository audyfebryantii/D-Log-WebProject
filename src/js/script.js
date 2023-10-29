const addBox = document.querySelector(".add-box"),
popupBox = document.querySelector(".popup-box"),
popupTitle = popupBox.querySelector("header p"),
closeIcon = popupBox.querySelector("header i"),
titleTag = popupBox.querySelector("input"),
descTag = popupBox.querySelector("textarea"),
addBtn = popupBox.querySelector("button"),
totalNotesELement = document.getElementById("total-notes"),
notesContainer = document.querySelector(".notes-container"),
searchInput = document.getElementById("search");


const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const notes = JSON.parse(localStorage.getItem("notes") || "[]");
let isUpdate = false, updateId;

addBox.addEventListener("click", () => {
    popupTitle.innerText = "Add a new Note";
    addBtn.innerText = "Add Note";
    popupBox.classList.add("show");
    document.querySelector("body").style.overflow = "hidden";
    if(window.innerWidth > 660) titleTag.focus();
});

closeIcon.addEventListener("click", () => {
    isUpdate = false;
    titleTag.value = descTag.value = "";
    popupBox.classList.remove("show");
    document.querySelector("body").style.overflow = "auto";
});

function updateTotalNotes() {
    const totalNotes = notes.length;
    totalNotesELement.textContent = totalNotes;
}
updateTotalNotes();

function showNotes() {
    if(!notes) return;
    notesContainer.innerHTML = '';
    notes.forEach((note, id) => {
        let filterDesc = note.description.replaceAll("\n", '<br/>');
        let liTag = `<li class="note">
                        <div class="details">
                            <p>${note.title}</p>
                            <span>${filterDesc}</span>
                        </div>
                        <div class="bottom-content">
                            <span>${note.date}</span>
                            <div class="settings">
                                <i onclick="updateNote(${id}, '${note.title}', '${filterDesc}')"><i class="uil uil-edit"></i></i>
                                <i onclick="deleteNote(${id})"><i class="uil uil-trash"></i></i>
                            </div>
                        </div>
                    </li>`;
        notesContainer.insertAdjacentHTML("beforeend", liTag);
    });
}
showNotes();

function deleteNote(noteId) {
    let confirmDel = confirm("Are you sure you want to delete this note?");
    if(!confirmDel) return;
    notes.splice(noteId, 1);
    localStorage.setItem("notes", JSON.stringify(notes));
    showNotes();
    updateTotalNotes();
}

function updateNote(noteId, title, filterDesc) {
    let description = filterDesc.replaceAll('<br/>', '\r\n');
    updateId = noteId;
    isUpdate = true;
    addBox.click();
    titleTag.value = title;
    descTag.value = description;
    popupTitle.innerText = "Update a Note";
    addBtn.innerText = "Save";
}

function searchNotes() {
    const searchInputValue = searchInput.value.toLowerCase();

    const filteredNotes = notes.filter((note) => {
        const title = note.title.toLowerCase();
        const description = note.description.toLowerCase();
        const date = note.date.toLowerCase();

        return title.includes(searchInputValue) || description.includes(searchInputValue) || date.includes(searchInputValue);
    });

    showFilteredNotes(filteredNotes);
}

function showFilteredNotes(filteredNotes) {
    notesContainer.innerHTML = '';
    filteredNotes.forEach((note, id) => {
        let filterDesc = note.description.replaceAll("\n", '<br/>');
        let liTag = `<li class="note">
                        <div class="details">
                            <p>${note.title}</p>
                            <span>${filterDesc}</span>
                        </div>
                        <div class="bottom-content">
                            <span>${note.date}</span>
                            <div class="settings">
                                <i onclick="updateNote(${id}, '${note.title}', '${filterDesc}')"><i class="uil uil-edit"></i></i>
                                <i onclick="deleteNote(${id})"><i class="uil uil-trash"></i></i>
                            </div>
                        </div>
                    </li>`;
        notesContainer.insertAdjacentHTML("beforeend", liTag);
    });
}

addBtn.addEventListener("click", e => {
    e.preventDefault();
    let title = titleTag.value.trim(),
    description = descTag.value.trim();

    if(title || description) {
        let currentDate = new Date(),
        month = months[currentDate.getMonth()],
        day = currentDate.getDate(),
        year = currentDate.getFullYear();

        let noteInfo = {title, description, date: `${month} ${day}, ${year}`}
        if(!isUpdate) {
            notes.push(noteInfo);
        } else {
            isUpdate = false;
            notes[updateId] = noteInfo;
        }
        localStorage.setItem("notes", JSON.stringify(notes));
        showNotes();
        closeIcon.click();
        updateTotalNotes();
    }
});

searchInput.addEventListener("input", searchNotes);