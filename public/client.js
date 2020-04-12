const characters = document.querySelectorAll('[data-character-id]');

async function askQuestion({currentTarget}) {
  const characterId = currentTarget.dataset.characterId;

  const fetchResponse = await fetch(`/question?id=${characterId}`);
  const response = await fetchResponse.json();

  let modal;
  if (response.tired) {
    modal = new Modal({
      type: 'tired',
      message: 'man i am super tired'
    });
  }
  else if (response.finished) {
    modal = new Modal({
      type: 'finished',
      message: 'looks like i\'m the only one still standing - maybe we should stop! i am here in a professional capacity after all.'
    });
  }
  else if (response.question && response.theme === 'task') {
    modal = new Modal({
      type: 'task',
      message: response.question
    });
  }
  else if (response.question) {
    modal = new QuestionModal({
      type: 'question',
      message: response.question,
      answer: response.answer
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
        <p>${this.message}</p>
      </section>
    `;

    // Create the dialog menu
    this.menu = document.createElement('menu');
    this.menu.classList.add('modal__menu');
    this.dialog.appendChild(this.menu);
    document.body.appendChild(this.dialog);
    this.constructButtons();
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
        message: 'the answer is: ' + this.answer
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
        message: 'well done! it is ' + this.answer
      });
      modal.open();
    });
    this.menu.appendChild(correctButton);
  }

}
