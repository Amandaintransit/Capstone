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
| **Retrieve data from a third-party API** | • Integrated Nutritionix API for food nutrition data<br>• Implemented YouTube API for video metadata |
| **Create a Node.js web server using Express.js** | • Built a robust Express server with multiple routes<br>• Implemented API endpoints for nutrition and YouTube data |
| **Use arrays, objects to store and retrieve information** | • Created a comprehensive workout database using JavaScript objects<br>• Organized exercises in categorized arrays (push/pull/legs) |
| **Visualize data in a user-friendly way** | • Designed organized exercise cards with clear visual hierarchy<br>• Created macro-calculator with specific results |
| **Responsive Design** | • Implemented responsive layouts using Flexbox<br>• Created media queries for different screen sizes<br>• Built with mobile-first approach |


## How to Download
1. Set up: Before installing the application, you'll need to obtain these API keys:

    A. Nutritionix API: For nutrition data lookups; Sign up at Nutritionix API
    Create an application to get your App ID and API Key @ https://developer.nutritionix.com/signup

    B. YouTube API (Google Cloud): 
      1. Go to the Google Cloud Console: https://console.cloud.google.com/
      2. Create a new project or select an existing one
      3. Enable the YouTube Data API v3:
         - In the navigation menu, click "APIs & Services" > "Library"
         - Search for "YouTube Data API v3"
         - Click "Enable"
      4. Create credentials:
         - Go to "APIs & Services" > "Credentials"
         - Click "Create Credentials" > "API key"
         - You will use this API key when you create a `.env` file

2. **Clone the repository using GIT**
   ```bash
   git clone https://github.com/aprilsears/chronically-well.git
   ```

3. **Navigate to the project directory**
   ```bash
   cd chronically-well
   ```

4. **Install dependencies**
   ```bash
   npm install
   ```
5. **Create environment variables file**
   Create a file named `.env` in the project root directory with the following content:

   ```env
   NUTRITIONIX_APP_ID=your_app_id_here
   NUTRITIONIX_API_KEY=your_api_key_here
   YOUTUBE_API_KEY=your_youtube_api_key_here
   PORT=3002
   ```

6. **Start the server**
   ```bash
   npm run dev
   ```

7. **Access the application**
   Open your browser and navigate to:
   ```bash
   http://localhost:3002
   ```
