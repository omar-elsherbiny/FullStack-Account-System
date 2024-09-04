const aboutMeTextbox = document.getElementById('about-me-textbox');
const editButton = document.getElementById('profile-edit-button');

editButton.addEventListener('click', () => {

});


// editButton.addEventListener('click', async () => {
//     fetch(`/profile/${document.URL.split('/')[document.URL.split('/').length - 1]}/update-profile`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ niggers: true })
//     }).then(response => {
//         console.log(response.json());
//     }).catch(error => {
//         console.error(error);
//     });
// });