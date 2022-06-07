# Exam #12345: "Piano degli Studi"
## Student: s281221 Pepe Manuel 

## React Client Application Routes

- Route `/`: page content and purpose
- Route `/something/:param`: page content and purpose, param specification
- ...

## API Server

- POST `/api/login`
  - request parameters and request body content
  - response body content
- GET `/api/something`
  - request parameters
  - response body content
- POST `/api/something`
  - request parameters and request body content
  - response body content
- ...

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
