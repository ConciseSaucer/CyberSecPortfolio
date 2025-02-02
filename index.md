---
layout: default
---

# Hack Me
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

# Confereneces, Presentations, etc

## Conferences

- Human Cybersecurity Awareness Event 10/8 
  - Career Journey Conversation 
  - Kickoff & Keynote: Cybersecurity and AI in Healthcare 
  - Human & Artificial Intelligence: Social Engineering Now & Next 
  - In it Together: The FBI’s Effort to Wage Digital Justice Requires Strong Partnerships Within our Community 
- National Cybersecurity Virtual Career Fair
  
## Clubs
*   Cyber Club
  
## Presentations
- Brownstown Central High School 
  - 10/4/24 
  - Presented to classroom of high school students 
  - Talked about the cyber academy and answered questions
- MUTC
  - 10/31/24
  - Presenation on cyber awareness
    
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

#### Grades:

*   A 105% - SDEV120 Computing Logic 
*   A 98% - ITSP132 IT Support Essentials I
*   A 98% - INFM109 Informatics Fundamentals
*   A 99% - ITSP134 IT Support Essentials II
*   A 99% - NETI104 Introduction to Networking
*   A 104% - SVAD111 Linux and Virtualization Tech
*   IN PROGRESS - SVAD116 Linux Administration
*   IN PROGRESS - CSIA210 Network Protocol Analysis
*   IN PROGRESS - CSIA105 Intro Cyber Security

# TryHackMe

These are the learning paths I have completed on TryHackMe.com.

*   Introduction to Cyber Security - 100% [CERT](imgs/THM-Introduction_to_Cyber_Security.png)
*   Pre Security - 100% [CERT](imgs/THM-Pre-Sec.png)
*   SOC Level 1 - 14%
*   Cyber Defense - 4%

# Guide
[Gentoo Write Up](GentooGuide.md)

# WORK IN PROGRESS

