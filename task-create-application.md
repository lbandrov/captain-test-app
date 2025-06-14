***Task to implement application for doing test examination and questions practicing.***

The application has to allow users to login just by providing username and then go to a page where they can choose either to participate in test examination or to just practice answering questions.

**Login page**

This is the landing page which is opened when the user accesses the application. On this page there must be a field where the user can enter their username. The application needs to track all the users that have logged in and show them in a list below the field where the user can enter new username and essentially start with a new user. The application can use the LocalStorage as a place to store the users information.

**Page for test examination and questions answering practice**

When the user chooses a username and logs in he or she must be redirected to this page. The page must allow the user to switch between 2 views:

- Questions practice
- Test examination

The application must allow the users to easily switch between the 2 views.

**Questions practice**

Here the users see one question at all times. The questions are with multiple choise answers. The user can select one answer for the question. There are always 4 answers for every question. When the user select an answer there must be a button which allows the user to check whether the answer they provided is correct or not. When the user clicks on this button then the application must check whether the answer the user provided to the question is correct or not based on the provided information for the questions and the answers. If the user answered correctly then the answer they chose must be highlighted in green. If the answer is not correct then the option that the user selected must be highlighted in red and the correct answer to be highlighted in green. In addition to that probably it would be nice to add something like feedback around the question which says either CORRECT or WRONG so that it is more visible to the user that their answer is correct or wrong.

This functionality must show the questions available in a random way but questions must not be repeated for 1 particular user until the user has passed through all the providing correct answers. This means that first time the itteration starts the user must go through all the questions avaialable. Then the application can start repeating the questions that the user did not answered correctly. If the user fails to answer the questions correctly then they are repeated again. This repeating is done until the user provides correct answers to all questions. After that the whole thing can start a new, meaning that after the user answered all questions correctly (no matter how many itterations) the whole question answering experience must start from the beginning, meaning picking the questions in random way, and then repeating the whole thing.

In addition to that the user must be able to see all the time his/her answeres to the last 10 questions in the UI. By all the time I mean while answering other questions. The feedback does not need to contain the questions and the answers. It can be just a column or list, or whatever containing dots (probably some circles) that are red or green depending on whether the user answered correctly to the question or not. There is no need to keep track of all questions and answers, just that last 10 is enough.

The application needs to remember the progress of each user by storing information in the LocalStorage. The idea is that when the user logs out and logs in again he/she needs to start answering questions from the point where they left.

**Test examination**

Here we have another functionality for questions answering however here users must answer a set of questions in a similar way as in Questions practice but this time the feedback is provided when the whole set of questions is answered. So basically when the user switches to this view they need to start new examination. When the examination starts the application choses a set of questions from the whole bunch at random. The number of questions to be selected in the set must be configurable so that I can adjust it easily before starting the application. Lets say the default is 60. When the application selected the questions for the examination then the question answering starts. The questions are presentedd to the user one by one. The user selects an answer and has the option to either go back or go forward. The application does not show the correct answer in any way at this point. The user can go back and change the answers of the previous questions the they answered. The application must provide a clear tracking about the questions that have been answered and those that haven't beens answered, so that the user can know if they have unanswered questions.

When all the questions are answered and the user goes forward from the last question instead of new question the user must see a button to complete the examination. When the user complates the examination then the component must change again so that it can show feedback to the user. The feedback contains how many correct answers the user provided from how many questions. Also the feedback must contain the time it took the user to do the examination. This can be done by storing the start date and time and then using the date and time of completiong to calculate the time needed. The time must be shown in HH:MM:SS. In addition to that the feedback must contain a message saying whether the user passed or failed. The threshold should be a number of wrong answers. Basically the appplication must check if the user has more than particular number of wrong answers and if this is the case then it shows that the user FAILED. If the number of wrong answers are less than the threshold then the application shows PASSED. In addition to all that at the end the user must see a button which will allow them to start a new examination.

While the user is doing the examination and it is not complete if they decide to navigate to some other page in the application, logout or whatever the application must show a confirmation dialogue reminding the user that the progress of the current examination will be discarded. if the user confirms then proceed with the navigation if they cancel then close the confirmation dialogue and do nothing just allow the user to continue with the examination.

When on the Test examination view the user must be able to see a tracking of the last 10 examinations they did. There is no need for details information, the application needs to show just whether the user passed or failed the examination. Probably this can be done in a similar way as the tracking of the answers in the Questions practice view by showing just a red or green circle. We need to keep this feedback for at most the 10 last examinations the user did.

**Functionality to logout and change user**

There must be a way for the user to log out and change the username used all the time when they are on the page for examination and questions answering practice.

**Load questions**

The questions and the answers that the application must use are provided in an excel file in this directory called questions_and_answers.xlsx. In the file there is just one tab which is called Questions. On the first row of the tab there are column names in each column used. On the rows bellow that are the questions. On every row there is one question with the corresponding answers. In column A the number of the question is set. In column B that question itself is set. The questions are in Bulgarian and they must be kept in Bulgarian. In column C is the answer option "А". In column D is the answer option "Б". In column E is the answer option "В". In column F is the answer option "Г". Every question has one correct answer. The correct answer in the excel file is marked by the blue font of the answer.

Read the excel and export all the questions with the corresponding answers and the corresponding correct answer to a JSON file which you can after that use in the application when you are selecting the questions for Questions practice and Test examination. You can format the JSON in whatever way you think is most effective for the application.

**Application design**

The application must have responsive and nice design visually. The UX experience must be good, too. It would be nice if you are able to use MUI Components for React to implement the application. If not then just add sstyles so that the application looks good.

