import React, { Component } from 'react';
import '../../style/components/auth/login.css';
import { REGISTER_TEACHER } from "../../service/api";

class RegisterTeacher extends Component {
    constructor(props) {
        super(props);


        this.password = React.createRef();
        this.confirmPassword = React.createRef();


        this.state = {
            FirstName: '',
            LastName: '',
            Email: '',
            EmailConfirmed: true,
            UserName: '',
            PhoneNumber: '',
            PhoneNumberConfirmed: true,
            Jmbg: '',
            Gender: "FEMALE",
            IsStillWorking: true,

            errorMessage: '',
            error: null,
            disable: true,
        }
    }


    componentDidMount() {
        if (localStorage.getItem('token') === null) {
            this.props.history.push('/login');
        }
        else if (localStorage.getItem('role') !== 'admin') {
            this.props.history.push('/no-auth');
        }
        else {
            this.setState({
                errorMessage: '',
                error: null,
                disable: true,
            })
        }
    }

    handleInputChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }


    handleFirstNameChange = (event) => {
        const target = event.target;
        const name = target.name;

        if (target.value === '') {
            this.setState({
                disable: true,
                errorMessage: '',

            })
        }
        else if ((target.value.length < 2 || target.value.length > 50) || !target.value.match("^[a-zA-Z]*$")) {
            this.setState({
                errorMessage: "First name must be between 2 and 50 characters long containing only letters.",
                disable: true,
            })
        }
        else {
            this.setState({
                errorMessage: "",
                disable: false,
                [name]: target.value

            })
        }
    }

    handleLastNameChange = (event) => {
        const target = event.target;
        const name = target.name;

        if (target.value === '') {
            this.setState({
                disable: true,
                errorMessage: '',

            })
        }
        else if ((target.value.length < 2 || target.value.length > 50) || !target.value.match("^[a-zA-Z]*$")) {
            this.setState({
                errorMessage: "Last name must be between 2 and 50 characters long containing only letters.",
                disable: true,
            })
        }
        else {
            this.setState({
                errorMessage: "",
                disable: false,
                [name]: target.value

            })
        }
    }

    handleUserNameChange = (event) => {
        const target = event.target;
        const name = target.name;

        if (target.value === '') {
            this.setState({
                disable: true,
                errorMessage: '',
            })
        }
        else if ((target.value.length < 4 || target.value.length > 50)) {
            this.setState({
                errorMessage: "Username must be between 4 and 50 characters long.",
                disable: true,

            })
        }
        else {
            this.setState({
                errorMessage: "",
                disable: false,
                [name]: target.value

            })
        }
    }

    handleEmailChange = (event) => {
        const target = event.target;
        const name = target.name;

        if (target.value === '') {
            this.setState({
                disable: true,
                errorMessage: '',
            })
        }
        else if (!target.value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
            this.setState({
                errorMessage: "A valid e-mail address is required.",
                disable: true,
            })
        }
        else {
            this.setState({
                errorMessage: "",
                disable: false,
                [name]: target.value
            })
        }
    }


    handleJmbgChange = (event) => {
        const target = event.target;
        const name = target.name;

        if (target.value === '') {
            this.setState({
                disable: true,
                errorMessage: '',
            })
        }
        else if ((target.value !== '' && target.value.length !== 13) || !target.value.match(/^[\+\-]?\d*\.?\d+(?:[Ee][\+\-]?\d+)?$/)) {
            this.setState({
                disable: true,
                errorMessage: `JMBG must be exactly 13 characters long and containing only digits.`,
            })
        }
        else {
            this.setState({
                errorMessage: "",
                disable: false,
                [name]: target.value
            })
        }
    }



    handlePhoneChange = (event) => {
        const target = event.target;
        const name = target.name;

        if (target.value === '') {
            this.setState({
                disable: true,
                errorMessage: '',

            })
        }
        else if (!target.value.match(/^[\+\-]?\d*\.?\d+(?:[Ee][\+\-]?\d+)?$/)) {
            this.setState({
                disable: true,
                errorMessage: `Phone number must contain only digits.`,
            })
        }
        else {
            this.setState({
                errorMessage: "",
                disable: false,
                [name]: target.value

            })
        }
    }

    handleSubmit = (event) => {

        event.preventDefault();

        if (this.confirmPassword.current.value !== this.password.current.value) {
            alert('Passwords do not match!')
        }
        else if (!this.password.current.value.match(/^((?=.*\d)(?=.*[a-z]).{5,15})$/)) {
            alert('Password must be between 5 and 15 character in length containg at least one digit and one lowercase character!')
        }


        else {
            const r = window.confirm(`
    Are you sure you want to register this person?`);
            if (r === true) {


                const requestOptions = {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token'),
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        FirstName: this.state.FirstName,
                        LastName: this.state.LastName,
                        Email: this.state.Email,
                        EmailConfirmed: this.state.EmailConfirmed,
                        UserName: this.state.UserName,
                        PhoneNumber: this.state.PhoneNumber,
                        PhoneNumberConfirmed: this.state.PhoneNumberConfirmed,
                        Jmbg: this.state.Jmbg,
                        Gender: this.state.Gender,
                        IsStillWorking: this.state.IsStillWorking,


                        Password: this.password.current.value,
                        ConfirmPassword: this.confirmPassword.current.value,

                    })

                };

                fetch(REGISTER_TEACHER, requestOptions)
                    .then(response => {
                        if (response.ok) {
                            const r = window.confirm(`
                    Do you wish to register another user?`);
                            if (r === true) {
                                this.setState({ errorMessage: '', disable: true })

                                window.location.reload();
                            }
                            else {
                                this.setState({ errorMessage: '' })
                                this.props.history.push("/teachers");
                            }


                        } else {
                            response.text().then(message => this.setState({ errorMessage: message }))
                        }
                    })
                    .catch(error => console.log(error))
            }
        }

    };
    render() {

        return (
            <div className="register_teacher_form">

                <form onSubmit={this.handleSubmit}>
                    <h3 className="register_teacher_h3">Enter teacher information</h3>

                    <div>
                        <input
                            className="reg_teach_input"
                            type="text"
                            name="FirstName"
                            placeholder="Enter first name"
                            onChange={this.handleFirstNameChange}
                            required />

                        <input
                            className="reg_teach_input"
                            type="text"
                            name="LastName"
                            placeholder="Enter last name"
                            onChange={this.handleLastNameChange}
                            required />

                        <input
                            className="reg_teach_input"
                            type="text"
                            name="UserName"
                            placeholder="Enter username"
                            onChange={this.handleUserNameChange}
                            required />

                        <input
                            className="reg_teach_input"
                            type="email"
                            name="Email"
                            placeholder="Enter email"
                            onChange={this.handleEmailChange}
                            required />
                    </div>
                    <div>

                        <input
                            className="reg_teach_input"
                            type="text"
                            name="Jmbg"
                            placeholder="Enter JMBG"
                            onChange={this.handleJmbgChange}
                            required />

                        <input
                            className="reg_teach_input"
                            type="text"
                            name="PhoneNumber"
                            placeholder="Enter Phone Number"
                            onChange={this.handlePhoneChange}
                            required />

                        <input
                            className="reg_teach_input"
                            type="password"
                            name="Password"
                            placeholder="Enter password"
                            ref={this.password}
                            required />

                        <input
                            className="reg_teach_input"
                            type="password"
                            name="ConfirmPassword"
                            placeholder="Enter password again"
                            ref={this.confirmPassword}
                            required />



                    </div>
                    <div className="gender_div">
                        <div className="gender_radio">
                            <input
                                type="radio"
                                name="Gender"
                                value="FEMALE"
                                checked={this.state.Gender === 'FEMALE'}
                                onChange={this.handleInputChange} />
                            <label>female</label>
                        </div>
                        <div className="gender_radio">
                            <input
                                type="radio"
                                name="Gender"
                                value="MALE"
                                checked={this.state.Gender === 'MALE'}
                                onChange={this.handleInputChange} />
                            <label>male</label>
                        </div>
                    </div>

                    <input type="submit" value="Submit" className="submitTeacherRegister" />
                    <input type="button" value="Cancel" className="cancelTeacherRegister" onClick={() => this.props.history.push("/teachers")} />

                    <label className="error">{this.state.errorMessage}</label>
                </form>
            </div>

        )
    }
};

export default RegisterTeacher;