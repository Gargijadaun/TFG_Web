const fs = require('fs');
const path = require('path');

// Path to users.json file
const usersFile = path.join(__dirname, 'users.json');

// Load the users data
let users = {};
if (fs.existsSync(usersFile)) {
    users = JSON.parse(fs.readFileSync(usersFile, 'utf8'));
}

// Check for the email to delete
const emailToDelete = process.argv[2];  // Get email from command line argument

if (!emailToDelete) {
    console.log('Please provide an email to delete');
    process.exit(1);
}

if (!users[emailToDelete]) {
    console.log('User not found!');
    process.exit(1);
}

// Delete the user from the users object
delete users[emailToDelete];

// Save the updated users data back to the file
fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));

console.log(`User with email ${emailToDelete} deleted successfully`);
