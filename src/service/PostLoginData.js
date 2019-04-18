export function PostLoginData(type, un, pass) {
    let BaseURL = 'http://localhost:54164/project/';

    const formData = new URLSearchParams();
    formData.append('grant_type', 'password');
    formData.append('username', un);
    formData.append('password', pass);

    console.log(formData);

    return new Promise((resolve, reject) => {

        fetch(BaseURL + type, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body:
                formData
        })
            .then((response) => response.json())
            .then((res) => {
                resolve(res);
                console.log(res);
            })
            .catch((error) => {
                reject(error);
            });


    });
}