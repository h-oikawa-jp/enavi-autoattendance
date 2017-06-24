# enavi-autoattendance
enavi auto attendance by nightmarejs

## Behavior
This will perform the following actions automatically.

1. Access to 'e-navi' login page.
1. Login as staff using `app.js`'s properties.
1. Click the "退勤" button (if available).
1. Click the "出勤" button (if available).
1. Print time of "出勤" & "退勤" fields to Console.


## Setup

### Install electron

```
# Install as a development dependency
$ npm install electron --save-dev
```
OR
```bash
# Install the `electron` command globally in your $PATH
$ npm install electron -g
```

### Install other package
`$ npm i`

### Set your login infomation

Modify below values in `app.js`

```javascript
...
const loginUrl = 'https://www.enavi-sv.net/ts-s-staff/Staff/login.aspx?ID=xxxxxxxxx';
const staffNo = 'no';
const password = 'password';
...
```

## Run
```
$ node app.js
```
