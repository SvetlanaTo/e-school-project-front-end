import React, { Component } from 'react';
import { STUDENTS, IMAGEPATH } from '../../service/api';
import Modal from '../common/Modal';
import '../../style/components/student/student.css';

class Student extends Component {
    constructor(props) {
        super(props);
        this.searchedGrade = React.createRef();
        this.searchedName = React.createRef();
        this.searchedUserName = React.createRef();

        this.state = {
            students: [],
            student: null,
            marks: [],
            openMoreInfo: false,
            url: IMAGEPATH,
            errorMessage: '',
            currentStudentId: null,

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
            this.fetchStudents();


        }
    }

    fetchStudents = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem("token")
            }
        };

        fetch(STUDENTS, requestOptions)
            .then(response => {
                if (response.ok) {
                    response.json().then(data =>
                        this.setState({ students: data.reverse() })
                    )
                } else {
                    response.text().then(message => alert(message))
                }
            })
            .catch(error => console.log(error));

    }

    getMoreStudentInfo = (id) => {
        console.log('student id', id);
        let student = this.state.students.find(s => s.ID === id);
        console.log("student:", student);

        this.setState({
            openMoreInfo: true,
            student: student,

        });
    }

    closeInfo = () => {
        this.setState({
            student: null,
            openMoreInfo: false,

        })
        console.log('openMoreInfo', this.state.openMoreInfo, "student: ", this.state.student);

    }


    updateStudent = (id) => {
        console.log('student id:', id);
        this.props.history.push("updateStudent/" + id);
    }

    getStudentIdPage = (id) => {
        console.log('student id:', id);
        this.props.history.push("studentProfile/" + id);
    }

    deleteStudent = (id) => {
        let student = this.state.students.find(s => s.ID === id);
        const r = window.confirm(`Are you sure you want to delete student ${student.FirstName} ${student.LastName}?`);
        if (r === true) {
            const path = STUDENTS + "/" + id;
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
                        this.setState({ students: this.state.students.filter(student => student.ID !== id) })
                    } else {
                        response.text().then(message => alert(message))
                    }
                })
                .catch(error => console.log(error))
        }
    }

    searchStudents = (event) => {
        console.log(`da li je ocitano? 
        ${this.searchedName.current.value}
        ${this.searchedGrade.current.value}
        ${this.searchedUserName.current.value} `);

        event.preventDefault();

        let originalStudentList = this.state.students;
        let newList = [];

        if (this.searchedName.current.value !== ""
            && this.searchedGrade.current.value === ""
            && this.searchedUserName.current.value === "") {
            console.log('if')
            newList = this.state.students.filter(f => {

                const fn = f.FirstName.toLowerCase();
                const ln = f.LastName.toLowerCase();
                const filter = this.searchedName.current.value.toLowerCase();
                return (fn.includes(filter) || ln.includes(filter));
            })
            this.setState({
                students: newList
            });
        }
        else if (this.searchedName.current.value === ""
            && this.searchedGrade.current.value !== ""
            && this.searchedUserName.current.value === "") {
            console.log('else if2')
            newList = this.state.students.filter(f => f.Form.Grade.toString() === this.searchedGrade.current.value)
            this.setState({
                students: newList
            });
        }
        else if (this.searchedName.current.value === ""
            && this.searchedGrade.current.value === ""
            && this.searchedUserName.current.value !== "") {
            console.log('else if3')
            newList = this.state.students.filter(f => {

                const lc = f.UserName.toLowerCase();
                const filter = this.searchedUserName.current.value.toLowerCase();
                return lc.includes(filter);

            })
            this.setState({
                students: newList
            });
        }

        else if (this.searchedName.current.value !== ""
            && this.searchedGrade.current.value !== ""
            && this.searchedUserName.current.value === "") {
            console.log('else if4')

            newList = this.state.students.filter(f => {

                const gr = f.Form.Grade.toString();
                const filter1 = this.searchedGrade.current.value;

                const fn = f.FirstName.toLowerCase();
                const ln = f.LastName.toLowerCase();
                const filter = this.searchedName.current.value.toLowerCase();
                return ((fn.includes(filter) || ln.includes(filter)) && gr === filter1);

            })
            this.setState({
                students: newList
            });
        }
        else if (this.searchedName.current.value === ""
            && this.searchedGrade.current.value !== ""
            && this.searchedUserName.current.value !== "") {
            console.log('else if5')

            newList = this.state.students.filter(f => {

                const gr = f.Form.Grade.toString();
                const filter1 = this.searchedGrade.current.value;

                const wc = f.UserName.toLowerCase();
                const filter2 = this.searchedUserName.current.value.toLowerCase();

                return (gr.includes(filter1) && wc.includes(filter2));
            })

            this.setState({
                students: newList
            });
        }
        else if (this.searchedName.current.value !== ""
            && this.searchedGrade.current.value === ""
            && this.searchedUserName.current.value !== "") {
            console.log('else if6')

            newList = this.state.students.filter(f => {

                const fn = f.FirstName.toLowerCase();
                const ln = f.LastName.toLowerCase();
                const filter = this.searchedName.current.value.toLowerCase();


                const wc = f.UserName.toLowerCase();
                const filter2 = this.searchedUserName.current.value.toLowerCase();

                return ((fn.includes(filter) || ln.includes(filter)) && wc.includes(filter2));
            })
            this.setState({
                students: newList
            });
        }
        else if (this.searchedName.current.value !== ""
            && this.searchedGrade.current.value !== ""
            && this.searchedUserName.current.value !== "") {
            console.log('else if7')

            newList = this.state.students.filter(f => {

                const gr = f.Form.Grade.toString();
                const filter1 = this.searchedGrade.current.value;

                const fn = f.FirstName.toLowerCase();
                const ln = f.LastName.toLowerCase();
                const filter2 = this.searchedName.current.value.toLowerCase();


                const wc = f.UserName.toLowerCase();
                const filter3 = this.searchedUserName.current.value.toLowerCase();

                return ((fn.includes(filter2) || ln.includes(filter2)) && gr.includes(filter1) && wc.includes(filter3));
            })
            this.setState({
                students: newList
            });
        }
        else {
            console.log('else')
            newList = originalStudentList;
            this.setState({
                students: newList
            });
        }
    }

    resetSearch = () => {
        this.fetchStudents();

        this.searchedGrade.current.value = '';
        this.searchedName.current.value = "";
        this.searchedUserName.current.value = "";
    }

    render() {


        const heading = ["Id", "UserName", "FirstName", "LastName", "", "", ""];
        const buttons = [
            // 
            { name: "Details", action: this.getMoreStudentInfo, class: "btn-add" },
            { name: "Update", action: this.getStudentIdPage, class: "btn-update" },
            { name: "Delete", action: this.deleteStudent, class: "formTable_btn-delete" },];

        return (
            <div className="my_student_page">

                <div className='my_student_page_NoaddLinks'>
                    {/* background img */}
                </div>

                <h2 className="my_student_h2"> {this.state.students.length} students </h2>

                <div className="my_student_content">

                    <Modal show={this.state.openMoreInfo} onClose={this.closeInfo}>
                        {this.state.student &&
                            <ul>
                                <li>Id: {this.state.student.ID}</li>
                                <li>UserName: {this.state.student.UserName}</li>
                                <li>FirstName: {this.state.student.FirstName}</li>
                                <li>LastName: {this.state.student.LastName}</li>
                                <li>Email: {this.state.student.Email}</li>
                                <li>PhoneNumber: {this.state.student.PhoneNumber}</li>
                                <li>DayOfBirth: {this.state.student.DayOfBirth}</li>
                                <li>Jmbg: {this.state.student.Jmbg}</li>
                                <li>IsActive: {this.state.student.IsActive.toString()}</li>
                                <li>EmailConfirmed: {this.state.student.EmailConfirmed.toString()}</li>
                                <li>PhoneNumberConfirmed: {this.state.student.PhoneNumberConfirmed.toString()}</li>
                            </ul>
                        }
                    </Modal>

                    {
                        this.state.students &&

                        <div>
                            <form onSubmit={this.searchStudents} className='mystudent_search_header'>

                                <label id="mystudent_search_input3">Search students </label>

                                <input
                                    type="text"
                                    id="mystudent_search_input5"
                                    placeholder="by username"
                                    ref={this.searchedUserName}
                                />

                                <input
                                    type="number"
                                    id="mysubject_search_input4"
                                    placeholder="by grade"
                                    ref={this.searchedGrade}
                                />

                                <input
                                    type="text"
                                    id="mysubject_search_input1"
                                    placeholder="by name"
                                    ref={this.searchedName}
                                />
                                <input type="submit" value="Find" id="mystudent_search_button1" />
                                <button onClick={this.resetSearch} className="btn-cancel"> RESET </button>
                            </form>
                            <table id="mystudent_table_id">
                                <thead id="mystudent_t_header">
                                    <tr>
                                        {heading.map((head, index) =>
                                            <th key={index}>{head}</th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody>


                                    {this.state.students.map(student =>

                                        <tr key={student.ID}>
                                            <td id="mystudents_td">{student.ID}</td>
                                            <td id="mystudents_td">{student.UserName}</td>
                                            <td id="mystudents_td">{student.FirstName}</td>
                                            <td id="mystudents_td">{student.LastName} </td>

                                            {
                                                buttons.map(btn => (
                                                    <td key={btn.name} id="cells_for_buttons_student"><button className={btn.class} onClick={() => btn.action(student.ID)}>{btn.name}</button></td>
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
            </div>

        )
    }
};

export default Student;






