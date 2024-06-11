// Define API endpoint
const apiUrl = 'https://notes-api.dicoding.dev/v2/notes';
const loadingIndicator = document.querySelector('loading-indicator');

// Function to fetch all notes
const fetchNotes = async () => {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch notes');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching notes:', error.message);
    throw error;
  }
};

// Function to create a new note
const createNote = async (title, body) => {
  const createdAt = new Date().toISOString();
  const noteData = {
    title: title,
    body: body,
  };

  try {
    loadingIndicator.show();

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(noteData),
    };

    const response = await fetch(apiUrl, options);
    const responseData = await response.json();

    loadingIndicator.hide();

    if (!response.ok) {
      throw new Error(responseData.message || 'Failed to create note');
    }

    return responseData;
  } catch (error) {
    console.error('Error creating note:', error.message);
    throw error;
  }
};

// Function to delete a note by ID
const deleteNoteById = async (noteId) => {
  const deleteUrl = `${apiUrl}/${noteId}`;

  try {
    loadingIndicator.show();

    const options = {
      method: 'DELETE',
    };

    const response = await fetch(deleteUrl, options);

    loadingIndicator.hide();

    if (!response.ok) {
      throw new Error('Failed to delete note');
    }
  } catch (error) {
    console.error('Error deleting note:', error.message);
    throw error;
  }
};

// Function to display notes on the UI
const displayNotes = async (notesResponse) => {
  const notes = notesResponse.data;
  const noteLists = document.getElementById('noteLists');
  noteLists.innerHTML = '';

  if (!Array.isArray(notes)) {
    console.error('Invalid notes format:', notes);
    return;
  }

  notes.forEach((note) => {
    const noteCard = createNoteCard(note);
    noteLists.appendChild(noteCard);
  });
};

// Function to create a note card element
const createNoteCard = (note) => {
  const noteCard = document.createElement('div');
  noteCard.classList.add('card');

  const title = document.createElement('h3');
  title.innerText = note.title;

  const content = document.createElement('p');
  content.innerText = note.body;

  const createdAt = document.createElement('p');
  const createdAtDate = new Date(note.createdAt);
  createdAt.innerText = `Created At: ${createdAtDate.toLocaleString()}`;

  const deleteButton = document.createElement('button');
  deleteButton.innerText = 'Delete';
  deleteButton.addEventListener('click', async () => {
    try {
      await deleteNoteById(note.id);
      console.log('Note deleted successfully');
      const updatedNotes = await fetchNotes();
      await displayNotes(updatedNotes);
    } catch (error) {
      console.error('Failed to delete note:', error.message);
    }
  });

  noteCard.appendChild(title);
  noteCard.appendChild(content);
  noteCard.appendChild(createdAt);
  noteCard.appendChild(deleteButton);

  return noteCard;
};

// Event listener for adding a new note
document.querySelector('input-form').addEventListener('submit', async (event) => {
  event.preventDefault();

  const inputForm = document.querySelector('input-form');

  // Mengambil shadow root dari input-form
  const shadowRoot = inputForm.shadowRoot;

  const noteTitle = shadowRoot.querySelector('#noteTitle').value;
  const noteContent = shadowRoot.querySelector('#noteContent').value;
  const datetime = shadowRoot.querySelector('#datetime').value;

  try {
    const createdNote = await createNote(noteTitle, noteContent, datetime);
    console.log('Note created successfully:', createdNote);
    const updatedNotes = await fetchNotes();
    await displayNotes(updatedNotes);
  } catch (error) {
    console.error('Failed to create note:', error.message);
  }
});

// Fetch and display notes when the page loads
window.addEventListener('DOMContentLoaded', async () => {
  try {
    const notesResponse = await fetchNotes();
    console.log('Notes:', notesResponse);
    await displayNotes(notesResponse);
  } catch (error) {
    console.error('Failed to fetch notes:', error.message);
  }
});
