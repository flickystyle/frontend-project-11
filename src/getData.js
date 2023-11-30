import axios from 'axios';
import uniqueId from 'lodash.uniqueid';
import { string } from 'yup';
import parse from './parser.js';

const validate = (url, feedUrls) => {
  const schema = string().url()
    .notOneOf(feedUrls);
  return schema.validate(url);
};

const fetchData = (url) => {
  const allOriginsLink = 'https://allorigins.hexlet.app/get';
  const urlForResponce = new URL(allOriginsLink);
  urlForResponce.searchParams.set('disableCache', 'true');
  urlForResponce.searchParams.set('url', url);
  return axios.get(urlForResponce);
};

const updatePosts = (watchedState) => {
  // https://lorem-rss.hexlet.app/feed?unit=second&interval=5
  const promises = watchedState.feeds.map(({ url, id }) => fetchData(url)
    .then((response) => {
      const [, posts] = parse(response.data.contents, url);
      const links = watchedState.posts.map((item) => item.link);
      const newPosts = posts.filter((post) => !links.includes(post.link));

      newPosts.forEach((postEl) => {
        const postLink = postEl.link;

        const postDescription = postEl.description;
        const postTitle = postEl.title;

        const newPost = {
          title: postTitle,
          link: postLink,
          description: postDescription,
          id: uniqueId(),
          feedId: id,
        };
        watchedState.posts.push(newPost);
      });
    }));

  Promise.all(promises).finally(() => setTimeout(() => updatePosts(watchedState), 5000));
};

export default (url, watchedState) => {
  const getFeedUrls = watchedState.feeds.map((feed) => feed.url);
  validate(url, getFeedUrls)
    .then(() => {
      watchedState.addFeedProcess = 'fetching';
      return fetchData(url);
    })
    .then((response) => {
      const [feed, posts] = parse(response.data.contents, url);
      feed.id = uniqueId();
      watchedState.feeds.push(feed);
      const postsWithId = posts.map((post) => {
        post.id = uniqueId();
        post.feedId = feed.id;
        return post;
      });
      watchedState.posts = [...watchedState.posts, ...postsWithId];
      watchedState.addFeedProcess = 'finished';
      updatePosts(watchedState);
    })
    .catch((e) => {
      watchedState.addFeedProcess = 'failed';
      if (e.isAxiosError) {
        watchedState.uiState.form.error = 'network';
      } else {
        watchedState.uiState.form.error = e.message;
      }
    });
};
