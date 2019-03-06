'use-strict';

const main = () => {
  const formElement = document.querySelector('form#search-tortilla');
  formElement.addEventListener('submit', handleFormSubmit);

  function handleFormSubmit (event) {
    event.preventDefault();
    const inputElement = event.target.querySelector('input');
    const inputValue = inputElement.value;

    searchTortillas(inputValue);
  }

  const searchTortillas = async (tortillaOwner) => {
    try {
      const tortillasRequest = await fetch(`/api/tortillas?username=${tortillaOwner}`);
      const tortillas = await tortillasRequest.json();
      console.log(tortillas);
    } catch (error) {
      console.error(error);
    }
  };
};

window.addEventListener('load', main);
