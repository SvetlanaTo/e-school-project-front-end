import React, { Component } from 'react';
import '../../../style/components/auth/login.css';
import { TEACHERS } from "../../../service/api";

class UpdateTeacher extends Component {
    constructor(props) {
        super(props);
        this.state = {
            teacher: null,
            validRegExp: "/^[^@]+@[^@]+.[a-z]{2,}$/i"
        };
    }

    componentDidMount() {
        const currentUser = localStorage.getItem("token");
        if (currentUser) {
            const path = TEACHERS + "/" + this.props.match.params.id;
            const requestOptions = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json; charset= UTF-8',
                    'Authorization': 'Bearer ' + localStorage.getItem("token")
                }
            };
            fetch(path, requestOptions)
                .then(response => response.json())
                .then(data => {
                    this.setState({ teacher: data })
                });
        } else {
            this.props.history.push("/login");
        }


    }

    handleInputChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            teacher: { ...this.state.teacher, [name]: value }

        });
    }

    handleFirstNameChange = (event) => {
        const target = event.target;
        const name = target.name;

        if (target.value === '') {
            this.setState({
                disable: true,
                errorMessage: '',
                teacher: { ...this.state.teacher, [name]: target.value }
            })
        }

        else if ((target.value.length < 2 || target.value.length > 50) || !target.value.match("^[a-zA-Z]*$")) {
            this.setState({
                errorMessage: "First name must be between 2 and 50 characters long containing only letters.",
                disable: true,
                teacher: { ...this.state.teacher, [name]: target.value }
            })
        }
        else {
            this.setState({
                errorMessage: "",
                disable: false,
                teacher: { ...this.state.teacher, [name]: target.value }
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
                teacher: { ...this.state.teacher, [name]: target.value }
            })
        }
        else if ((target.value.length < 2 || target.value.length > 50) || !target.value.match("^[a-zA-Z]*$")) {
            this.setState({
                errorMessage: "Last name must be between 2 and 50 characters long containing only letters.",
                disable: true,
                teacher: { ...this.state.teacher, [name]: target.value }
            })
        }
        else {
            this.setState({
                errorMessage: "",
                disable: false,
                teacher: { ...this.state.teacher, [name]: target.value }
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
                teacher: { ...this.state.teacher, [name]: target.value }
            })
        }
        else if ((target.value.length < 4 || target.value.length > 50)) {
            this.setState({
                errorMessage: "Username must be between 4 and 50 characters long.",
                disable: true,
                teacher: { ...this.state.teacher, [name]: target.value }
            })
        }
        else {
            this.setState({
                errorMessage: "",
                disable: false,
                teacher: { ...this.state.teacher, [name]: target.value }
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
                teacher: { ...this.state.teacher, [name]: target.value }
            })
        }
        else if (!target.value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
            this.setState({
                errorMessage: "A valid e-mail address is required.",
                disable: true,
                teacher: { ...this.state.teacher, [name]: target.value }
            })
        }
        else {
            this.setState({
                errorMessage: "",
                disable: false,
                teacher: { ...this.state.teacher, [name]: target.value }
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
                teacher: { ...this.state.teacher, [name]: target.value }
            })
        }
        else if ((target.value !== '' && target.value.length !== 13) || !target.value.match(/^[\+\-]?\d*\.?\d+(?:[Ee][\+\-]?\d+)?$/)) {
            this.setState({
                disable: true,
                errorMessage: `JMBG must be exactly 13 characters long and containing only digits.`,
                teacher: { ...this.state.teacher, [name]: target.value }
            })
        }
        else {
            this.setState({
                errorMessage: "",
                disable: false,
                teacher: { ...this.state.teacher, [name]: target.value }
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
                teacher: { ...this.state.teacher, [name]: target.value }
            })
        }
        else if (!target.value.match(/^[\+\-]?\d*\.?\d+(?:[Ee][\+\-]?\d+)?$/)) {
            this.setState({
                disable: true,
                errorMessage: `Phone number must contain only digits.`,
                teacher: { ...this.state.teacher, [name]: target.value }
            })
        }
        else {
            this.setState({
                errorMessage: "",
                disable: false,
                teacher: { ...this.state.teacher, [name]: target.value }
            })
        }
    }

    handleSubmit = (event) => {
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem("token")
            },
            body: JSON.stringify({
                ID: this.state.teacher.ID,
                FirstName: this.state.teacher.FirstName,
                LastName: this.state.teacher.LastName,
                Email: this.state.teacher.Email,
                UserName: this.state.teacher.UserName,
                PhoneNumber: this.state.teacher.PhoneNumber,
                Jmbg: this.state.teacher.Jmbg,

                Gender: this.state.teacher.Gender,
                EmailConfirmed: this.state.teacher.EmailConfirmed,
                PhoneNumberConfirmed: this.state.teacher.PhoneNumberConfirmed,

            })
        };

        const path = TEACHERS + "/" + this.state.teacher.ID;
        fetch(path, requestOptions)
            .then(response => {
                if (response.ok) {
                    alert('Success!');
                    response.json().then(data => {
                        this.setState({ errorMessage: '' })
                        this.props.history.push("/teachers");
                    });
                } else {
                    response.text().then(message => this.setState({ errorMessage: message }))
                }
            })
            .catch(error => console.log(error))
        event.preventDefault();

    };

    render() {
        return (
            <div className="register_teacher_form">

                {
                    this.state.teacher &&
                    <form onSubmit={this.handleSubmit}>
                        <div>
                            <input
                                className="reg_teach_input"
                                type="text"
                                name="FirstName"
                                placeholder="Change first name"
                                value={this.state.teacher.FirstName}
                                onChange={this.handleFirstNameChange}
                                required />

                            <input
                                className="reg_teach_input"
                                type="text"
                                name="LastName"
                                placeholder="Change last name"
                                value={this.state.teacher.LastName}
                                onChange={this.handleLastNameChange}
                                required />

                            <input
                                className="reg_teach_input"
                                type="text"
                                name="UserName"
                                placeholder="Change username"
                                value={this.state.teacher.UserName}
                                onChange={this.handleUserNameChange}
                                required />

                            <input
                                className="reg_teach_input"
                                type="email"
                                name="Email"
                                placeholder="Change email"
                                value={this.state.teacher.Email}
                                onChange={this.handleEmailChange}
                                required />
                        </div>
                        <div>
                            <input
                                className="reg_teach_input"
                                type="text"
                                name="Jmbg"
                                placeholder="Change JMBG"
                                value={this.state.teacher.Jmbg}
                                onChange={this.handleJmbgChange}
                                required />

                            <input
                                className="reg_teach_input"
                                type="text"
                                name="PhoneNumber"
                                placeholder="Change Phone Number"
                                value={this.state.teacher.PhoneNumber}
                                onChange={this.handlePhoneChange}
                                required />

                        </div>

                        <div className="confirm_div">
                            <div className="confirm_input">

                                <input
                                    className="confirm_input_teach_input"
                                    name="EmailConfirmed"
                                    type="checkbox"
                                    checked={this.state.teacher.EmailConfirmed}
                                    value={this.state.teacher.EmailConfirmed}
                                    onChange={this.handleInputChange}
                                />
                                <label>Email Confirmed</label>

                            </div>
                            <div className="confirm_input">

                                <input
                                    className="confirm_input_teach_input"
                                    name="PhoneNumberConfirmed"
                                    type="checkbox"
                                    checked={this.state.teacher.PhoneNumberConfirmed}
                                    value={this.state.teacher.PhoneNumberConfirmed}
                                    onChange={this.handleInputChange}
                                />
                                <label>Phone Number Confirmed</label>
                            </div>
                        </div>


                        <div className="gender_div">
                            <div className="gender_radio">
                                <input
                                    type="radio"
                                    name="Gender"
                                    value="FEMALE"
                                    checked={this.state.teacher.Gender === 'FEMALE'}
                                    onChange={this.handleInputChange} />
                                <label>female</label>

                            </div>
                            <div className="gender_radio">
                                <input
                                    type="radio"
                                    name="Gender"
                                    value="MALE"
                                    checked={this.state.teacher.Gender === 'MALE'}
                                    onChange={this.handleInputChange} />
                                <label>male</label>
                            </div>
                        </div>

                        <input type="submit" value="Change" className="submitTeacherRegister" disabled={this.state.disable} />
                        <input type="button" value="Cancel" className="cancelTeacherRegister" onClick={() => this.props.history.push("/teachers")} />
                        <label className="error">{this.state.errorMessage}</label>
                    </form>
                }

            </div>

        )
    }
};

export default UpdateTeacher;