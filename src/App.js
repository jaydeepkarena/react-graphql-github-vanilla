import React, { Component } from 'react';
import axios from 'axios';
import Organization from './Organization';

const TITLE = 'React GraphQL GitHub Client';

const axiosGithubGraphQL = axios.create({
  baseURL: 'https://api.github.com/graphql',
  headers: {
    Authorization: `bearer ${process.env.REACT_APP_GITHUB_PERSONAL_ACCESS_TOKEN}`
  }
});

const GET_ORGANIZATION = `
  {
    organization(login: "the-road-to-learn-react") {
      name,
      url
    }
  }
`;

const GET_REPOSITORY_OF_ORGANIZATION = `
{
  organization(login: "the-road-to-learn-react") {
    name
    url
    repository(name: "the-road-to-learn-react") {
      name
      url
    }
  }
}
`;

const GET_ISSUES_OF_REPOSITORY = `
{
  organization(login: "the-road-to-learn-react") {
    name
    url
    repository(name: "the-road-to-learn-react") {
      name
      url
      issues(last: 5) {
        edges {
          node {
            id
            title
            url
          }
        }
      }
    }
  }
}
`;


class App extends Component {
  state = {
    path: 'the-road-to-learn-react/the-road-to-learn-react',
    organization: null,
    error: null
  };

  componentDidMount() {
    this.onFetchFromGithub();
  }

  onChange = event => {
    this.setState({ path: event.target.value });
  };

  onSubmit = event => {
    // fetch data
    event.preventDefault();
  };

  onFetchFromGithub = () => {
    axiosGithubGraphQL
      .post('', { query: GET_ISSUES_OF_REPOSITORY })
      .then(({ data: { data: { organization }, errors } }) =>
        this.setState({ organization: organization, error: errors }, () => console.log(this.state))
      );
  };

  render() {
    const { path, organization, errors } = this.state;

    return (
      <div>
        <h1>{TITLE}</h1>
        <form onSubmit={this.onSubmit}>
          <label htmlFor='url'>Show open issues for https://github.com/</label>
          <input
            type='text'
            id='url'
            className='url'
            onChange={this.onChange}
            style={{ width: '300px' }}
            value={path}
          />
          <button type='submit'>Search</button>
        </form>
        <hr />
        {organization ? (
          <Organization organization={organization} errors={errors} />
        ) : (
          <p>No information yet ...</p>
        )}
      </div>
    );
  }
}

export default App;
