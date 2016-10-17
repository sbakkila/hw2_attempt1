// Component here uses ES6 destructuring syntax in import, what is means is "retrieve the property 'Component' off of the object exported from the 'react'"
import React, { Component } from 'react';
import ajax from './utils/ajax';

// other components
import Navbar from './Navbar';
import Blog from './Blog';

// this will bring this CSS file into build
import './App.css';

class App extends Component {
  state = {}

  componentDidMount() {
    // retrieve app initialization data once root component has mounted
    Promise.all([
      ajax.get('/auth/session'),
      ajax.get('/api/post')
    ])
    .then(([user, posts]) => {
      this.setState({
        user: user || null,
        posts: posts.sort((a,b) => Date.parse(b.createdDate) - Date.parse(a.createdDate))
      });
    }).catch(err => console.log(err));
  }

  addPost = postState => {
    const postBody = {
      title: postState.title,
      body: postState.body
    };

    // Adding authed properties if user is logged in
    if(this.state.user) postBody.email = this.state.user.email;
    if(this.state.user && this.state.user.google && this.state.user.google.photo) {
      postBody.photo = this.state.user.google.photo;
      postBody.google_link = this.state.user.google.link;
    }
    if(this.state.user && this.state.user.facebook && this.state.user.facebook.photo) {
      postBody.photo = this.state.user.facebook.photo;
      postBody.facebook_link = this.state.user.facebook.link;
    }

    ajax.post({
      route: '/api/post',
      body: postBody
    }).then(res => this.setState({
      posts: this.state.posts.unshift(res) && this.state.posts
    }));
  };

  updatePost = (postState, id) => {
    const index = postState.editIndex;
    ajax.put({
      route: `/api/post/${this.state.posts[index]._id}`,
      body: {
        title: postState.title,
        body: postState.body,
        createdDate: new Date()
      }
    }).then(res => {
      const newPosts = this.state.posts.slice();
      newPosts[index] = res;
      this.setState({
        posts: this.state.posts.slice()
      });
    });
  };

  deletePost = id =>
    ajax.del(`/api/post/${id}`)
      .then(res => this.setState({
        posts: this.state.posts.filter(val => val._id !== id)
      }));

  localAuth = (email, password) => {
    ajax.post({
      route: '/auth/login',
      body: {
        email: email || this.state.user.email, //the "or" handles if they're already authedand are adding a password to their account
        password: password
      }
    }).then(user => {
      this.setState({
        user
      });
    });
  };

  logout = () => {
    ajax.get('/auth/logout')
      .then(() =>
        this.setState({
          user: null
        }));
  };

  render() {
    return (
      <div>
        <Navbar
          user={this.state.user}
          localAuth={this.localAuth}
          logout={this.logout}
        />
        <Blog
          posts={this.state.posts}
          userEmail={this.state.user && this.state.user.email}
          addPost={this.addPost}
          updatePost={this.updatePost}
          deletePost={this.deletePost}
        />
      </div>
    );
  }
}

export default App;
