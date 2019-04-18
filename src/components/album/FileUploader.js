import React, { Component } from 'react';

class FileUploader extends Component {
    constructor(props) {
        super(props);
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

        }
    }



    handleSubmit = (event) => {
        event.preventDefault();


        const data = new FormData();
        data.append('file', this.fileInput.current.files[0]);

        if (this.fileInput.current.files.length === 1) {
            fetch('http://localhost:54164/project/students/upload-image/102', {
                method: 'POST',
                headers: new Headers({
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                    //Without!!!
                    // 'Content-Type': 'multipart/form-data'
                }),
                body: data
            })
                .then(response =>
                    response.json(),
                )

                .then(json =>
                    console.log('Success:', json, 'ImagePath:', json.ImagePath),
                    alert(`Selected file for upload:\n\
        \t file: ${this.fileInput.current.files[0].name}`))

                .catch(error => console.error('Error:', error));

            console.log(`Selected file for upload:\n\
        \t file: ${this.fileInput.current.files[0].name}`);

        }

        else {
            console.log(`No files selected for update.`);
            alert(`No files selected for update.`);
        }
    }

    render() {

        return (
            <form onSubmit={this.handleSubmit} encType="multipart/form-data" action="api/upload">
                <label>
                    upload file:
                         <input
                        type="file"
                        ref={this.fileInput}
                    />
                    <br />
                    <button type="submit">Submit</button>
                </label>
            </form>
        )

    }
}

export default FileUploader;
