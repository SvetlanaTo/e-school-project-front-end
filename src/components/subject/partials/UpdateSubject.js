import React, { Component } from 'react';
import '../../../style/components/auth/andjalogin.css';
import { SUBJECTS } from "../../../service/api";

class UpdateSubject extends Component {
    constructor(props) {
        super(props);
        this.state = {
            subject: null,
            errorMessage: '',
            disable: false,

        };
    }

    componentDidMount() {
        if (localStorage.getItem('token') === null) {
            this.props.history.push('/login');
        }
        else if (localStorage.getItem('role') !== 'admin') {
            this.props.history.push('/no-auth');

        }
        else {

            const path = SUBJECTS + "/" + this.props.match.params.id;
            const requestOptions = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer  ' + localStorage.getItem("token")
                }
            };
            fetch(path, requestOptions)
                .then(response => response.json())
                .then(data => {
                    this.setState({ subject: data })
                });
        }

    }

    handleInputChange = (event) => {
        const target = event.target;
        const name = target.name;

        this.setState({
            subject: { ...this.state.subject, [name]: target.value }
        });
    }

    handleNameChange = (event) => {
        const target = event.target;
        const name = target.name;

        if (target.value === '') {
            this.setState({
                disable: true,
                errorMessage: '',
                subject: { ...this.state.subject, [name]: target.value }
            })
        }
        else if ((target.value.length < 2 || target.value.length > 50)) {
            this.setState({
                errorMessage: "Name must be between 2 and 50 characters long.",
                disable: true,
                subject: { ...this.state.subject, [name]: target.value }
            })
        }
        else {
            this.setState({
                errorMessage: "",
                disable: false,
                subject: { ...this.state.subject, [name]: target.value }
            })
        }
    }

    handleGradeChange = (event) => {
        const target = event.target;
        const name = target.name;

        if (target.value === '') {
            this.setState({
                disable: true,
                errorMessage: '',
                subject: { ...this.state.subject, [name]: target.value }
            })
        }
        else if (target.value !== '' && (target.value < 1 || target.value > 8)) {
            this.setState({
                errorMessage: "Grade must be a number between 1 and 8.",
                disable: true,
                subject: { ...this.state.subject, [name]: target.value }
            })
        }
        else {
            this.setState({
                errorMessage: "",
                disable: false,
                subject: { ...this.state.subject, [name]: target.value }
            })
        }
    }

    handleWeeklyClassesChange = (event) => {
        const target = event.target;
        const name = target.name;

        if (target.value === '') {
            this.setState({
                disable: true,
                errorMessage: '',
                subject: { ...this.state.subject, [name]: target.value }
            })
        }
        else if (target.value !== '' && (target.value < 1 || target.value > 60)) {
            this.setState({
                errorMessage: "Number Of Classes Per Week must be a number between 1 and 60.",
                disable: true,
                subject: { ...this.state.subject, [name]: target.value }
            })
        }
        else {
            this.setState({
                errorMessage: "",
                disable: false,
                subject: { ...this.state.subject, [name]: target.value }
            })
        }
    }

    handleSubmit = (event) => {
        const newName = this.state.subject.Name;
        const newGrade = this.state.subject.Grade;
        const newWeeklyClasses = this.state.subject.NumberOfClassesPerWeek;

        const r = window.confirm(`
        Name: ${newName}
        Grade: ${newGrade}
        Weekly classes: ${newWeeklyClasses} 

        Are you sure you want to create this subject?`);
        if (r === true) {
            const requestOptions = {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer  ' + localStorage.getItem("token")
                },
                body: JSON.stringify({
                    ID: this.state.subject.ID,
                    Name: this.state.subject.Name,
                    Grade: this.state.subject.Grade,
                    NumberOfClassesPerWeek: this.state.subject.NumberOfClassesPerWeek,
                    SubjectsTeachers: this.state.subject.SubjectsTeachers
                })
            };

            const path = SUBJECTS + "/" + this.state.subject.ID;
            fetch(path, requestOptions)
                .then(response => {
                    if (response.ok) {
                        alert('success!');
                        response.json().then(data => {
                            this.setState({ errorMessage: '' })
                            this.props.history.push("/subjects");
                        });
                    } else {
                        response.text().then(message => this.setState({ errorMessage: message }))
                    }
                })
                .catch(error => console.log(error))
            event.preventDefault();
        }

    };

    render() {
        return (
            <div className="update_form_wrapper">
                {
                    this.state.subject &&
                    <form onSubmit={this.handleSubmit} className="andjaform" >
                        <input
                            className="andjainput"
                            type="text"
                            name="Name"
                            placeholder="Change subject name"
                            value={this.state.subject.Name}
                            onChange={this.handleNameChange}
                            required />

                        <input
                            className="andjainput"
                            type="number"
                            name="Grade"
                            placeholder="Change subject grade"
                            value={this.state.subject.Grade}
                            onChange={this.handleGradeChange} />

                        <input
                            className="andjainput"
                            type="number"
                            name="NumberOfClassesPerWeek"
                            placeholder="Change NumberOfClassesPerWeek"
                            value={this.state.subject.NumberOfClassesPerWeek}
                            onChange={this.handleWeeklyClassesChange} />

                        <input type="submit" value="Change" className="submit" />
                        <input type="button" value="Cancel" className="formTable_btn-nop" onClick={() => this.props.history.push("/subjects")} />
                        <label className="error">{this.state.errorMessage}</label>
                    </form>
                }

            </div>

        )
    }
};

export default UpdateSubject;