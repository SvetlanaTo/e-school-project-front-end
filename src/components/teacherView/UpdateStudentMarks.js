import React, { Component } from 'react';
import '../../style/components/teacherView/updateMarksTeacherView.css';
import { MARKS } from "../../service/api";

class UpdateStudentMarks extends Component {
    constructor(props) {
        super(props);
        this.searchedMarkDate = React.createRef();
        this.searchedMarkValue = React.createRef();
        this.state = {
            marks: [],
            filteredMarks: [],
            studID: '',
            ftsID: 0,
            mark: [],
            markForUpdate: [],
            MarkValue: 0,
            openInlineInput: false,
            TeacherID: '',
            markID: 0,
            errorMessage: '',
            searchedByDateExtraTitle: false,
            searchedByMarkValueExtraTitle: false,
            disable: false,
            error: null,
        };

        this.updateMarkInline = this.updateMarkInline.bind();
    }

    componentDidMount() {
        if (localStorage.getItem('token') === null) {
            this.props.history.push('/login');
        }
        else if (localStorage.getItem('role') !== 'teacher') {
            this.props.history.push('/no-auth');
        }
        else {
            const path = MARKS + "/fts/" + this.props.match.params.ftsId + "/by-student/" + this.props.match.params.studentId;
            const sId = this.props.match.params.studentId;
            const ftsId = this.props.match.params.ftsId;
            console.log(path);
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
                    this.setState({
                        marks: data,
                        filteredMarks: data,
                        studID: sId,
                        ftsID: ftsId,
                    })
                    console.log('marks', this.state.marks)

                    let mark = this.state.marks.find(mark => mark.StudentID === this.state.studID);
                    console.log('student', mark);
                    console.log('filtered', this.state.filteredMarks)

                    this.setState(
                        { mark: mark }
                    );
                });


        }

    }

    updateMarkInline = (id) => {
        let mark = this.state.marks.find(mark => mark.ID === id);
        this.setState({
            openInlineInput: true,
            markID: id,
            markForUpdate: mark,
            mark: mark,
            MarkValue: mark.MarkValue,
            TeacherID: mark.TeacherID
        });
    }

    closeInlineInput = () => {
        this.setState({
            openInlineInput: false,
            markID: '',
            note: ''
        })
    }

    handleMarkChange = (event) => {
        const target = event.target;
        const name = target.name;

        if (target.value === '') {
            this.setState({ disable: true, errorMessage: '' })
        }
        else if (target.value !== '' && (target.value < 1 || target.value > 5)) {
            this.setState({ errorMessage: "Mark must be number between 1 and 5.", disable: true })
        }
        else {
            this.setState({
                errorMessage: "",
                disable: false,
                mark: { ...this.state.mark, [name]: target.value }
            })
        }

    }

    putMarkInline = (event) => {
        event.preventDefault();
        const sId = this.state.studId;
        const markValue = this.state.mark.MarkValue;

        const r = window.confirm(`Are you sure you want to give 
        mark: ${markValue} to
        student: ${this.state.mark.Student}?`);
        if (r === true) {
            const requestOptions = {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer  ' + localStorage.getItem("token")
                },

            };

            const path = MARKS + "/" + this.state.markID + "/by-teacher/" + this.state.TeacherID + '?value=' + this.state.mark.MarkValue;
            fetch(path, requestOptions)
                .then(response => {
                    if (response.ok) {
                        const r = window.confirm(`You have successfully updated mark to value ${this.state.mark.MarkValue}! 
                        Do you wish to 
                        update any other mark for student: ${this.state.mark.Student}?`);
                        if (r === true) {
                            response.json().then(data => {
                                this.setState({
                                    errorMessage: '',
                                    openInlineInput: false,

                                })
                                this.props.history.push("/form-to-teacher-subject/" + this.state.ftsID + "/student/" + this.state.mark.StudentID);
                                window.location.reload()
                            });
                        }
                        else {
                            response.json().then(data => {
                                this.setState({
                                    errorMessage: '',
                                    openInlineInput: false,
                                })

                                this.props.history.push("/form-to-teacher-subject/" + this.state.ftsID);

                            });
                        }
                    } else {
                        response.text().then(message => this.setState({ errorMessage: message }))
                    }
                })
                .catch(error => console.log(error))

        }
    };

    deleteMark = (id) => {

        let mark = this.state.marks.find(m => m.ID === id);
        const r = window.confirm(`Are you sure you want to delete 
        mark value ${mark.MarkValue} 
        created ${mark.Created}
        for student ${mark.Student}?`);
        if (r === true) {

            let isLastMark = this.state.marks.length === 1 ? true : false;
            console.log(isLastMark);

            const path = MARKS + "/" + id + "/by-teacher/" + mark.TeacherID;
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
                        if (isLastMark === true) {
                            alert(`
                            Success! 
                            There are no more marks to be updated. `);
                            this.props.history.push("/form-to-teacher-subject/" + this.state.ftsID);
                        }
                        else {
                            alert("Success!");
                            this.setState({ marks: this.state.marks.filter(mark => mark.ID !== id) })
                        }

                    } else {
                        response.text().then(message => alert(message))
                    }
                })
                .catch(error => console.log(error))
        }
    }


    searchMarksByDate = (event) => {

        event.preventDefault();

        let originalMarksList = this.state.marks;
        let newList = [];

        if (this.searchedMarkDate.current.value !== "" && this.searchedMarkValue.current.value === "") {
            newList = this.state.marks.filter(mark => mark.Created === this.searchedMarkDate.current.value)
            this.setState({
                marks: newList,
                searchedByDateExtraTitle: true,
                searchedByMarkValueExtraTitle: false,
            });
        }
        else if (this.searchedMarkDate.current.value === "" && this.searchedMarkValue.current.value !== "") {
            newList = this.state.marks.filter(mark => mark.MarkValue.toString() === this.searchedMarkValue.current.value)
            this.setState({
                marks: newList,
                searchedByDateExtraTitle: false,
                searchedByMarkValueExtraTitle: true,
            });
        }
        else if (this.searchedMarkDate.current.value !== "" && this.searchedMarkValue.current.value !== "") {
            newList = this.state.marks.filter(mark => mark.MarkValue.toString() === this.searchedMarkValue.current.value
                && mark.Created === this.searchedMarkDate.current.value)
            this.setState({
                marks: newList,
                searchedByDateExtraTitle: true,
                searchedByMarkValueExtraTitle: true,
            });
        }
        else {
            newList = originalMarksList;
            this.setState({
                marks: newList,
                searchedByDateExtraTitle: false,
                searchedByMarkValueExtraTitle: false,
            });
        }
    }

    resetSearch() {
        window.location.reload()

    }


    render() {
        const heading = ["Mark", "Semester", "Created", "", ""];
        const buttons = [
            { name: "Update", action: this.updateMarkInline, class: "btn-update" },
            { name: "Delete", action: this.deleteMark, class: "btn-delete" }
        ];

        return (
            <div className="my_updatemarks_body">
                <div className='umnl'></div>
                <div className='h3_myupdatemarks_div'>
                    <h3 id="h3_myupdatemarks_body">{this.state.mark.Student} has {this.state.marks.length} marks in <br />
                        {this.state.mark.SubjectName}</h3>

                    {this.state.searchedByDateExtraTitle &&
                        <h3 id="h3_myupdatemarks_body"> created on {this.searchedMarkDate.current.value}</h3>
                    }

                    {this.state.searchedByMarkValueExtraTitle &&
                        <h3 id="h3_myupdatemarks_body"> with value {this.searchedMarkValue.current.value}</h3>
                    }
                </div>

                < div className='my_updatemarks_wrapper' >
                    {
                        this.state.marks && this.state.marksDTO !== null &&
                        <div>

                            <form onSubmit={this.searchMarksByDate} className='myupdatemarks_search_header'>
                                <label id="myum_search_input3">Search marks </label>
                                <input
                                    // name="MarkValue"
                                    type="number"
                                    id="myum_search_input5"
                                    placeholder="by value"
                                    ref={this.searchedMarkValue}
                                // onChange={this.handleInputChange}
                                />

                                <input
                                    name="Created"
                                    type="text"
                                    id="myum_search_input4"
                                    placeholder="mm/dd/yyyy"
                                    ref={this.searchedMarkDate}
                                // onChange={this.handleInputChange}
                                />
                                <input type="submit" value="Find" id="myum_search_button1" />
                                <button onClick={() => this.resetSearch()} className="btn-cancel"> RESET </button>
                            </form>

                            <table id="myum_table_id">
                                <thead id="myum_t_header">
                                    <tr>
                                        {heading.map((head, index) =>
                                            <th key={index}>{head}</th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody>

                                    {
                                        this.state.marks.map(mark =>
                                            <tr key={mark.ID}>
                                                {this.state.openInlineInput && mark.ID === this.state.markID ?
                                                    <td>
                                                        <form onSubmit={this.putMarkInline} className="inline-mark-update">

                                                            <input
                                                                type="number"
                                                                name="MarkValue"
                                                                //placeholder="Change subject grade"
                                                                value={this.state.mark.MarkValue}
                                                                onChange={this.handleMarkChange}
                                                            />

                                                            <input type="submit" value="CHANGE" className="btn-add" id="need-margin" disabled={this.state.disable} />
                                                            <button onClick={this.closeInlineInput} className="btn-cancel" id="need-margin">Cancel</button>
                                                            <br />
                                                            <label className="error">{this.state.errorMessage}</label>

                                                        </form>
                                                    </td>
                                                    :
                                                    <td>{mark.MarkValue}</td>
                                                }
                                                <td>{mark.Semester}</td>
                                                <td>{mark.Created}</td>


                                                {
                                                    buttons.map(btn => (
                                                        <td key={btn.name} id="cells_for_buttons"><button className={btn.class} onClick={() => btn.action(mark.ID)}>{btn.name}</button></td>
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

export default UpdateStudentMarks;