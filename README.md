

# `Backend on Heroku API`
https://kickstarterdb.herokuapp.com/


# `Dev Desk Backend API` 


# `Auth Login`

- Register and Log in user
- Ability to determine user as admin(helper) or student using string "student" or "helper"
- Get list of users and user by id

| HTTP | Path               | Desc                                   | Data|
|-|-|-|-|
| POST | /auth/register | Registers new user. | Expects `{"username":", "password", "email"}`|
| POST | /auth/login    | Logs in a user.   |  Expects `{"username":"", "password":""}`|

# `Users Table`

- Update users by id
- Delete users by id


| HTTP | Path               | Desc                                   | Data|
|-|-|-|-|


# `Campaigns`

| HTTP | Path               | Desc                                   | Data|
|-|-|-|-|