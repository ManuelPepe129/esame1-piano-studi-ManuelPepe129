# Exam #12345: "Piano degli Studi"
## Student: s281221 Pepe Manuel 

## React Client Application Routes

- Route `/`: home page with the list of available courses
- Route `/login`: login page
- ...

## API Server


- GET `/api/courses`
  - Description: Restituisce tutti i corsi messi a disposizione dall'università.
  - Request body: _None_
  - Response: `200 OK` (successo) o `500 Internal Server Error` (generic error).
  - Response body: Un array di oggetti, ogni oggetto descrive un corso.
    ```
    [{
        "code": "01TYMOV",
        "name": " Information systems security ",
        "credits": 6,
        "propedeuticcourse": ,
        "maxstudentsenrolled":
    }, {
        "code": "02LSEOV",
        "name": " Computer architectures ",
        "CFU": 10
    },
    ...
    ]
    ```
- DELETE `/api/sessions/current`
  - Description: Esegue il logout dell'utente attualmente connesso.
  - Request body: _None_
  - Response: `200 OK` (successo) o `401 Internal Server Error` (generic error).
  - Response body: _None_.
- POST `/api/sessions`
  - Description: Crea una nuova sessione.
  - Request body: _None_
  - Response: `200 OK` (successo) o `401 Internal Server Error` (generic error).
  - Response body: Dati dell'utente appena connesso.
    ```
    {
        "code": "01TYMOV",
        "name": " Information systems security ",
        "credits": 6,
        "propedeuticcourse": ,
        "maxstudentsenrolled":
    }
    ```
- GET `/api/sessions/current`
  - Description: Controlla che sia avvenuto il login.
  - Request body: _None_
  - Response: `200 OK` (successo) o `401 Internal Server Error` (generic error).
  - Response body: _None_

## Database Tables

- Table `users` - contains id name mail password salt
- Table `studyplans` - contains userid course
- Table `courses` - contains code name credits propedeuticcourse maxstudentsenrolled
- Table `incompatibilities` - contains coursea course b

## Main React Components

- `MainComponent` (in `CourseComponents.js`): acts as a wrapper for the main page, rendering the available university courses table
- `CoursesTable` (in `CourseComponents.js`): table rendering all the courses available, with the possibility to be expanded to show propedeutic and incompatible courses
- ...

(only _main_ components, minor ones may be skipped)

## Screenshot

![Screenshot](./img/screenshot.jpg)

## Users Credentials

- username, password (plus any other requested info)
- username, password (plus any other requested info)
