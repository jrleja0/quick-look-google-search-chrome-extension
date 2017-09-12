import React from 'react';
import chai, {expect} from 'chai';
import {shallow} from 'enzyme';
import {Main} from '../client/components';
import {mapTitlesToObject} from '../client/components/Main';
import {testHTML} from './example.HTML';

const testSearchTitles = [
  {href: 'https://en.wikipedia.org/wiki/Cats_(musical)', text: 'Cats (musical) - Wikipedia'},
  {href: 'https://en.wikipedia.org/wiki/Cat', text: 'Cat - Wikipedia'},
  {href: 'http://www.animalplanet.com/pets/cats/', text: 'Cats | Animal Planet'}
];

describe('fetching search results', () => {
  it('when a search query is submitted, handleSubmit shows the ajax spinner', () => {
    const mainComponent = shallow(<Main />);
    expect(mainComponent.find('.div-spinner')).to.have.length(0);
    mainComponent.find('form').simulate('submit', { preventDefault: () => {}});
    expect(mainComponent.find('.div-search-titles')).to.have.length(0);
    expect(mainComponent.find('.div-spinner')).to.have.length(1);
  });

  it('mapTitlesToObject function parses raw HTML and creates a Cheerio object. Each title is an object with an href and text', () => {
    const foundSearchTitles = mapTitlesToObject(testHTML);
    expect(foundSearchTitles).to.be.an('object');
    expect(foundSearchTitles[1]).to.be.an('object');
    expect(foundSearchTitles[2].href).to.equal('http://www.animalplanet.com/pets/cats/');
    expect([...foundSearchTitles]).to.deep.equal(testSearchTitles);
  });

});

describe('rendering search results', () => {
  let mainComponent;

  it('initially has no search titles to display', () => {
    mainComponent = shallow(<Main />);
    expect(mainComponent.find('.div-search-titles')).to.have.length(0);
  });

  it('displays the search titles it receives from the parsed ajax call', () => {
    mainComponent.setState({ searchTitles: testSearchTitles });
    expect(mainComponent.find('.div-search-titles')).to.have.length(3);
    expect(mainComponent.find('.div-search-titles a').at(1).html()).to.equal('<a href="https://en.wikipedia.org/wiki/Cat" target="_blank" rel="noopener noreferrer">Cat - Wikipedia</a>');
  });

});
