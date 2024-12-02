# Supplementary Course Analyzer

This App will be used to help professors at Sac State create PAL classes for the students

![Sac State Logo](https://github.com/Jdcruz831/Supplementary-Course-Analyzer/blob/main/src/img/sacstatelogo.png)

![Scripters Logo](https://github.com/kdiep4/Supplementary-Course-Analyzer/blob/main/src/img/logo.png)

## Table Of Contents

[Background](#background)
[Technology](#technology)
[Testing](#testing)
[Deployment](#deployment)
[Developer Instructions](#developer-instructions)
[Contributors](#contributors)
[Installation](#installation)
[Timeline](#timeline)

## Background

The professors at Sacramento State have been struggling to generate schedules for PAL courses. The challenge they face is selecting a suitable time for each PAL course to ensure it's accessible to the students who need it. The goal of the Sac State PAL Course Analyzer is to assist the PAL program in its class scheduling process. Our project aggregates all courses that have an associated PAL class, examines the scheduled times for these courses, and identifies which students are enrolled in which courses to select the optimal time for a PAL course.

Peer Assisted Learning (PAL) offers 1-unit courses available for students enrolled in gateway science and math courses. Students who have already taken a course come and help mentor/tutor other students who are currently taking the course. It gives an opportunity for Sacramento State students to give back and help their peers in their pursuit of education.

## Technology

-Tech Stack: React, Node.js, MaterialsUI, Firebase,\
-Status: Completed Project

## Testing

-Install Python going to their official site [here](https://www.python.org/downloads/) and make sure to check the option "Add Python to Path" to make Python accessible.   \
-Ensure python is installed by checking in command prompt on your machine using the command python -V. Ensure python package installer pip is installed by running in command prompt pip -v. These will check that python and its package installer are finable on your machine and up to date.\
-In VS Code terminal run pip install selenium to download selenium packages\
-Open up the project and go to the tests folder within the project tree. Select a test and run.

## Deployment
For deployment, we used Varcel, a free site used for hosting React projects. The link to the official site is: https://supplementary-course-analyzer-two.vercel.app/
Varcel directly pulls from the git hub, so when the GitHub is updated or changed, the page will dynamically change with it. 

## Developer Instructions
This guide is meant for a windows machine but with a few tweaks, this can be run on a Linux or Mac Machine.
\


Download VS Code from the official site [here](https://code.visualstudio.com/) 

Access the github repository branch [here](https://github.com/Jdcruz831/Supplementary-Course-Analyzer).

From the main VS Code window, click clone github repository. Enter in the URL from the github repository branch hyperlink into the search bar on top and clone the repository to the desired location on your machine. Open up the project in VS Code.

 In the terminal, type and enter npm install, npm install firebase, and then npm run to run the project as a localhost. From there we can work on the project. 

## Prototyping Images
ERD Diagram 

![erd](https://github.com/kdiep4/Supplementary-Course-Analyzer/blob/main/src/img/erd.png)

Prototype Home Page

![proto_home_page](https://github.com/kdiep4/Supplementary-Course-Analyzer/blob/main/src/img/proto_home_page.JPG)

Prototype Login Page

![Proto_Login_Page](https://github.com/kdiep4/Supplementary-Course-Analyzer/blob/main/src/img/Proto_Login_Page.png)

## Final Pages
Home Page\
The home page allows users to navigate to everything our application offers. There are links to the main Sacramento website, the search page, the Student Course Analyzer Page, and the Student Availability Page. The user can also use the hamburger icon to navigate to these pages as well as the user list if they have admin privileges to see who is on the site. \
![home_page](https://github.com/kdiep4/Supplementary-Course-Analyzer/blob/main/src/img/final_home.png)

Login Page\
The login page allows the user to register for an account or to login using their credentials.\
![login](https://github.com/kdiep4/Supplementary-Course-Analyzer/blob/main/src/img/Final_Login_Page.png)

Registration Page\
The registration page allows the user to choose a display name and register for the application using their email and selected password.\
![register](https://github.com/kdiep4/Supplementary-Course-Analyzer/blob/main/src/img/final_registration.png)

Student Course Analyzer Page\
This page allows the user to see the best time slots for the courses that are listed on the site. This is the main page for the product and shows the best times for the client to host their PAL sessions.\
![sca_final](https://github.com/kdiep4/Supplementary-Course-Analyzer/blob/main/src/img/sca_final.png)

User List Page\
Application users can be viewed and deleted on the user list page. This is an administrative only page, so elevated privileges are required (users must be logged in to view the page).\
![User_List](https://github.com/kdiep4/Supplementary-Course-Analyzer/blob/main/src/img/user_list.png)

Student Availability Page\
The Student Availability Page allows users to add courses to the site manually if they are not up on the official Sac State website or if there are more courses to add. \
![Student_Availability](https://github.com/kdiep4/Supplementary-Course-Analyzer/blob/main/src/img/student_availability.png)

Student Search Page\
Users can search courses by name as well as filter courses by multiple fields; start time, end time, section, and availability. In addition to filtering courses, they can be viewed via a calendar view that shows the days and times in which courses are scheduled.\
![Student_Search](https://github.com/kdiep4/Supplementary-Course-Analyzer/blob/main/src/img/student_search.png)

Manage Users Page\
Users can use the manage users page to change their email or password. It does require the use of the old email and old password to change to a new email or password. Email verification is required once the password or email is changed.\
![manage_users](https://github.com/kdiep4/Supplementary-Course-Analyzer/blob/main/src/img/manage_users.png)

Creators Page\
These are the creators of the app! Thank you for choosing us!\
![creators](https://github.com/kdiep4/Supplementary-Course-Analyzer/blob/main/src/img/creators.png)



## Contributors & Contact

Shajaat Ali\
shajaatali@csus.edu\
Raj Pannu\
rajdeeppannu@csus.edu\
Shaquan Carolina\
scarolina@csus.edu\
Chi Andrus\
chidoandrus@csus.edu\
Kyle Diep\
kylediep@csus.edu\
JD Cruz\
Jacob.cruz.9353@gmail.com \
David Chatla\
davidchatla@csus.edu

## Installation

npm install\
npm start

## Timeline

![jiratimeline](https://github.com/kdiep4/Supplementary-Course-Analyzer/blob/main/src/img/final_timeline.png)
