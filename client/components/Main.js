import React from 'react';
import axios from 'axios';
import cheerio from 'cheerio';

export const mapTitlesToObject = data => {
  const $ = cheerio.load(data);
  const $titles = $('h3[class=r] a');
  return $titles.map((i, el) => {
    return ({
      href: el.attribs.href,
      text: el.children[0].data
    });
  });
};

/*///
 COMPONENT
*////
class Main extends React.Component {

  constructor() {
    super();
    this.state = {
      query: '',
      searchTitles: [],
      showAjaxSpinner: false
    };

    this.fetchGoogleSearchTitles = this.fetchGoogleSearchTitles.bind(this);
    this.updateCurrentTabUrl = this.updateCurrentTabUrl.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  fetchGoogleSearchTitles(query) {
    if (typeof query === 'string') {
      return axios.get('https://www.google.com/search?q=' + query)
      .then(res => {
        const titles = mapTitlesToObject(res.data);
        this.setState({
          searchTitles: [...titles],
          showAjaxSpinner: false
        });
      })
      .catch(err => console.error(`Fetching search data for ${query} was unsuccessful.`, err));
    }
  }

  updateCurrentTabUrl(url) {
    chrome.tabs.create({url, active: false});
  }

  handleChange(event) {
    this.setState({
      query: event.target.value
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.fetchGoogleSearchTitles(this.state.query);
    this.setState({
      query: '',
      showAjaxSpinner: true
    });
  }

  render() {
    const { query, searchTitles, showAjaxSpinner } = this.state;

    return (
      <div>
        <div className="container quick-look-title">
          <h3>'Quick Look' Search</h3>
        </div>
        {
          showAjaxSpinner ?
          <div className="container text-center">
            <div className="div-spinner">
              <img src="https://raw.githubusercontent.com/jrleja0/ajax-spinners-etc/master/ajax-loader.gif" />
            </div>
          </div>
          : <span />
        }
        {
          searchTitles && searchTitles.length && !showAjaxSpinner ?
            searchTitles.map(title => (
              <div key={title.text} className="div-search-titles">
                <h5>
                  <a href={title.href}
                    onClick={event => {
                      event.preventDefault();
                      this.updateCurrentTabUrl(title.href);
                    }}
                    target="_blank"
                    rel="noopener noreferrer"
                  >{title.text}</a>
                </h5>
              </div>
            ))
            : <span />
        }
        {
          !showAjaxSpinner ?
            <div className="container search-box">
              <form onSubmit={this.handleSubmit}>
                <div className="form-group">
                  <label htmlFor="google-search-titles">{
                    searchTitles && searchTitles.length ? 'New Search:' : 'Search Now:'
                  }</label>
                  <div className="row">
                    <div className="col-xs-10">
                      <input onChange={this.handleChange} value={query} type="search" className="form-control input-style" id="google-search-titles" aria-describedby="searchDescription" placeholder="Search Terms" />
                    </div>
                    <div className="col-xs-2">
                      <button type="submit" className="btn btn-primary">Search</button>
                    </div>
                  </div>
                  <small id="searchDescription" className="form-text text-muted">Search Google for top titles related to your search.</small>
                </div>
              </form>
            </div>
          : <span />
        }
      </div>
    );
  }
}

export default Main;
