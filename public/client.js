const characters = document.querySelectorAll('[data-character-id]');

async function askQuestion({currentTarget}) {
  const character =  {
    id: currentTarget.dataset.characterId,
    name: currentTarget.dataset.characterName,
    description: currentTarget.dataset.characterDescription,
  }
  const fetchResponse = await fetch(`/question?id=${character.id}`);
  const response = await fetchResponse.json();

  let modal;
  if (response.tired) {
    modal = new Modal({
      type: 'tired',
      message: 'man i am super tired',
      character
    });
    currentTarget.disabled = true;
  }
  else if (response.finished) {
    modal = new Modal({
      type: 'finished',
      message: 'looks like i\'m the only one still standing - maybe we should stop! i am here in a professional capacity after all.'
    });
    currentTarget.disabled = true;
  }
  else if (response.question && response.theme === 'task') {
    modal = new Modal({
      type: 'task',
      message: response.question,
      character
    });
  }
  else if (response.question) {
    modal = new QuestionModal({
      type: 'question',
      message: response.question,
      answer: response.answer,
      character
    });
  }
  modal.open();
}


[ ...characters].forEach(el => el.addEventListener('click', askQuestion));


// Modal class
class Modal {

  constructor(options = {}) {
    this.type = options.type;
    this.message = options.message;
    this.character = options.character
    this.constructHTML();
  }

  constructHTML() {

    // Construct a dialog element and add classes
    this.dialog = document.createElement('dialog');
    this.dialog.classList.add('modal');
    this.dialog.classList.add(`modal--${this.type}`);
    this.dialog.addEventListener('close', () => this.destroy());

    // Create the main dialog message
    this.dialog.innerHTML = `
      <section class="modal__section">
      ${this.character ? this.constructCharacter() : ''}
        <p class="modal__message">${this.message}</p>
      </section>
    `;

    // Create the dialog menu
    this.menu = document.createElement('menu');
    this.menu.classList.add('modal__menu');
    this.dialog.appendChild(this.menu);
    document.body.appendChild(this.dialog);
    this.constructButtons();
  }

  constructCharacter() {
    return `
      <div class="modal__character">
        <div class="modal__character-image">
          <img src="/cast/${this.character.id}.png" alt="${this.character.name}"/>
        </div>
        <div class="modal__character-details">
          <p class="modal__character-name">${this.character.name}</p>
          <p class="modal__character-description">${this.character.description}</p>
        </div>
      </div>
    `;
  }

  constructButtons() {
    const okButton = document.createElement('button');
    okButton.classList.add('modal__button');
    okButton.classList.add('modal__button--ok');
    okButton.textContent = 'ok';
    okButton.addEventListener('click', () => {
      this.close();
    });
    this.menu.appendChild(okButton);
  }

  open() {
    this.dialog.showModal();
  }

  close() {
    this.dialog.close();
  }

  destroy() {
    this.dialog.remove();
  }

}

class QuestionModal extends Modal {

  constructor(options = {}) {
    super(options);
    this.answer = options.answer;
  }

  constructButtons() {
    const incorrectButton = document.createElement('button');
    incorrectButton.classList.add('modal__button');
    incorrectButton.classList.add('modal__button--incorrect');
    incorrectButton.textContent = 'incorrect';
    incorrectButton.addEventListener('click', () => {
      this.close();
      const modal = new Modal({
        type: 'incorrect',
        message: 'the answer is: ' + this.answer,
        character: this.character
      });
      modal.open();
    });
    this.menu.appendChild(incorrectButton);
    const correctButton = document.createElement('button');
    correctButton.classList.add('modal__button');
    correctButton.classList.add('modal__button--correct');
    correctButton.textContent = 'correct';
    correctButton.addEventListener('click', () => {
      this.close();
      const modal = new Modal({
        type: 'correct',
        message: 'well done! it is ' + this.answer,
        character: this.character
      });
      modal.open();
    });
    this.menu.appendChild(correctButton);
  }

}
