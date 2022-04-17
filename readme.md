## Home Health Django

This project is designed to function as an uber-esque web app where traveling therapists/clinicians
can book and manage home visits. The app provides both a patient and clinician based UI
with features that include live updates from google maps, chat messaging, appointment scheduling
and management, and viewing appointment history.

This project was originally inspired by Jason Parent's excellent Django Channels tutorial
seen [here](https://testdriven.io/courses/taxi-react/). While this project eventually diverged
significantly, credit is due to Jason if any code should appear similar.

## Tech Stack Utilized

- Django
- Docker
- Django Rest Framework
- Django Channels
- Python ascyncio
- React
- Material UI

## Goals and Personal Growth

My goal with this project was to demonstrate functional use of tools that i have less experience
with including Docker, Django channels and asyncio.

I did not attempt to build a comphrehensive web app, particularily if I've demonstrated competency
of certain skills within other projects.

## Running Locally

You'll need to place a google maps api key in a frontend .env file

```

docker-compose up


```

To run the initial migration

```

docker exec hh-server python manage.py migrate


```
