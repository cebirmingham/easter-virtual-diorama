const characters = document.querySelectorAll('[data-character-id]');

async function askQuestion({currentTarget}) {
  const characterId = currentTarget.dataset.characterId;

  const fetchResponse = await fetch(`/question?id=${characterId}`);
  const response = await fetchResponse.json();
  if (response.tired) {
    console.log('man i am super tired');
  }
  else if (response.finished) {
    console.log('looks like i\'m the only one still standing - maybe we should stop! i am here in a professional capacity after all.');
  }
  else if (response.question) {
    console.log(response.question);
  }



}


[ ...characters].forEach(el => el.addEventListener('click', askQuestion));