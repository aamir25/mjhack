// TEAM DATA
const data = {
    isCheckedIn: false,
    isVerified: false,
    isError: false,
    error: null
};

var name = document.getElementById('name');
var college = document.getElementById('college');
var email = document.getElementById('email');
var noOfMembers = document.getElementById('noOfMembers');

var teamNames = document.getElementById('teamNames');
var teamPhones = document.getElementById('teamPhones');

var registerBtn = document.getElementById('registerBtn');

var spinner = '<span class="spinner"></span>';

//DEFINING EVENTS
noOfMembers.addEventListener('keyup', displayMembersForm);
registerBtn.addEventListener('click', submitForm);

//EVENT LISTENERS
function displayMembersForm(event) {
    if (event.target.value < 3 || event.target.value > 4) {
        document.getElementById('membersError').innerHTML = 'Maximum 4 members per team.';
        return;
    }

    document.getElementById('membersError').innerHTML = '';
    data.noOfMembers = event.target.value;
    emptyNode(teamNames);
    emptyNode(teamPhones);
    createFormElements(event.target.value);
}

function submitForm(event) {
    event.preventDefault();
    
    // Validating Form
    if (!validate()) return; 

    data.teamName = document.getElementById('name').value;
    data.college = college.value;
    data.email = email.value;
    data.date = new Date(Date.now()).toString();

    console.log(data);
    var database = firebase.database();

    // Loading animation
    $('.button').toggleClass('loading').html(spinner);
    $('#registirationSuccess').attr("disabled", true);

    dataRef = database.ref('participants/').push(data);

    //Saving to database
    dataRef
    .then((response) => {
        console.log(response);
        data.isCheckedIn = false;
        data.isError = false;
        data.error = null;
        // Restore $('.button')
        $('.button').toggleClass('loading').html("register");
        // Success page
        window.location.href = './success.html?s=true';
    })
    .catch((error) => {
        console.log(error);
        data.isCheckedIn = false;
        data.isError = true;
        data.error = error;
        // Restore button
        $('.button').toggleClass('loading').html("register");
        // Error modal
        $('#registirationFail').modal('show');
    });
}
//EVENT LISTENERS END

//HELPERS
function emptyNode(node) {
    let fc = node.firstChild;

    while( fc ) {
        node.removeChild( fc );
        fc = node.firstChild;
    }
}

function validate () {
    let flag = true;
    let atpos = email.value.indexOf("@");
    let dotpos = email.value.lastIndexOf(".");
    let noOfMembers = document.getElementById('noOfMembers').value;

    if (document.getElementById('name').value === "") {
        document.getElementById('nameError').innerHTML = "Team name is required!";
        flag = false;
    }
    if (college.value === "") {
        document.getElementById('collegeError').innerHTML = "College name is required!";
        flag = false;
    }
    if (atpos < 1 || dotpos < atpos+2 || dotpos+2 >= email.length) {
        document.getElementById('emailError').innerHTML = "Enter a valid email!";
        flag = false;
    }
    if (email.value === "") {
        document.getElementById('emailError').innerHTML = "Email is required!";
        flag = false;
    }
    if (document.getElementById('noOfMembers').value < 3 || document.getElementById('noOfMembers').value > 4) {
        document.getElementById('membersError').innerHTML = "Number of members is required!";
        flag = false;
    }
    if (document.getElementById('noOfMembers').value === "") {
        document.getElementById('membersError').innerHTML = "Number of members is required!";
        flag = false;
    }

    for(i=0; i<noOfMembers; i++) {
        if (document.getElementById('member' + i).value === "") {
            document.getElementById('member' + i + 'Error').innerHTML = "Member" + (i+1) + " name is required!";
            flag = false;
        }
        else {
            document.getElementById('member' + i + 'Error').innerHTML = "";
        }
        if (document.getElementById('member' + i + 'Phone').value === "") {
            document.getElementById('member' + i + 'PhoneError').innerHTML = "Member" + (i+1) + " phone is required!";
            flag = false;
        }
        else {
            document.getElementById('member' + i + 'PhoneError').innerHTML = "";
        }
        if (document.getElementById('member' + i + 'Phone').value.length !== 10 ||  !(/^\d+$/.test(document.getElementById('member' + i + 'Phone').value))) {
            document.getElementById('member' + i + 'PhoneError').innerHTML = "Enter a valid phone number!";
            flag = false;
        }
        else {
            document.getElementById('member' + i + 'PhoneError').innerHTML = "";
        }
    }

    return flag;
}

function createFormElements(number) {
    //Names
    for (i=0;i<number;i++) {
        // Form group
        var formGroup = document.createElement('div');
        formGroup.setAttribute('class', 'form-group');

        // Create an <input> element, set its type and name attributes
        var input = document.createElement("input");
        input.setAttribute('class', 'form-control');
        input.setAttribute('id', 'member' + i);
        input.setAttribute('type', 'text');
        input.setAttribute('placeholder', 'member' + (i+1) + ' name *');
        input.setAttribute('required', '');
        input.setAttribute('data-validation-required-message', 'Please enter member' + (i+1) + ' name.');

        // <p> for errors
        var pError = document.createElement('p');
        pError.setAttribute('class', 'help-block text-danger');
        pError.setAttribute('id', 'member' + i + 'Error');

        // appending to div
        formGroup.appendChild(input);
        formGroup.appendChild(pError);
        
        // appending to teamNamesDiv
        teamNames.appendChild(formGroup);

        // adding event listeners to inputs
        document.getElementById('member' + i).addEventListener('keyup', recordData);
        document.getElementById('member' + i).addEventListener('keyup', validate);
    }

    //Phone Numbers
    for (i=0;i<number;i++) {
        // Form group
        var formGroup = document.createElement('div');
        formGroup.setAttribute('class', 'form-group');

        // Create an <input> element, set its type and name attributes
        var input = document.createElement("input");
        input.setAttribute('class', 'form-control');
        input.setAttribute('id', 'member' + i + 'Phone');
        input.setAttribute('type', 'tel');
        input.setAttribute('placeholder', 'member' + (i+1) + ' Phone *');
        input.setAttribute('required', '');
        input.setAttribute('data-validation-required-message', 'Please enter member' + (i+1) + ' phone.');

        // <p> for errors
        var pError = document.createElement('p');
        pError.setAttribute('class', 'help-block text-danger');
        pError.setAttribute('id', 'member' + i + 'PhoneError');

        // appending to div
        formGroup.appendChild(input);
        formGroup.appendChild(pError);

        //appending to teamPhoneDiv
        teamPhones.appendChild(formGroup);

        // adding event listeners to inputs
        document.getElementById('member' + i + 'Phone').addEventListener('keyup', recordData);
        document.getElementById('member' + i + 'Phone').addEventListener('keyup', validate);
    }
}

function recordData (event) {
    data[event.target.id] = event.target.value;
}
// HELPERS END