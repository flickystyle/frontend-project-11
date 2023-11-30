import onChange from 'on-change';
import i18next from 'i18next';
import { setLocale } from 'yup';
import render from './render.js';
import ru from './locales/ru.js';
import getData from './getData.js';

export default () => {
  const initialState = {
    feeds: [],
    posts: [],
    addFeedProcess: '',
    uiState: {
      visitedPostsId: new Set(),
      openedModal: null,
      form: {
        url: '',
        error: '',
      },
    },
  };

  const i18nInstance = i18next.createInstance();

  i18nInstance.init({
    lng: 'ru',
    debug: false,
    resources: { ru },
  }).then(() => {
    setLocale({
      mixed: {
        notOneOf: 'dublicateUrl',
      },
      string: {
        url: 'invalidUrl',
      },
    });
  });

  const elements = {
    form: document.querySelector('form'),
    urlInput: document.querySelector('#url-input'),
    feedback: document.querySelector('.feedback'),
    postsContainer: document.querySelector('.posts'),
    feedsContainer: document.querySelector('.feeds'),
    modal: document.querySelector('.modal-content'),
    addButton: document.querySelector('form button'),
  };

  const watchedState = onChange(initialState, (path) => {
    render(elements, watchedState, i18nInstance, path);
    console.log(watchedState);
  });

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    watchedState.addFeedProcess = 'sending';
    const formData = new FormData(e.target);
    watchedState.uiState.form.url = formData.get('url').trim();
    const url = formData.get('url').trim();
    getData(url, watchedState, i18nInstance);
  });

  elements.postsContainer.addEventListener('click', (e) => {
    e.stopImmediatePropagation();
    const { target } = e;
    const { id } = target.dataset;
    const data = watchedState.posts.find((post) => post.id === id);
    if (data !== undefined) {
      watchedState.uiState.openedModal = data;
      watchedState.uiState.visitedPostsId.add(id);
    }
  });
};
