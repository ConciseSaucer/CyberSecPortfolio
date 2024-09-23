---
layout: default
---

# About Me
<dl>
<dt>Name</dt>
<dd>Noah</dd>
<dt>Born</dt>
<dd>2000</dd>
<dt>Birthplace</dt>
<dd>United States</dd>
</dl>

This page is a collection of all my cyber security achievements.

# Certifications

These are the certifications I have aquired or in the process of getting

*   CompTIA Network+ - In progress
*   CompTIA Linux+ - In progress
*   CompTIA Security+ - In progress

# Confereneces, Clubs, and Events

## Conferences

- Human Cybersecurity Awareness Event 10/8 
  - Career Journey Conversation 
  - Kickoff & Keynote: Cybersecurity and AI in Healthcare 
  - Human & Artificial Intelligence: Social Engineering Now & Next 
  - In it Together: The FBI’s Effort to Wage Digital Justice Requires Strong Partnerships Within our Community 
- National Cybersecurity Virtual Career Fair
  
## Clubs
*   Cyber Club
  
# Education

**Cyber Academy Accelerated Associate of Applied Science (AAS)**
>
> The Associate of Applied Science in Cybersecurity is offered at locations across the state of Indiana, but Ivy Tech Columbus also offers an accelerated way to earn your degree in partnership with Muscatatuck
> Urban Training Center, a national Department of Defense military base.
>
> Students in this nationally-recognized program live on the base during their training and take advantage of over 300 real-life training structures including the Cybertropolis simulation city.

### What is the Cyber Academy?
> The Cyber Academy is based at Muscatatuck Urban Training Center (MUTC), located between Cincinnati, Louisville and Indianapolis. MUTC serves as a U.S. Department of Defense training facility and is home to the Cybertropolis, a Department of Defense urban cyber testing and training environment.
>
> Cyber Academy students are immersed in this training environment, experiencing the most advanced, state-of-the-art cybersecurity training available.

#### Academy courses include:

*   Cloud Computing
*   IT Support
*   Networking
*   Customer Support
*   Linux
*   Disaster Recovery and Business Continuity
*   Ethical Hacking

# TryHackMe

These are the learning paths I have completed on TryHackMe.com.

*   Introduction to Cyber Security - 100% [CERT](imgs/THM-Introduction_to_Cyber_Security.png)
*   Pre Security - 100%
*   SOC Level 1 - 14%
*   Cyber Defense - 4%


# WORK IN PROGRESS

## Code

```py
#//My Simple Guessing Game
from random import randint as RNG
def UserGuess(guess):
        while True:
          try:
            x = int(input(f"Input a number between 1-100\n You have {guess} attempt(s) left\n"))
            if x < 1 or x > 100:
             print("Outside bounds")
            else:
             return x
          except ValueError:
            print("This is not a integer")
def GuessGame():
    guess = 5    
    rng = RNG(1,100)
    input_num = UserGuess(guess)
    i = 0
    while i < 5:
        if input_num == rng:
            print("You WIN, you have guessed correctly")
            break
        if guess == 1:
            print("You LOSE, you have run out of guesses")
            print(f"The correct answer was {rng}")
            break
        elif input_num > rng:
            print("Lower\n")
        elif input_num < rng:
            print("Higher\n")
        i += 0
        guess -= 1
        input_num = UserGuess(guess)
    if guess == 1 or input_num == rng:
       playagain = input("Play again? Type Y\n")
       if playagain == "Y":
          GuessGame()
       else:
          print("Thanks for playing!")
GuessGame()
```

```ruby
# Ruby code with syntax highlighting
GitHubPages::Dependencies.gems.each do |gem, version|
  s.add_dependency(gem, "= #{version}")
end
```
