/**
 * register.jsx: registration form.
 *
 * @RegisterForm, must be capitalized in order for reactjs to render it as a
 *     component. Otherwise, the variable is rendered as a dom node.
 *
 * Note: this script implements jsx (reactjs) syntax.
 */

import React from 'react';
import Spinner from '../general/spinner.jsx';
import { browserHistory } from 'react-router';
import setLoginState from '../redux/action/login.jsx';
import ajaxCaller from '../general/ajax-caller.js';
import checkValidString from '../validator/valid-string.js';
import checkValidEmail from '../validator/valid-email.js';
import checkValidPassword from '../validator/valid-password.js';

var RegisterForm = React.createClass({
  // initial 'state properties'
    getInitialState: function() {
        return {
            ajax_done_result: null,
            display_spinner: false,
            submitted_registration: false,
            validated_username: true,
            validated_email: true,
            validated_password: true,
            validated_username_server: true,
            validated_email_server: true,
            validated_password_server: true,
            value_username: '',
            value_email: '',
            value_password: '',
        };
    },
  // callback: used to return spinner
    getSpinner: function() {
        if (this.state.display_spinner) {
            return Spinner;
        }
        else {
            return 'span';
        }
    },
  // send form data to serverside on form submission
    handleSubmit: function(event) {
      // prevent page reload
        event.preventDefault();

      // local variables
        var ajaxEndpoint = '/register';
        var ajaxArguments = {
            'endpoint': ajaxEndpoint,
            'data': new FormData(this.refs.registerForm)
        };

      // boolean to show ajax spinner
        this.setState({display_spinner: true});

      // asynchronous callback: ajax 'done' promise
        ajaxCaller(function (asynchObject) {
      // Append to DOM
            if (asynchObject && asynchObject.error) {
                this.setState({ajax_done_error: asynchObject.error});
            }
            else if (asynchObject) {
              // local variables
                const result = asynchObject;
                const status = (!!result && result.status >= 0) ? result.status : null;

              // backend validation: server handles one error at a time
                if (!!status || status == 0) {
                    switch(status) {
                        case 1:
                            this.setState({validated_password_server: false});
                            break;
                        case 2:
                            this.setState({validated_username_server: false});
                            break;
                        case 3:
                            this.setState({validated_email_server: false});
                            break;
                        default:
                            this.setState({validated_password_server: true});
                            this.setState({validated_username_server: true});
                            this.setState({validated_email_server: true});
                            break;
                    }
                }

              // return server response
                this.setState({ajax_done_result: result});
            }
            else {
                this.setState({ajax_done_result: null});
            }
          // boolean to hide ajax spinner
            this.setState({display_spinner: false});
        }.bind(this),
      // asynchronous callback: ajax 'fail' promise
        function (asynchStatus, asynchError) {
            if (asynchStatus) {
                this.setState({ajax_fail_status: asynchStatus});
                console.log('Error Status: ' + asynchStatus);
            }
            if (asynchError) {
                this.setState({ajax_fail_error: asynchError});
                console.log('Error Thrown: ' + asynchError);
            }
          // boolean to hide ajax spinner
            this.setState({display_spinner: false});
        }.bind(this),
      // pass ajax arguments
        ajaxArguments);
    },
    componentWillMount: function() {
      // redirect to homepage if logged-in
        if (
            this.props &&
            this.props.user &&
            !!this.props.user.name &&
            this.props.user.name != 'anonymous'
        ) {
            browserHistory.push('/');
        }
    },
    validateUsername: function(event) {
        const username = event.target.value;
        const check = checkValidString(username) ? true : false;

        this.setState({validated_username_server: true});
        this.setState({validated_username: check});
        this.setState({value_username: username});
    },
    validateEmail: function(event) {
        const email = event.target.value;
        const check = checkValidEmail(email) ? true : false;

        this.setState({validated_email_server: true});
        this.setState({validated_email: check});
        this.setState({value_email: email});
    },
    validatePassword: function(event) {
        const password = event.target.value;
        const check = checkValidPassword(password) ? true : false;

        this.setState({validated_password_server: true});
        this.setState({validated_password: check});
        this.setState({value_password: password});
    },
  // triggered when 'state properties' change
    render: function() {
      // local variables
        var AjaxSpinner = this.getSpinner();
        var usernameClass = this.state.validated_username ?  '' : 'invalid';
        var passwordClass = this.state.validated_password ? '' : 'invalid';

      // frontend validation
        if (this.state.validated_email) {
            var emailClass = '';
            var emailNote = '';
        }
        else {
            var emailClass = 'invalid';
            var emailNote = <span className={emailClass}>
                Please provide a valid email.
            </span>;
        }

      // backend validation
        if (!this.state.validated_password_server) {
            var passwordNote = <span className='server-response invalid'>
                (Password requirement not met)
            </span>;
        }
        else {
            var passwordNote = null;
        }

        if (!this.state.validated_username_server) {
            var usernameNote = <span className='server-response invalid'>
                (Username is taken)
            </span>;
        }
        else {
            var usernameNote = null;
        }

        if (!this.state.validated_email_server) {
            var emailNote = <span className='server-response invalid'>
                (Email has already registered)
            </span>;
        }
        else {
            var emailNote = null;
        }

        return(
            <form onSubmit={this.handleSubmit} ref='registerForm'>
                <div className='form-group'>
                    <label className={'form-label ' + usernameClass}>Username</label>
                    <input
                        type='text'
                        name='user[login]'
                        className='input-block'
                        placeholder='Pick a username'
                        onInput={this.validateUsername}
                        value={this.state.value_username}
                    />
                    <p className={'note ' + usernameClass}>
                        This will be your username. {usernameNote}
                    </p>
                </div>

                <div className='form-group'>
                    <label className={'form-label ' + emailClass}>Email Address</label>
                    <input
                        type='text'
                        name='user[email]'
                        className='input-block'
                        placeholder='Your email address'
                        onInput={this.validateEmail}
                        value={this.state.value_email}
                    />
                    <p className='note'>
                        You will get updates regarding account changes,
                        or activitites. This email address will not be
                        shared with anyone. {emailNote}
                    </p>
                </div>
 
                <div className='form-group'>
                    <label className={'form-label ' + passwordClass}>Password</label>
                    <input
                        type='password'
                        name='user[password]'
                        className='input-block'
                        placeholder='Create a password'
                        onInput={this.validatePassword}
                        value={this.state.value_password}
                    />
                    <p className={'note ' + passwordClass}>
                        Use at least one letter, one numeral,
                        and ten characters. {passwordNote}
                    </p>
                </div>

                <input
                    type='submit'
                    className='btn btn-primary'
                    value='Create an account'
                />
                <AjaxSpinner />
            </form>
        );
    }
});

// indicate which class can be exported, and instantiated via 'require'
export default RegisterForm
