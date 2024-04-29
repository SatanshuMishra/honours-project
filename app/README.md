## uLearn Developer Crash Course

This document is intended to help support the continued development of the uLearn system. I have provide some valuable tips & tricks learnt over the development of this system to help make your development journey easier.

## UI Design and Implementation

UI Design can be tricky. The system went though several designs and implementations before it reached the stage it is currently in. This tips are intended to guide further development:

1. Write down your expectations. Without clear goals from your optimal UI, it is near-impossible to design a UI that works well. This system was designed to be simple and intuitive. Students could simply follow the instructions on the screen and intuitively understand how things worked.
2. Design Prototypes. Prototyping has been incredibly helpful in the desin of this system. I used Figma to design high level prototypes of the system to test ideas before I implemented them in code. This helped eliminate ideas and fine tune other to better suit my needs and requirements. You can find the figma used for this system here: https://www.figma.com/community/file/1366899032954965958/ulearn-adaptive-learning-tool.
3.Browser Inspect Element: When you have some code that isn't doing what you intended for it to do, instead of switching between your editor and the broswer, make the changes directly in the browser using Inspect Element. This will help you understand the connections between elements on your page to see why something may be going wrong. **Make sure to take notes or a screenshot of your changes** since refreshing the page will revert the Inspect Element content to the original code.

## Machine Learning Troubleshooting

The Machine learning (ML) forms the core of what this system is supposed to do. Being able to troubleshoot and find bug is important for the further development of this tool.

1. Depending on the bug, you can anticipate which file(s) to explore. Here is a short list of important files. Note the directories start in `honours-2023-adaptive-learning-tool/app/`.

  a. `questionnaire/api/addperformancestatistics`: For bug encountered over individual attempts in a quiz (rather than at the end of the quiz).
  b. `questionnaire/api/processResults`: For bugs encountered at the end of a quiz. Possibly involving the parsing of data for IRT.
  c. `questionnaire/api/irt`: As the name would suggest, for bugs with the actual irt model (e.g., Degrees of Freedom).
  d. `questionnaire/api/addquestion` & `questionnaire/api/addanswer`: For issues encountered with adding questions.
  e. `questionnaire/api/fetchquestions` & `questionnaire/api/fetchanswers`: For issues encounted with quiz loading/generation.
  f. `scripts/parseJSON`: Bugs encountered with loading the questions from JSON to insert into the system.
  g. `scripts/verifyJWT` & `scripts/validateToken`: Issues with user session.
  h. `types/*`: Issues with object types.

These are starting points to look at when troubleshooting the app.

2. Using `docker-compose up`: Attaching a Docker session to your terminal tab can seem pointless and a waste of a window. However, it can help you track what happens with your app's backend in real time. If you can't see or find your error using traditional console.log debug lines, take a look at your docker container.
