import React, { Component } from 'react';
import '../../../style/components/auth/login.css';
import { SUBJECTS } from "../../../service/api";

class AddSubject extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Name: '',
            Grade: 0,
            NumberOfClassesPerWeek: 0,
            errorMessage: '',
            disable: true,
        };
    }

    componentDidMount() {
        if (localStorage.getItem('token') === null) {
            this.props.history.push('/login');
        }
        else if (localStorage.getItem('role') !== 'admin') {
            this.props.history.push('/no-auth');
        }

    }

    handleInputChange = (event) => {
        const target = event.target;
        const name = target.name;

        this.setState({
            [name]: target.value
        });
    }

    handleNameChange = (event) => {
        const target = event.target;
        const name = target.name;

        if (target.value === '') {
            this.setState({ disable: true, errorMessage: '' })
        }
        else if (target.value !== '' && (target.value.length > 100 || target.value.length < 2)) {
            this.setState({ errorMessage: "Subject name must be between 2 and 100 characters long.", disable: true })
        }
        else {
            this.setState({
                errorMessage: "",
                disable: false,
                [name]: target.value
            })
        }
    }

    handleGradeChange = (event) => {
        const target = event.target;
        const name = target.name;

        if (target.value === '') {
            this.setState({ disable: true, errorMessage: '' })
        }
        else if (target.value !== '' && (target.value < 1 || target.value > 8)) {
            this.setState({ errorMessage: "Grade must be a number between 1 and 8.", disable: true })
        }
        else {
            this.setState({
                errorMessage: "",
                disable: false,
                [name]: target.value
            })
        }
    }

    handleWeeklyClassesChange = (event) => {
        const target = event.target;
        const name = target.name;

        if (target.value === '') {
            this.setState({ disable: true, errorMessage: '' })
        }
        else if (target.value !== '' && (target.value < 0 || target.value > 60)) {
            this.setState({ errorMessage: "Number Of Classes Per Week must be a number between 1 and 60.", disable: true })
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

        const newName = this.state.Name;
        const newGrade = this.state.Grade;
        const newWeeklyClasses = this.state.NumberOfClassesPerWeek;

        const r = window.confirm(`
        Name: ${newName}
        Grade: ${newGrade}
        Weekly classes: ${newWeeklyClasses} 

        Are you sure you want to create this subject?`);
        if (r === true) {
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer  ' + localStorage.getItem("token")
                },
                body: JSON.stringify({
                    Name: this.state.Name,
                    Grade: this.state.Grade,
                    NumberOfClassesPerWeek: this.state.NumberOfClassesPerWeek

                })
            };

            fetch(SUBJECTS, requestOptions)
                .then(response => {
                    if (response.ok) {

                        const r = window.confirm(`
                        Success! 
                        Do you wish to continue creating subjects?`);
                        if (r === false) {
                            response.json().then(data => {
                                this.setState({ errorMessage: '' })
                                this.props.history.push("/subjects");
                            });
                        }
                        else {
                            window.location.reload();
                        }
                    } else {
                        response.text().then(message => this.setState({ errorMessage: message }))
                    }
                })
                .catch(error => console.log(error))

        }
        event.preventDefault();
    };


    render() {
        return (
            <div className="add_form_wrapper">
                <form onSubmit={this.handleSubmit}>
                    <input
                        type="text"
                        name="Name"
                        placeholder="Enter name"
                        onChange={this.handleNameChange} />

                    <input
                        type="number"
                        name="Grade"
                        placeholder="Enter subject grade"
                        onChange={this.handleGradeChange} />

                    <input
                        type="number"
                        name="NumberOfClassesPerWeek"
                        placeholder="Enter NumberOfClassesPerWeek"
                        onChange={this.handleWeeklyClassesChange} />

                    <input type="submit" value="Add" className="submit" disabled={this.state.disable} />
                    <input type="button" value="Cancel" className="formTable_btn-nop" onClick={() => this.props.history.push("/subjects")} />
                    <label className="error">{this.state.errorMessage}</label>
                </form>
            </div>

        )
    }
};

export default AddSubject;