Quiz App ke Core Features:
1. Topic Selection
User quiz start karne se pehle topic choose karta hai (JavaScript, React, Python).

selectedTopic state us topic ko store karti hai.

Jab topic select ho jata hai, tab quiz start hota hai.

2. Question Fetching from API
fetchQuestion function API se current question ko fetch karta hai.

Ye API ko POST request bhejta hai with questionNumber aur selectedTopic.

API response me se question text, options (A, B, C, D), correct answer aur expected output parse karta hai.

Agar question parse nahi hota to error show karta hai.

3. Multiple Choice and Output Type Questions
Question do tarah ke ho sakte hain:

Multiple choice with 4 options (A, B, C, D)

Output type jisme user ek text input me answer de sakta hai (like expected output).

4. Countdown Timer (15 seconds)
Har question ke liye 15 second ka timer set hota hai.

Timer har second reduce hota hai (countdown state).

Timer 5 seconds se kam hone par timer ka color red ho jata hai, otherwise green.

Agar time khatam ho jata hai to quiz over ho jata hai.

5. Answer Selection and Scoring
User option select karta hai ya output submit karta hai.

Selected option ko check karta hai correct answer ke saath.

Agar correct hai to score increment hota hai.

Output answer ko bhi case-insensitive compare karke score update karta hai.

Score score state me store hota hai.

6. Next Question Transition
Answer select karne ke baad ya output submit karne ke baad automatic agla question load hota hai.

5 questions ke baad quiz end ho jata hai.

7. Disabling Buttons/Input on Answer
Jab user ne answer diya ya output submit kiya, tab options disable ho jate hain.

Timer bhi stop ho jata hai.

8. Quiz Over Screen
Jab quiz khatam ho jata hai to final score dikhaya jata hai.

Option hota hai "Choose Another Topic" ka, jisse quiz reset ho jata hai.

9. Loading State
Jab question load ho raha hota hai tab loading state true hota hai.

Button disabled ho jata hai aur "Loading..." dikhata hai.

10. Styling via CSS Classes
Timer text ka color dynamically change hota hai (red or green class).

