# enavi-autoattendance
enavi auto attendance by nightmarejs

## Behavior
This will provide the following actions.

1. Access to 'e-navi' login page.
1. Login as staff using properties in `config/*.EXT`. (Supported file types depend on '[node-config](https://github.com/lorenwest/node-config)')
1. Execute the tasks(#1) given to the commandline arguments sequentially.

### Selectable Tasks (#1)

|Task Name|Description|
|---|---|
|'workStart'|Goto top page, and Click the "出勤" button (if available).|
|'workEnd'|Goto top page, and Click the "退勤" button (if available).|
|'approvalRequest'|Click the "承認依頼" button (if available), and Send 'OK' to confirm of next page. (If "enavi.approvalRequest.manual" config is true, nightmare will wait for 'OK' button clicked by user.)|
|'getTimes'|Get the times of "出勤/退勤" elements on the top page, and print them to console.|
|'logout'|Click the "ログアウト" button and close window.|


## Setup

### Install Nodejs
https://nodejs.org/

### Install npm packages
At project root:
`$ npm i`

### Set your login infomation
Create your setting file: `config/{your-env-name}.yml` (or Modify `default.yml`),

 and write below values with your account.

```yaml
enavi:
  loginUrl: "https://www.enavi-sv.net/ts-s-staff/Staff/login.aspx?ID=XXXXXXXXX"
  staffNo: "no"
  password: "password"
```

## Run

```bash
$ npm run build     # (need only once)
$ node dist/enavi {Tasks}... [options...]
```
OR
```shell
$ npm run enavi -- {Tasks}... [options...]
```

e.g.)
```
$ npm run enavi -- workEnd approvalRequest --env your-env-name --show
```

### Command Options Help
`$ npm run enavi -- -h`
```
> node dist/enavi "-h"
 
 
   Usage: enavi tasks... [options]  =>   tasks = [ workStart, workEnd, approvalRequest, getTimes, logout ] (separate with space)
 
   Options:
 
     -h, --help       output usage information
     -V, --version    output the version number
     -s, --show       Flag of Showing GUI window
     -e, --env <env>  An Environment String (Load config file from [config/{env}.ext])
```
