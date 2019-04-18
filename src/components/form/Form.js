import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FORMS, FTS } from '../../service/api';
import Modal from '../common/Modal';
import '../../style/components/form/form.css';
import '../../style/components/form/formTable.css';


class Form extends Component {
    constructor(props) {
        super(props);
        this.searchedGrade = React.createRef();
        this.searchedTag = React.createRef();

        this.searchedAttendingTeacher = React.createRef();
        this.state = {
            forms: [],
            openDialog: false,
            form: null,
            students: [],
            areClassesOpened: false,
            formIdClasses: [],

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
            this.fetchForms();
        }
    }

    fetchForms = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer  ' + localStorage.getItem("token")
            }
        };
        fetch(FORMS, requestOptions)
            .then(response => {
                if (response.ok) {
                    response.json().then(data =>
                        this.setState({ forms: data.reverse() })
                    )
                } else {
                    response.text().then(message => alert(message))
                }
            })
            .catch(error => console.log(error))
    }


    openDetails = (id) => {
        let form = this.state.forms.find(f => f.ID === id);
        this.setState({ openDialog: true, form: form });
        this.setState({ form: form });

        console.log('form id:', id);
        const formId = id;
        const url = "http://localhost:54164/project/students/assigned-to-form/" + formId;
        console.log(url);

        fetch(url, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                this.setState({ students: data });
                console.log("form id: ", formId, "students: ", this.state.students);
            })
            .catch(reason => console.log(reason));

    }

    closeDetails = () => {
        this.setState({ form: null, openDialog: false })
    }

    updateForm = (id) => {
        console.log('update form id ', id);
        this.props.history.push("updateForm/" + id);
    }


    openFormIdClasses = (id) => {

        console.log('form id ', id, 'classes');
        this.props.history.push("formClasses/" + id);
    }


    deleteForm = (id) => {
        let form = this.state.forms.find(f => f.ID === id);
        const r = window.confirm(`
        Grade: ${form.Grade}
        Tag: ${form.Tag} 
        Attending Teacher: ${form.AttendingTeacher.FirstName} ${form.AttendingTeacher.LastName}

        Are you sure you want to delete this form?`);
        if (r === true) {
            const path = FORMS + "/" + id;
            const requestOptions = {
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                    'Content-Type': 'application/json'
                }
            };
            fetch(path, requestOptions)
                .then(response => {
                    if (response.ok) {
                        alert("Success!");
                        this.setState({ forms: this.state.forms.filter(form => form.ID !== id) })
                    } else {
                        response.text().then(message => alert(message))
                    }
                })
                .catch(error => console.log(error))
        }
    }

    searchForms = (event) => {
        console.log(`da li je ocitano? 
        ${this.searchedGrade.current.value}
        ${this.searchedTag.current.value}}
        ${this.searchedAttendingTeacher.current.value} `);

        event.preventDefault();

        let originalFormList = this.state.forms;
        let newList = [];

        if (this.searchedGrade.current.value !== ""
            && this.searchedTag.current.value === ""
            && this.searchedAttendingTeacher.current.value === "") {
            console.log('if')
            newList = this.state.forms.filter(f => f.Grade.toString() === this.searchedGrade.current.value)
            this.setState({
                forms: newList
            });
        }
        else if (this.searchedGrade.current.value === ""
            && this.searchedTag.current.value !== ""
            && this.searchedAttendingTeacher.current.value === "") {
            console.log('else if2')
            newList = this.state.forms.filter(f => {

                const lc = f.Tag.toLowerCase();
                const filter = this.searchedTag.current.value.toLowerCase();
                return lc.includes(filter);
            })
            this.setState({
                forms: newList
            });
        }
        else if (this.searchedGrade.current.value === ""
            && this.searchedTag.current.value === ""
            && this.searchedAttendingTeacher.current.value !== "") {
            console.log('else if3')
            newList = this.state.forms.filter(f => {

                const lcfn = f.AttendingTeacher.FirstName.toLowerCase();
                const lcln = f.AttendingTeacher.LastName.toLowerCase();
                const filter = this.searchedAttendingTeacher.current.value.toLowerCase();
                return (lcfn.includes(filter) || lcln.includes(filter));
            })
            this.setState({
                forms: newList
            });
        }

        else if (this.searchedGrade.current.value !== ""
            && this.searchedTag.current.value !== ""
            && this.searchedAttendingTeacher.current.value === "") {
            console.log('else if4')

            newList = this.state.forms.filter(f => {

                const gr = f.Grade.toString();
                const filter1 = this.searchedGrade.current.value;
                const lc = f.Tag.toLowerCase();
                const filter2 = this.searchedTag.current.value.toLowerCase();
                return (lc.includes(filter2) && gr === filter1);
            })
            this.setState({
                forms: newList
            });
        }
        else if (this.searchedGrade.current.value === ""
            && this.searchedTag.current.value !== ""
            && this.searchedAttendingTeacher.current.value !== "") {
            console.log('else if5')

            newList = this.state.forms.filter(f => {

                const lc = f.Tag.toLowerCase();
                const filter2 = this.searchedTag.current.value.toLowerCase();
                const lcfn = f.AttendingTeacher.FirstName.toLowerCase();
                const lcln = f.AttendingTeacher.LastName.toLowerCase();
                const filter = this.searchedAttendingTeacher.current.value.toLowerCase();

                return (lc.includes(filter2) && (lcfn.includes(filter) || lcln.includes(filter)));
            })
            this.setState({
                forms: newList
            });
        }
        else if (this.searchedGrade.current.value !== ""
            && this.searchedTag.current.value === ""
            && this.searchedAttendingTeacher.current.value !== "") {
            console.log('else if6')

            newList = this.state.forms.filter(f => {

                const gr = f.Grade.toString();
                const filter1 = this.searchedGrade.current.value;
                const lcfn = f.AttendingTeacher.FirstName.toLowerCase();
                const lcln = f.AttendingTeacher.LastName.toLowerCase();
                const filter = this.searchedAttendingTeacher.current.value.toLowerCase();

                return (gr.includes(filter1) && (lcfn.includes(filter) || lcln.includes(filter)));
            })
            this.setState({
                forms: newList
            });
        }
        else if (this.searchedGrade.current.value !== ""
            && this.searchedTag.current.value !== ""
            && this.searchedAttendingTeacher.current.value !== "") {
            console.log('else if7')

            newList = this.state.forms.filter(f => {

                const gr = f.Grade.toString();
                const filter1 = this.searchedGrade.current.value;
                const lc = f.Tag.toLowerCase();
                const filter2 = this.searchedTag.current.value.toLowerCase();
                const lcfn = f.AttendingTeacher.FirstName.toLowerCase();
                const lcln = f.AttendingTeacher.LastName.toLowerCase();
                const filter = this.searchedAttendingTeacher.current.value.toLowerCase();

                return (lc.includes(filter2) && gr.includes(filter1) && (lcfn.includes(filter) || lcln.includes(filter)));
            })
            this.setState({
                forms: newList
            });
        }
        else {
            console.log('else')
            newList = originalFormList;
            this.setState({
                forms: newList
            });
        }
    }

    resetSearch = () => {
        this.fetchForms();

        this.searchedAttendingTeacher.current.value = "";
        this.searchedGrade.current.value = "";
        this.searchedTag.current.value = "";
    }

    render() {

        const formIdClasses = ["Subject", "Grade", "Teacher", "Weekly classes"];
        const studentHeading = ["Id", "First name", "Last name", "Username"];
        const buttons = [
            { name: "Classes", action: this.openFormIdClasses, class: "btn-add" },
            { name: "Students", action: this.openDetails, class: "formTable_btn-neutral" },
            { name: "Update", action: this.updateForm, class: "formTable_btn-update" },
            { name: "Delete", action: this.deleteForm, class: "formTable_btn-delete" }];

        return (
            <div className="form_body">
                <div className='form_body_addLinks'>
                    <Link to="/addForm" ><button className='formTable_btn-add-xl1'>NEW FORM</button></Link>
                    <br />
                    <Link to="/addStudentToForm" ><button className='formTable_btn-add-xl2'>Transfer student</button></Link>

                </div>

                <h2 id="h2_form_body"> {this.state.forms.length} forms </h2>

                <div className="form_wrapper">
                    {

                        this.state.forms &&
                        <div>
                            <form onSubmit={this.searchForms} className='form_search_header'>
                                <label id="form_search_input3">Search forms </label>
                                <input
                                    type="number"
                                    id="form_search_input5"
                                    placeholder="by grade"
                                    ref={this.searchedGrade}

                                />

                                <input
                                    type="text"
                                    id="form_search_input4"
                                    placeholder="by tag"
                                    ref={this.searchedTag}
                                />
                                <input
                                    type="text"
                                    id="form_search_input1"
                                    placeholder="by attending teacher"
                                    ref={this.searchedAttendingTeacher}

                                />
                                <input type="submit" value="Find" id="form_search_button1" />
                                <button onClick={this.resetSearch} className="btn-cancel"> RESET </button>
                            </form>

                            <table className='formTable_' id="form_table_id">

                                <thead id="form_t_header">

                                    <tr >
                                        <th id='form_tab_header_id'>Id</th>
                                        <th id='form_tab_header_id'>Grade</th>
                                        <th id='form_tab_header_id'>Tag</th>
                                        <th id='form_tab_header_id'>Attending teacher</th>
                                        <th id='cells_for_buttons'></th>
                                        <th id='cells_for_buttons'></th>
                                        <th id='cells_for_buttons'></th>
                                        <th id='cells_for_buttons'></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.state.forms.map(form =>
                                            <tr key={form.ID}>
                                                <td>{form.ID}</td>
                                                <td>{form.Grade}</td>
                                                <td>{form.Tag.toUpperCase()}</td>


                                                <td>{form.AttendingTeacher.FirstName} {form.AttendingTeacher.LastName}</td>
                                                {
                                                    buttons.map(btn => (
                                                        <td key={btn.name} id="cells_for_buttons"><button className={btn.class} onClick={() => btn.action(form.ID)}>{btn.name}</button></td>
                                                    ))
                                                }
                                            </tr>
                                        )
                                    }
                                </tbody>
                            </table>
                        </div>
                    }

                    <Modal show={this.state.openDialog} onClose={this.closeDetails}>
                        <table>
                            <thead>
                                <tr>
                                    {
                                        studentHeading.map((head, index) => <th key={index}>{head}</th>)
                                    }
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.form && this.state.students.map(item =>
                                        <tr key={item.ID}>
                                            <td>{item.ID}</td>
                                            <td>{item.FirstName}</td>
                                            <td>{item.LastName}</td>
                                            <td>{item.UserName}</td>
                                        </tr>
                                    )
                                }
                            </tbody>
                        </table>
                        {this.state.students.length === 0 ?
                            <label>Student list is empty</label>
                            :
                            null}
                    </Modal>

                </div>
            </div>

        )
    }
};

export default Form;