# Capstone - A Kentucky Child Support Obligation Estimator

https://amandaintransit.github.io/Capstone/


Overview:

A Code: You capstone project utilizing extesnive DOM manipulation and Javascript while also highlighting HTML and CSS.

Project Overview:

The statutory scheme for determining child support obligations under Kentucky law is written in an overly complex manner that is diffucult for most lay persons to understand even if they are able to identify the various statutes that make up the statutory scheme. Even for professionals or caseworkers who may performm the task frequently, individual analysis can be cumbersome and timeconsuming.  This project accepts fairly straightforward user input, and progressively ferrets out the relevant information and applies the appropriate rules and calculations behind the scenes.  Although a search at any given time might reveal a similar program or two, I have found them to have confusingly jumbled layouts and often lagging months behind when changes are made to the laws affecting the determination.  


## Project Organization


| Page | Description |
|------|-------------|
| **Landing Page** | The landing page introduces the program with a description of its purpose and also contains a disclaimer in the footer.  It obtains the basic information of the user, the other custodian and the number of children so that questions on the next page can be personalized.  |
| **Income Questions** | This page asks the user questions with subsequent questions based upon the user's input to the initial questions.  It then fetches data from a google sheets API that contains the base child support obligation based upon the parties' income and number of children, converted to json, and then searches the row(number of children) and column (combined income) to find the intersecting cell (base obligation amount).  Other factors are considered based upon the user input to assess the percentage of each custodian's obligation, awards credit for timesharing and displays amount of obligation and whether same is owed by the user or to the user.  |
| **Worksheet** | Presents the data obtained and the results in a visually appealing manner that is similar to a formatted worksheet commonwly used by attorneys and courts, so it appears familiar and easy to understand. CSS is the focus of this page. |


## Capstone Requirements Fulfilled


| Requirement | Implementation |
|-------------|----------------|
| **Integrate an API** | • After creating a googlesheet that reflects that child support guidelines enumerated in the statute, enabled API, obtained API key but restricted it to this page referrer so that it could be displayed in javascript without being abused by others <br>•  |
| **Responsive Design** | • Implemented responsive layouts using Flexbox<br>• Created media queries for different screen sizes<br>• Built with mobile-first approach |
| **More than two pages/routes** | • Created a comprehensive workout database using JavaScript objects<br>• Organized exercises in categorized arrays (push/pull/legs) |
| **Function that accepts 2 parameters and returns a value determined by the inputs** | • Examples are the functions that find the correct column based on number of children and find the correct row based upon the calculated combined income to return the value in the intersecting cell |
| **Visually Appealing** | utilized CSS and flexbox/grid to display the results in clearly defined and easy to read manner |
| **Calculate and display data based on an external factor** | The external factor is the base obligation obtained from the API, and the amount it returns is used for further calculations to allocate the amount based on percentages previously determined.  |


## Access the Application
Go to the following website and simply follow the instructions, make up some data to input to test it out.  I restricted my API key to use with only this website so that the project could be deployed through github pages and the user would not have to obtain a key. The program should be ready to run by just going to the following site:
https://amandaintransit.github.io/Capstone/

 
   ```bash
   http://localhost:3002
   ``
