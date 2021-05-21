const { run } = require('../src/scenario/axios/rssChannel')

describe('Test rss-scrapper', () => {
  const config = require("../config/rss-test-config.json");

  test('Check title', done => {
    run(config[0])
    .then( res => {
      expect(res.title).toBe('Информационное агентство УНИАН');
      done();
    });
  });

  test('Check description', done => {
    run(config[0])
    .then( res => {
      expect(res.description).toBe('Информационное агентство УНИАН :: Новости, Политика, Бизнес, Фотосервис, Регионы');
      done();
    });
  });

  test('Check current news', done => {
    run(config[0])
    .then( res => {
      expect(res.diff.messages[0].text).toBe('Владельцы поврежденных автомобилей будут судиться с коммунальщиками.');
      done();
    });
  });
})