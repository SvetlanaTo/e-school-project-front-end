import React, { Component } from 'react';
import '../../style/components/auth/mylogin.css';
import { LOGIN } from "../../service/api";

class Login extends Component {

    constructor(props) {
        super(props);
        this.password = React.createRef();
        this.state = {
            username: '',
            errorMessage: '',
            remember: true,
            attempt: 3,
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleUsernameChange = this.handleUsernameChange.bind(this);

    }

    handleUsernameChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;


        if (target.value.length > 60) {
            this.setState({ errorMessage: 'The username must be between 4 and 50 characters long.' })
        }
        else {
            this.setState({
                errorMessage: "",
                [name]: target.value,
            })
        }

        this.setState({
            [name]: value
        });

        console.log(value, name);
    }

    handleSubmit = (event) => {
        event.preventDefault();
        const formData = new URLSearchParams();
        formData.append('grant_type', 'password');
        formData.append('username', this.state.username);
        //   formData.append('password', this.state.password);
        formData.append('password', this.password.current.value);

        console.log(formData);

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body:
                formData
        };

        fetch(LOGIN, requestOptions)
            .then(response => {
                if (response.ok) {
                    response.json().then(data => {
                        this.setState({ errorMessage: '' })
                        localStorage.setItem("token", data.access_token);
                        localStorage.setItem("role", data.role);
                        localStorage.setItem("UserId", data.UserId);
                        localStorage.setItem("name", data.name + ' ' + data.surname);
                        this.props.history.push("/");

                    });
                } else {
                    response.text().then(message => this.setState({ errorMessage: message }));
                }
            })
            .catch(error => console.log(error));
    };

    render() {
        return (
            <div className='login_body'>
                <div className="login_box">

                    <h2 className='h2_login_box'>Log In Here</h2>
                    <form onSubmit={this.handleSubmit}>

                        <p className='p_login_box'>Username:</p>
                        <input
                            className="login_input_text"
                            type="text"
                            name="username"
                            placeholder="Enter username"
                            onChange={this.handleUsernameChange}
                            required />

                        <p className='p_login_box'>Password:</p>
                        <input
                            className="login_input_pass"
                            type="password"
                            name="password"
                            placeholder="Enter password"
                            ref={this.password}
                            required />

                        {/* <label>
                        <input
                            className="login_input_remember"
                            type="checkbox"
                            name="remember" />
                            Remember me</label> */}

                        <input type="submit" value="Sign In" className="my_login_submit" />
                        <label className="error">{this.state.errorMessage}</label>
                        {/* <label className="info">If you do not have account, please <Link to="/register-admin">register</Link></label> */}
                    </form>
                </div>
            </div>
        )
    }
};

export default Login;