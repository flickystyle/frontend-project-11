const renderPosts = (elements, watchedState, i18nInstance) => {
  elements.postsContainer.innerHTML = '';
  const card = document.createElement('div');
  card.classList.add('card', 'border-0');
  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');
  const cardTitle = document.createElement('h2');
  cardTitle.textContent = i18nInstance.t('posts');
  cardTitle.classList.add('card-title', 'h4');
  cardBody.append(cardTitle);
  const listGroup = document.createElement('ul');
  listGroup.classList.add('list-group', 'border-0', 'rounded-0');
  card.append(cardBody, listGroup);

  watchedState.posts.forEach((post) => {
    const listGroupItem = document.createElement('li');
    listGroupItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');

    const a = document.createElement('a');
    a.setAttribute('href', post.link);
    a.classList.add((watchedState.uiState.visitedPostsId.has(post.id)) ? 'fw-normal' : 'fw-bold');
    a.dataset.id = post.id;
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');
    a.textContent = post.title;

    const button = document.createElement('button');
    button.textContent = i18nInstance.t('watchButton');
    button.setAttribute('type', 'button');
    button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    button.dataset.id = post.id;
    button.dataset.bsToggle = 'modal';
    button.dataset.bsTarget = '#modal';

    listGroupItem.append(a, button);
    listGroup.prepend(listGroupItem);
  });

  elements.postsContainer.append(card);
};

const renderFeeds = (elements, watchedState, i18nInstance) => {
  elements.feedsContainer.innerHTML = '';
  const card = document.createElement('div');
  card.classList.add('card', 'border-0');
  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');
  const cardTitle = document.createElement('h2');
  cardTitle.textContent = i18nInstance.t('feeds');
  cardTitle.classList.add('card-title', 'h4');
  cardBody.append(cardTitle);
  const listGroup = document.createElement('ul');
  listGroup.classList.add('list-group', 'border-0', 'rounded-0');
  card.append(cardBody, listGroup);

  watchedState.feeds.forEach((feed) => {
    const h3 = document.createElement('h3');
    h3.classList.add('h6', 'm-0');
    h3.textContent = `${feed.title}`;
    const p = document.createElement('p');
    p.classList.add('m-0', 'small', 'text-black-50');
    p.textContent = `${feed.description}`;
    listGroup.append(h3, p);
  });
  elements.feedsContainer.append(card);
};

const renderModal = (elements, watchedState, i18nInstance) => {
  const { modal } = elements;
  const modalTitle = modal.querySelector('.modal-title');
  const modalBody = modal.querySelector('.modal-body');
  const linkButton = modal.querySelector('.modal-footer a');
  linkButton.textContent = i18nInstance.t('modal.linkButton');
  const closeButton = modal.querySelector('.modal-footer button');
  closeButton.textContent = i18nInstance.t('modal.closeButton');
  const currentTitle = watchedState.uiState.openedModal.title;
  modalTitle.textContent = currentTitle;
  const currentDescription = watchedState.uiState.openedModal.description;
  modalBody.textContent = currentDescription;
  const currentLink = watchedState.uiState.openedModal.link;
  linkButton.setAttribute('href', currentLink);
};

const handleAddFeedProcess = (elements, watchedState, i18nInstance) => {
  switch (watchedState.addFeedProcess) {
    case 'finished':
      elements.feedback.innerHTML = '';
      elements.addButton.disabled = false;
      elements.urlInput.readOnly = false;
      elements.urlInput.classList.remove('is-invalid');
      elements.feedback.classList.remove('text-danger');
      elements.feedback.classList.add('text-success');
      elements.feedback.textContent = i18nInstance.t('success');
      elements.form.reset();
      elements.urlInput.focus();
      break;
    case 'sending':
      elements.addButton.disabled = true;
      elements.urlInput.readOnly = true;
      break;
    case 'fetching':
      elements.addButton.disabled = true;
      elements.urlInput.readOnly = true;
      break;
    case 'failed':
      elements.addButton.disabled = false;
      elements.urlInput.readOnly = false;
      break;
    default:
      break;
  }
};
export default (elements, watchedState, i18nInstance, path) => {
  switch (path) {
    case ('addFeedProcess'):
      handleAddFeedProcess(elements, watchedState, i18nInstance);
      break;
    case ('uiState.form.error'):
      elements.feedback.classList.remove('text-success');
      elements.feedback.classList.add('text-danger');
      elements.feedback.textContent = i18nInstance.t(`errors.${watchedState.uiState.form.error}`);
      elements.urlInput.classList.add('is-invalid');
      break;
    case ('posts'):
      renderPosts(elements, watchedState, i18nInstance);
      break;
    case ('feeds'):
      renderFeeds(elements, watchedState, i18nInstance);
      break;
    case ('uiState.openedModal'):
      renderModal(elements, watchedState, i18nInstance);
      break;
    case ('uiState.visitedPostsId'):
      renderPosts(elements, watchedState, i18nInstance);
      break;
    default:
      break;
  }
};
