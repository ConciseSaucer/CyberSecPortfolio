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