## Code
### IP sweeper
Requires rofi, nmap, and xsltproc
```bash
#!/bin/bash

interface=$(ip -c=never -br -4 addr | rofi -dmenu - p "which interface do you want to use?" | cut -d " " -f 1)
myip=$(ip -c=never -br -4 addr show $interface | awk '{print $3}' | cut -d "/" -f 1)
netid=$(ip -c=never -br 4 addr show $interface | awk '{print $3}' | cut -d "." -f 1-3)
file1=$(mktemp)
echo "Starting scan....."

for ip in $(seq 1 254); do
ping -c 1 -W 2 $netid.$ip | grep "bytes from" | cut -d " " -f 4 | cut -d ":" -f 1 >> $file1 &
done

sleep 3
file2=$(mktemp)
grep -v $myip $file1 | sort -V >> $file2

scan=$(cat $file2 | rofi -dmenu -p "What IP do you want to scan?")
scan_type=$(echo -e "1. Quick Scan\n2. Stealth Scan\n3. Full Scan" | rofi -dmenu -p "What type of scan do you want to use?" | cut -d '.' -f 1)
echo "Starting the scan of $scan"

if [[ $scan_type == "1" ]]; then
  nmap $scan -oX $scan.xml
elif [[ $scan_type == "2" ]]; then
  nmap -Pn -sS $scan -oX $scan.xml
elif [[ $scan_type == "3" ]]; then
  nmap -T4 -A -O -sC $scan -oX $scan.xml
fi

xsltproc $scan.xml -o $scan.html

rm $file1 $file2 $scan.xml
setsid firefox $scan.html &
```
### Port Scanner
```py
import socket
import sys
from datetime import datetime
target = ""
if len(sys.argv) == 2:
    target = socket.gethostbyname(sys.argv[1])
else:
    print("Invalid amount of arguments.")
    print("Syntax: python3 scanner.py <ip>")
if not target:
    target = input("Enter the ip address")
#Prints Header
print("-"*50)
print(f"Scanning target:{target}")
print(f"Time started:{datetime.now()}")
print("-"*50)
try:
    for port in range(1,150):
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        socket.setdefaulttimeout(1)
        result = s.connect_ex((target,port))
        if result == 0:
            print(f"Port {port} is open")
        s.close()
except KeyboardInterrupt:
    print("\nExiting program")
    sys.exit()
except socket.gaierror:
    print("Hostname could not be resolved")
    sys.exit()
except socket.error:
    print("Could not connect to server.")
    sys.exit()
```
### Password Cracker
```py
import threading
from hashlib import md5
from string import printable
from itertools import product
from getpass import getpass as gp
from datetime import datetime
import os
THREADNUM = 6
threads = []
stop_event = threading.Event()# Event to signal all threads to stop
def clear():#Clears the terminal
    os.system("cls" if os.name == "nt" else "clear")
def TestPasswd():#Creates a hash to test the program
    while True:
        pass1 = md5(gp("Enter your password: ").encode("UTF-8")).hexdigest()
        pass2 = md5(gp("Confirm your password: ").encode("UTF-8")).hexdigest()
        if pass1 == pass2:
            with open("Hash.txt", "w") as shadow:
                shadow.write(f"{pass1}\n")
                break
        else:
            print("Your password didn't match!")
def GetHash():#Gets a hash from the user
    while True:
        hash = input("Give me the md5 hash to crack\n")
        if len(hash) == 32:#Checks for valid hash
            with open("Hash.txt", "w") as shadow:
                    shadow.write(f"{hash}\n")
                    break
        else:
            print("Only md5 hashes are allowed")
def Brutepwd(thread_id,r1,r2):# Brute forces the password hash to find a match
    with open("Hash.txt", "r") as shadow_file:
        for shadow in shadow_file:
            for x in range(r1, r2):
                res = product(printable[:-6], repeat=x)
                for i in res:
                    hashed = md5("".join(i).encode("UTF-8")).hexdigest()
                    if progress == True:#Prints progress to terminal
                        print(f"{hashed}    =>    {''.join(i)}")
                    if stop_event.is_set():
                        return  # Exit the thread if the event is set
                    if hashed == shadow.strip():#Match found
                        stop_event.set()  # Set the event to stop all other threads
                        print(f"Gotcha! The password is {''.join(i)}")
                        print(f"Complete at:{datetime.now()}")
                        quit()
            print(f"Thread {thread_id} has gone through all options at:{datetime.now()}.")
def Dictattack():#Uses a password list to find a match
    with open("Hash.txt", "r") as shadow_file:
        with open("password_list.txt", "r") as password_file:
            for shadow in shadow_file:
                for password in password_file:
                    hashed = md5(password.strip().encode("UTF-8")).hexdigest()
                    if progress == True:
                        print(f"{password}")
                    if shadow.strip() == hashed:#Match
                        print(f"Password Cracked! {hashed} => {password}")
                        print(f"Complete at:{datetime.now()}")
                        break
def Pwdripper():#Creates threads for the brute force attack
    for i in range(THREADNUM):
        thread = threading.Thread(target=Brutepwd, args=(i+1,i+1,i+2,))
        threads.append(thread)
        thread.start()
    for thread in threads:
        thread.join()
    print("Hacked!")
def DisplayTerminal():#Ask user if they want to see the progress
    while True: 
        print("-"*50)
        print("Print attempts to the terminal?(Printing will increase the time it takes to crack)\n[y/N]")
        print("-"*50)
        displayinput = input("").lower()
        if displayinput in ['y','n','']:break
        else:
            clear()
    if displayinput in ['n','']:
        progress = False
    if displayinput == "y":
        progress = True
    return progress
def Hash_or_test():
    clear()
    while True:
        print("-"*50)
        print("Do you have a hash? Or are you testing?\n[H] Have hash\n[T]Testing(Type a password)")
        print("-"*50)
        hash_test = input("").lower()
        if hash_test in ["h","t"]:
            break
        else:
            clear()
    if hash_test == "h":
        clear()
        GetHash()
    if hash_test == "t":
        clear()
        TestPasswd()
def AttackType():
    while True:
        print("-"*50)
        print("Enter the type of attack\n[B] Brute Force\n[D] Dictionary")
        print("-"*50)
        attack = input("").lower()
        if attack in ["b","d"]:
            break
        else:
            clear()
    if attack == "b":
        clear()
        #Header
        print("-"*50); print(f"Brute Force attack starting"); print(f"Time started:{datetime.now()}"); print("-"*50)
        Pwdripper()
    if attack == "d":
        clear()
        #Header
        print("-"*50); print(f"Dictionary attack starting"); print(f"Time started:{datetime.now()}"); print("-"*50)
        Dictattack()
clear()
progress = DisplayTerminal()
Hash_or_test()
AttackType()
```
