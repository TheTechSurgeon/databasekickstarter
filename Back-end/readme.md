Robert Elias Branch

# `Backend on Heroku API`
https://devqueapi.herokuapp.com/


# `Dev Desk Backend API` 


# `Auth Login`

- Register and Log in user
- Ability to determine user as admin(helper) or student using string "student" or "helper"
- Get list of users and user by id

| HTTP | Path               | Desc                                   | Data|
|-|-|-|-|
| POST | /auth/register | Registers new user. | Expects `{"username":", "password", "email", "role":"}`|
| POST | /auth/login    | Logs in a user.   |  Expects `{"username":"", "password":""}`|

# `Users Table`

- Update users by id
- Delete users by id
- Role is either "student" or "helper"
- Assign tickets only helpers can assign tickets
- Reassign tickets to the que
- Resolve tickets
- Delete tickets by id

| HTTP | Path               | Desc                                   | Data|
|-|-|-|-|
| GET | /users            | Gets all users     |  Output `{"id", "username":"", "email", "password", "role"}`|
| GET | /users/ticket      | Gets user by ID    | Ouput `{"id", "title":"", "description", "tried", "category", "solution", "assigned", "resolved"}`|
| POST| /users/ticket/:id/assign | Adds ticket to a user by id. only helpers can assign tickets  |  Expects `{"id"} in the body using json and ticket in :id`|
| PUT | /users/tickets/:id/reassign    | Returns ticket back to the queue.   |   Expects `{no user information on body, just techid "id" and ticket 7 -> :id/reassign}`|
| POST| /users/ticket/:id/resolved | resolves ticket to a user by id. only helpers can assign/resolve tickets  |  Expects `{"solution": "some solution" }`
| DELETE | /users/tickets/:id | Deletes a user ticket by id.   |  Expects `{no user information on body, just "id"}`|

# `Tickets` Table

- Add a new ticket
- Obtain list of tickets and ticket by id
- Get list of open and closed tickets
- Delete ticket by id only students can delete ticket

| HTTP | Path               | Desc                                   | Data|
|-|-|-|-|
| GET | /tickets/ | Lists all tickets.   |  Output `{"id", "userid", "title", "description", "completed" }`|
| POST | /tickets/      | Adds a new ticket    |Ouput `{"title":"", "description", "tried", "category"}`|
| GET | /tickets/open      | Lists open tickets    |Ouput `{"id", "title":"", "description", "tried", "category", "solution", "assigned", "resolved"}`|
| GET | /tickets/closed      | Lists closed tickets    |Ouput `{"title":"", "description", "tried", "category"}`|
| GET | /tickets/:id    | Gets a ticket by id.   |  Expects `{"id", "title":"", "description", "tried", "category", "solution", "assigned", "resolved"}`|
| DELETE | /tickets/:id | Deletes a ticket by id.   |  Expects `{"id" no user information on body}`|