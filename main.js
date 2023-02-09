const addBox = document.querySelector('.add-box'),
    popupBox = document.querySelector('.popup-box'),
    popupTitle = popupBox.querySelector('header p'),
    closeIcon = popupBox.querySelector('header i'),
    titleTag = popupBox.querySelector('input'),
    descriptionTag = popupBox.querySelector('textarea'),
    addBtn = popupBox.querySelector('button');

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

//getting notes from localstorage and parsing them to js object else parsing an empty object
const notes = JSON.parse(localStorage.getItem('notes') || '[]');

let isUpdate = false, updateId;


//Show note form
addBox.addEventListener('click', () => {
    titleTag.focus();
    popupBox.classList.add('show');
});

//Close note form
closeIcon.addEventListener('click', () => {
    isUpdate = false;
    titleTag.value = '';
    descriptionTag.value = '';
    addBtn.innerHTML = 'Add Note';
    popupTitle.innerHTML = 'Add a note';
    popupBox.classList.remove('show');
});

function showNotes() {
    document.querySelectorAll('.note').forEach(note=>note.remove()); 
    notes.forEach((note, index) => {
        let liTag = `
       <li class="note">
       <div class="details">
           <p>${note.title}</p>
           <span>${note.description}</span>
       </div>
       <div class="bottom-content">
           <span>${note.date}</span>
           <div class="settings">
               <i onclick="showMenu(this)" class="fas fa-regular fa-ellipsis"></i>
               <ul class="menu">
                   <li><i onclick="updateNote(${index}, '${note.title}', '${note.description}')" class="fas fa-pen"></i>Edit</li>
                   <li><i onclick="deleteNote(${index})" class="fas fa-trash"></i>Delete</li>
               </ul>
           </div>
       </div>
   </li>`;
   addBox.insertAdjacentHTML('afterend', liTag);
    });
} 
showNotes();


//Setting method
function showMenu(elem){
   elem.parentElement.classList.add("show");
   document.addEventListener('click', e => {
    //removing show class
    if(e.target.tagName != "I" || e.target != elem){
        elem.parentElement.classList.remove("show");
    }
   });
}

//Delete method
function deleteNote(noteId) {
    let confirDel = confirm('Do you want to delete this note?');
    if(!confirDel) return;
   notes.splice(noteId, 1);
   localStorage.setItem('notes', JSON.stringify(notes));
   showNotes();
}

//Edit method
function updateNote(noteId, title, description){
    isUpdate = true;
    updateId = noteId;
    addBox.click();
    titleTag.value = title;
    descriptionTag.value = description;
    addBtn.innerHTML = 'Update Note';
    popupTitle.innerHTML = 'Update a note';
    console.log(noteId, title, description)
}

//Add note
addBtn.addEventListener('click', e => {
    e.preventDefault()
    let noteTitle = titleTag.value,
        noteDescription = descriptionTag.value;

    if (noteTitle || noteDescription) {
        //date method
        let dateObj = new Date();
        let year = dateObj.getFullYear();
        let month = months[dateObj.getMonth()];
        let day = dateObj.getDate();

        Number.prototype.pad = function(digits){
            for(var n = this.toString(); n.length < digits; n = 0 +n);
            return n;
        }

        let noteInfo = {
            title: noteTitle, description: noteDescription,
            date: `${month}-${day.pad(2)}-${year}`
        }

        if(!isUpdate){
            //creating notes
            notes.push(noteInfo);
        }else{
            //updating specific note
            isUpdate = false;
            notes[updateId] = noteInfo;
        }
        
        //save to local storage
        localStorage.setItem('notes', JSON.stringify(notes));
        closeIcon.click();
        showNotes();
    }
});