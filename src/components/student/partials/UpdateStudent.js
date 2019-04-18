import React, { Component } from 'react';
import '../../../style/components/auth/login.css';
import { STUDENTS } from "../../../service/api";


class UpdateStudent extends Component {
    constructor(props) {
        super(props);
        this.state = { student: null, errorMessage: '' };
        this.fileInput = React.createRef();
    }

    componentDidMount() {
        if (localStorage.getItem('token') === null) {
            this.props.history.push('/login');
        }
        else if (localStorage.getItem('role') !== 'admin') {
            this.props.history.push('/no-auth');

        }
        else {
            const path = STUDENTS + "/" + this.props.match.params.id;
            const requestOptions = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem("token")
                }
            };
            fetch(path, requestOptions)
                .then(response => response.json())
                .then(data => {
                    this.setState({ student: data })
                });
        }
    }

    handleInputChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            student: { ...this.state.student, [name]: value }

        });
    }

    handleFirstNameChange = (event) => {
        const target = event.target;
        const name = target.name;

        if (target.value === '') {
            this.setState({
                disable: true,
                errorMessage: '',
                student: { ...this.state.student, [name]: target.value }
            })
        }
        else if ((target.value.length < 2 || target.value.length > 50)) {
            this.setState({
                errorMessage: "First name must be between 2 and 50 characters long.",
                disable: true,
                student: { ...this.state.student, [name]: target.value }
            })
        }
        else {
            this.setState({
                errorMessage: "",
                disable: false,
                student: { ...this.state.student, [name]: target.value }
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
                student: { ...this.state.student, [name]: target.value }
            })
        }
        else if ((target.value.length < 2 || target.value.length > 50)) {
            this.setState({
                errorMessage: "Last name must be between 2 and 50 characters long.",
                disable: true,
                student: { ...this.state.student, [name]: target.value }
            })
        }
        else {
            this.setState({
                errorMessage: "",
                disable: false,
                student: { ...this.state.student, [name]: target.value }
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
                student: { ...this.state.student, [name]: target.value }
            })
        }
        else if ((target.value.length < 4 || target.value.length > 50)) {
            this.setState({
                errorMessage: "Username must be between 4 and 50 characters long.",
                disable: true,
                student: { ...this.state.student, [name]: target.value }
            })
        }
        else {
            this.setState({
                errorMessage: "",
                disable: false,
                student: { ...this.state.student, [name]: target.value }
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
                student: { ...this.state.student, [name]: target.value }
            })
        }
        else if (!target.value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
            this.setState({
                errorMessage: "A valid e-mail address is required.",
                disable: true,
                student: { ...this.state.student, [name]: target.value }
            })
        }
        else {
            this.setState({
                errorMessage: "",
                disable: false,
                student: { ...this.state.student, [name]: target.value }
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
                student: { ...this.state.student, [name]: target.value }
            })
        }
        else if (target.value !== '' && target.value.length !== 13) {

            this.setState({
                disable: true,
                errorMessage: `Student's JMBG must be exactly 13 characters long.`,
                student: { ...this.state.student, [name]: target.value }
            })
        }
        else {
            this.setState({
                errorMessage: "",
                disable: false,
                student: { ...this.state.student, [name]: target.value }
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
                ID: this.state.student.ID,
                FirstName: this.state.student.FirstName,
                LastName: this.state.student.LastName,
                Email: this.state.student.Email,
                UserName: this.state.student.UserName,
                PhoneNumber: this.state.student.PhoneNumber,
                Jmbg: this.state.student.Jmbg,
                DayOfBirth: this.state.student.DayOfBirth,
                EmailConfirmed: this.state.student.EmailConfirmed,
                PhoneNumberConfirmed: this.state.student.PhoneNumberConfirmed,
                IsActive: this.state.student.IsActive,
                FormId: this.state.student.FormId

            })
        };

        const path = STUDENTS + "/" + this.state.student.ID;
        fetch(path, requestOptions)
            .then(response => {
                if (response.ok) {
                    response.json().then(data => {
                        this.setState({ errorMessage: '' })
                        this.props.history.push("/students");
                    });
                } else {
                    response.text().then(message => this.setState({ errorMessage: message }))
                }
            })
            .catch(error => console.log(error))
        event.preventDefault();

    };

    handleFileSubmit = (event) => {
        event.preventDefault();
        const data = new FormData();
        data.append('file', this.fileInput.current.files[0]);

        if (this.fileInput.current.files.length === 1) {

            fetch('http://localhost:54164/project/students/upload-image/' + this.state.student.ID, {
                method: 'POST',
                headers: new Headers({
                    'Authorization': 'Bearer ' + localStorage.getItem("token")
                }),
                body: data
            })
                .then(response => {
                    if (response.ok) {
                        window.alert(`Your file: ${this.fileInput.current.files[0].name}
                         has been successfully uploaded!`);
                        response.json().then(data => {
                            this.setState({ errorMessage: '' });
                        });
                    } else {
                        response.text().then(message => this.setState({ errorMessage: message }));
                    }
                })
                .catch(error => console.error('Error:', error))
        }
        else {
            console.log(`No files selected for update.`);
            alert(`No files selected for update.`);
        }
    }

    render() {
        return (
            <div className="login_form">

                <div>
                    {
                        this.state.student &&
                        <form onSubmit={this.handleFileSubmit} encType="multipart/form-data" action="api/upload">
                            <label>
                                Change image:
                         <input
                                    type="file"
                                    ref={this.fileInput}
                                />
                                <button type="submit" onSubmit={this.handleFileSubmit}> Save </button>


                            </label>
                        </form>
                    }
                </div>
                {
                    this.state.student &&
                    <form onSubmit={this.handleSubmit}>
                        <input
                            type="text"
                            name="FirstName"
                            placeholder="Change first name"
                            value={this.state.student.FirstName}
                            onChange={this.handleFirstNameChange}
                            required />

                        <input
                            type="text"
                            name="LastName"
                            placeholder="Change last name"
                            value={this.state.student.LastName}
                            onChange={this.handleLastNameChange}
                            required />

                        <input
                            type="text"
                            name="UserName"
                            placeholder="Change username"
                            value={this.state.student.UserName}
                            onChange={this.handleUserNameChange}
                            required />

                        <input
                            type="email"
                            name="Email"
                            placeholder="Change email"
                            value={this.state.student.Email}
                            onChange={this.handleEmailChange}
                            required />

                        <input
                            name="EmailConfirmed"
                            type="checkbox"
                            checked={this.state.student.EmailConfirmed}
                            value={this.state.student.EmailConfirmed}
                            onChange={this.handleInputChange} /> Email Confirmed

                        <input
                            type="text"
                            name="Jmbg"
                            placeholder="Change JMBG"
                            value={this.state.student.Jmbg}
                            onChange={this.handleJmbgChange}
                            required />

                        <input
                            type="text" id="start"
                            name="DayOfBirth"
                            placeholder="Change day of birth (MM/dd/yyyy)"
                            value={this.state.student.DayOfBirth}
                            onChange={this.handleInputChange}
                            required />
                        <label for="start">Change DayOfBirth:</label>

                        <input
                            type="text"
                            name="PhoneNumber"
                            placeholder="Change Phone Number"
                            value={this.state.student.PhoneNumber}
                            onChange={this.handleInputChange}
                        />

                        <input
                            name="PhoneNumberConfirmed"
                            type="checkbox"
                            checked={this.state.student.PhoneNumberConfirmed}
                            value={this.state.student.PhoneNumberConfirmed}
                            onChange={this.handleInputChange}
                        /> Phone Number Confirmed

                       <input
                            name="IsActive"
                            type="checkbox"
                            checked={this.state.student.IsActive}
                            value={this.state.student.IsActive}
                            onChange={this.handleInputChange} /> IsActive



                        <input type="submit" value="Change" className="submit" />
                        <input type="button" value="Cancel" className="cancel" onClick={() => this.props.history.push("/students")} />
                        <label className="error">{this.state.errorMessage}</label>

                    </form>
                }



            </div>

        )
    }
};

export default UpdateStudent;