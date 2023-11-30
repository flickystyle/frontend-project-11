export default (contents, url) => {
  const domParser = new DOMParser();
  const xmlDocument = domParser.parseFromString(contents, 'application/xml');
  const parseErrorSelectorExist = xmlDocument.querySelector('parsererror');

  if (parseErrorSelectorExist) {
    throw new Error('parserError');
  }

  const channel = xmlDocument.querySelector('channel');
  const title = channel.querySelector('title');
  const description = channel.querySelector('description');
  const feed = ({
    title: title.textContent,
    description: description.textContent,
    url,
  });

  const items = xmlDocument.querySelectorAll('item');
  const posts = [...items].map((item) => {
    const postTitle = item.querySelector('title');
    const postLink = item.querySelector('link');
    const postDescription = item.querySelector('description');
    const post = {
      title: postTitle.textContent,
      link: postLink.textContent,
      description: postDescription.textContent,
    };
    return post;
  });

  return [feed, posts];
};
