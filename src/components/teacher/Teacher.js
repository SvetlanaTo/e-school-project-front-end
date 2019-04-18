import React, { Component } from 'react';
import { TEACHERS, TEACHER_TO_SUBJECT } from '../../service/api';
import Modal from '../common/Modal';
import MyTeacherSubjectsModal from '../common/MyTeacherSubjectsModal';

import '../../style/components/teacher/teacher.css';
import '../../style/common/table.css';

class Teacher extends Component {
    constructor(props) {
        super(props);
        this.searchedGender = React.createRef();
        this.searchedName = React.createRef();
        this.searchedUserName = React.createRef();

        this.state = {
            teachers: [],
            teacher: null,
            subjects: [],
            selectedSubject: null,
            openDialog: false,
            openMoreInfo: false,
            note: '',

            teachToSubs: [],
            teachToSub: null,
            searchedGender: ''

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
            this.fetchTeachers();
            this.fetchTeachersToSubjects();
        }
    }

    fetchTeachers = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer  ' + localStorage.getItem("token")
            }
        };
        fetch(TEACHERS, requestOptions)
            .then(response => {
                if (response.ok) {
                    response.json().then(data =>
                        this.setState({ teachers: data.reverse() })
                    )
                } else {
                    response.text().then(message => alert(message))
                }
            })
            .catch(error => console.log(error))
    }

    fetchTeachersToSubjects = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer  ' + localStorage.getItem("token")
            }
        };
        fetch(TEACHER_TO_SUBJECT, requestOptions)
            .then(response => {
                if (response.ok) {
                    response.json().then(data =>
                        this.setState({ teachToSubs: data })
                    )
                } else {
                    response.text().then(message => alert(message))
                }
            })
            .catch(error => console.log(error))
    }

    getMoreTeacherInfo = (id) => {
        let teacher = this.state.teachers.find(t => t.ID === id);
        this.setState({ openMoreInfo: true, teacher: teacher });
    }

    closeInfo = () => {
        this.setState({ teacher: null, openMoreInfo: false, note: '' })
    }

    openSubjects = (id) => {
        let teacher = this.state.teachers.find(t => t.ID === id);
        this.setState({ openDialog: true, teacher: teacher });

        const teacherId = id;
        console.log('teacher id:', id);
        const url = 'http://localhost:54164/project/teachers-to-subjects/teachers/' + teacherId + '/subjects';

        fetch(url, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(json => {
                this.setState({ subjects: json });
                console.log("techer id: ", teacherId, "subjects: ", this.state.subjects);
            })
            .catch(reason => console.log(reason));
    }

    closeSubjects = () => {
        this.setState({ teacher: null, openDialog: false, note: '' })
    }

    updateTeacher = (id) => {
        this.props.history.push("updateTeacher/" + id);
    }

    deleteTeacher = (id) => {
        let teacher = this.state.teachers.find(t => t.ID === id);
        const r = window.confirm(`Are you sure you want to delete teacher ${teacher.FirstName} ${teacher.LastName}?`);
        if (r === true) {
            const path = TEACHERS + "/" + id;
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
                        this.setState({
                            teachers: this.state.teachers.filter(teacher => teacher.ID !== id)
                        })
                        alert('The teacher has been successfully deleted!');
                    }
                    else {
                        response.text().then(message => {
                            alert(message)

                            const r = window.confirm(`
                            Do you wish to unassign all subjects from
                            teacher ${teacher.FirstName} ${teacher.LastName}
                            by stopping teaching engagement ?

            `);
                            if (r === true) {
                                const path = TEACHER_TO_SUBJECT + "/by-teacher/" + id + "/stopped-teaching-to-now";
                                const requestOptions = {
                                    method: 'PUT',
                                    headers: {
                                        'Authorization': 'Bearer ' + localStorage.getItem('token'),
                                        'Content-Type': 'application/json; charset= UTF-8'
                                    }
                                };

                                fetch(path, requestOptions)
                                    .then(response => {
                                        if (response.ok) {
                                            alert('Success!');
                                        } else {
                                            response.text().then(message => alert(message))
                                        }
                                    })
                                    .catch(error => console.log(error));

                            }
                        });
                    }
                })
                .catch(error => console.log(error))
        }
    }

    assignSubject = (id) => {
        console.log('teacher id:', id);
        this.props.history.push("assign-subject-to-teacher/" + id);
    }

    handleInputChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value

        });
    }

    searchTeachers = (event) => {
        event.preventDefault();

        let originalTeacherList = this.state.teachers;
        let newList = [];

        if (this.searchedName.current.value !== ""
            && this.searchedGender.current.value === ""
            && this.searchedUserName.current.value === "") {
            newList = this.state.teachers.filter(f => {

                const fn = f.FirstName.toLowerCase();
                const ln = f.LastName.toLowerCase();
                const filter = this.searchedName.current.value.toLowerCase();
                return (fn.includes(filter) || ln.includes(filter));
            })
            this.setState({
                teachers: newList
            });
        }
        else if (this.searchedName.current.value === ""
            && this.searchedGender.current.value !== ""
            && this.searchedUserName.current.value === "") {
            console.log('else if2')
            newList = this.state.teachers.filter(f => f.Gender === this.searchedGender.current.value)
            this.setState({
                teachers: newList
            });
        }
        else if (this.searchedName.current.value === ""
            && this.searchedGender.current.value === ""
            && this.searchedUserName.current.value !== "") {
            newList = this.state.teachers.filter(f => {

                const lc = f.UserName.toLowerCase();
                const filter = this.searchedUserName.current.value.toLowerCase();
                return lc.includes(filter);

            })
            this.setState({
                teachers: newList
            });
        }

        else if (this.searchedName.current.value !== ""
            && this.searchedGender.current.value !== ""
            && this.searchedUserName.current.value === "") {

            newList = this.state.teachers.filter(f => {

                const gr = f.Gender;
                const filter1 = this.searchedGender.current.value;

                const fn = f.FirstName.toLowerCase();
                const ln = f.LastName.toLowerCase();
                const filter = this.searchedName.current.value.toLowerCase();
                return ((fn.includes(filter) || ln.includes(filter)) && gr === filter1);

            })
            this.setState({
                teachers: newList
            });
        }
        else if (this.searchedName.current.value === ""
            && this.searchedGender.current.value !== ""
            && this.searchedUserName.current.value !== "") {

            newList = this.state.teachers.filter(f => {

                const gr = f.Gender;
                const filter1 = this.searchedGender.current.value;

                const wc = f.UserName.toLowerCase();
                const filter2 = this.searchedUserName.current.value.toLowerCase();

                return (gr.includes(filter1) && wc.includes(filter2));
            })

            this.setState({
                teachers: newList
            });
        }
        else if (this.searchedName.current.value !== ""
            && this.searchedGender.current.value === ""
            && this.searchedUserName.current.value !== "") {

            newList = this.state.teachers.filter(f => {

                const fn = f.FirstName.toLowerCase();
                const ln = f.LastName.toLowerCase();
                const filter = this.searchedName.current.value.toLowerCase();


                const wc = f.UserName.toLowerCase();
                const filter2 = this.searchedUserName.current.value.toLowerCase();

                return ((fn.includes(filter) || ln.includes(filter)) && wc.includes(filter2));
            })
            this.setState({
                teachers: newList
            });
        }
        else if (this.searchedName.current.value !== ""
            && this.searchedGender.current.value !== ""
            && this.searchedUserName.current.value !== "") {

            newList = this.state.teachers.filter(f => {

                const gr = f.Gender;
                const filter1 = this.searchedGender.current.value;

                const fn = f.FirstName.toLowerCase();
                const ln = f.LastName.toLowerCase();
                const filter2 = this.searchedName.current.value.toLowerCase();


                const wc = f.UserName.toLowerCase();
                const filter3 = this.searchedUserName.current.value.toLowerCase();

                return ((fn.includes(filter2) || ln.includes(filter2)) && gr.includes(filter1) && wc.includes(filter3));
            })
            this.setState({
                teachers: newList
            });
        }
        else {
            newList = originalTeacherList;
            this.setState({
                teachers: newList
            });
        }
    }

    resetSearch = () => {
        this.fetchTeachers();

        this.searchedGender.current.value = '';
        this.searchedName.current.value = "";
        this.searchedUserName.current.value = "";
    }

    removeSubject = (id) => {
        //FTS + /{id:int}/stopped-to-now
        const teacherId = this.state.teacher.ID;
        console.log(teacherId);


        const r = window.confirm(`
Are you sure you want to unassign 
teacher ${this.state.teacher.FirstName} ${this.state.teacher.LastName} 
from teaching this subject?`);
        if (r === true) {
            const path = TEACHER_TO_SUBJECT + "/teacher/" + this.state.teacher.ID + "/subject/" + id + "/stopped-teaching-now";
            const requestOptions = {
                method: 'PUT',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                    'Content-Type': 'application/json'
                }
            };
            fetch(path, requestOptions)
                .then(response => {
                    if (response.ok) {
                        alert("Success!");
                        this.fetchSubjects(teacherId);

                    } else {
                        response.text().then(message => alert(message))
                    }
                })
                .catch(error => console.log(error))
        }
    }

    fetchSubjects = (id) => {
        let teacher = this.state.teachers.find(t => t.ID === id);
        this.setState({
            openDialog: true,
            teacher: teacher
        });

        const teacherId = id;
        console.log('teacher id:', id);
        const url = 'http://localhost:54164/project/teachers-to-subjects/teachers/' + teacherId + '/subjects';

        fetch(url, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(json => {
                this.setState({ subjects: json });
                console.log("techer id: ", teacherId, "subjects: ", this.state.subjects);
            })
            .catch(reason => console.log(reason));
    }



    render() {

        const heading = ["Id", "UserName", "FirstName", "LastName", "", "", "", ""];

        const subjectHeading = ["Id", "Name", "Grade", "Weekly hours", "Started", "Stopped", ""];
        const buttons = [
            { name: "Subjects", action: this.openSubjects, class: "formTable_btn-neutral" },
            { name: "Update", action: this.updateTeacher, class: "btn-update" },
            { name: "Delete", action: this.deleteTeacher, class: "btn-delete" }];

        return (
            <div className="myteacher_body">

                <div className='myteacher_body_addLinks'>
                </div>

                <h2 id="h2_myteacher_body"> {this.state.teachers.length} teachers </h2>
                <div className="myteacher_wrapper">

                    <MyTeacherSubjectsModal get={this.state.openDialog} hide={this.closeSubjects}>

                        {this.state.subjects.length === 0 ?
                            <div className="myteachermodal_colums_row">
                                <label className="myteachermodal_colums_row_c1"><b>Subjects list is empty</b></label>
                                <button className="myteachermodal_colums_row_c1, myteachermodalbtn-update" onClick={() => this.assignSubject(this.state.teacher.ID)}>ASSIGN</button>
                            </div>
                            :

                            <div className="myteachermodal_colums_row">
                                <h4 className="myteachermodal_colums_row_c2">{this.state.subjects.length} subjects </h4>
                                <button className="myteachermodal_colums_row_c2, myteachermodalbtn-update" onClick={() => this.assignSubject(this.state.teacher.ID)}>ASSIGN</button>

                            </div>
                        }



                        <table>
                            <thead>
                                <tr>
                                    {
                                        subjectHeading.map((head, index) => <th key={index}>{head}</th>)
                                    }
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.teacher && this.state.subjects.map(item =>

                                        <tr key={item.Subject.ID}>
                                            <td>{item.Subject.ID}</td>
                                            <td>{item.Subject.Name}</td>
                                            <td>{item.Subject.Grade}</td>
                                            <td>{item.Subject.NumberOfClassesPerWeek}</td>
                                            <td>{item.StartedTeaching}</td>
                                            <td>{item.StoppedTeaching}</td>
                                            <td><button className="btn-update" onClick={() => this.removeSubject(item.Subject.ID)}>Remove</button></td>
                                        </tr>
                                    )
                                }
                            </tbody>
                        </table>

                    </MyTeacherSubjectsModal>

                    <Modal show={this.state.openMoreInfo} onClose={this.closeInfo}>
                        {this.state.teacher &&
                            <ul>
                                <li>Id: {this.state.teacher.ID}</li>
                                <li>UserName: {this.state.teacher.UserName}</li>
                                <li>FirstName: {this.state.teacher.FirstName}</li>
                                <li>LastName: {this.state.teacher.LastName}</li>
                                <li>Email: {this.state.teacher.Email}</li>
                                <li>PhoneNumber: {this.state.teacher.PhoneNumber}</li>
                                <li>Gender: {this.state.teacher.Gender}</li>
                                <li>Jmbg: {this.state.teacher.Jmbg}</li>
                                <li>IsStillWorking: {this.state.teacher.IsStillWorking.toString()}</li>
                                <li>EmailConfirmed: {this.state.teacher.EmailConfirmed.toString()}</li>
                                <li>PhoneNumberConfirmed: {this.state.teacher.PhoneNumberConfirmed.toString()}</li>
                            </ul>
                        }
                    </Modal>

                    {
                        this.state.teachers &&



                        <div>
                            <form onSubmit={this.searchTeachers} className='myteacher_search_header'>
                                <label id="myteacher_search_input3">Search teachers </label>
                                <input
                                    type="text"
                                    id="myteacher_search_input5"
                                    placeholder="by username"
                                    ref={this.searchedUserName}
                                />

                                <select
                                    ref={this.searchedGender}
                                    //value={this.state.searchedGender}
                                    id="myteacher_search_input4"
                                    name="searchedGender"
                                // onChange={this.handleInputChange} 
                                >
                                    <option disabled hidden value=''>by gender</option>
                                    <option value="FEMALE">female</option>
                                    <option value="MALE">male</option>

                                </select>

                                <input
                                    type="text"
                                    id="myteacher_search_input1"
                                    placeholder="by name"
                                    ref={this.searchedName}
                                />

                                <input type="submit" value="Find" id="myteacher_search_button1" />
                                <button onClick={this.resetSearch} className="btn-cancel"> RESET </button>
                            </form>

                            <table id="myteacher_table_id">
                                <thead id="myteacher_t_header">
                                    <tr>
                                        {heading.map((head, index) =>
                                            <th key={index}>{head}</th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.state.teachers.map(teacher =>

                                            <tr key={teacher.ID}>

                                                <td id="myteachers_td">{teacher.ID}</td>
                                                <td id="myteachers_td">{teacher.UserName}</td>
                                                <td id="myteachers_td">{teacher.FirstName}</td>
                                                <td id="myteachers_td">{teacher.LastName}</td>


                                                <td> <button
                                                    className="btn-add"
                                                    onClick={() => this.getMoreTeacherInfo(teacher.ID)}>Details</button></td>

                                                {
                                                    buttons.map(btn => (
                                                        <td key={btn.name} id="teacher_cells_for_buttons"><button className={btn.class} onClick={() => btn.action(teacher.ID)}>{btn.name}</button></td>

                                                    ))
                                                }
                                            </tr>
                                        )
                                    }
                                </tbody>
                            </table>
                        </div>
                    }

                </div>
            </div >

        )
    }
};

export default Teacher;

