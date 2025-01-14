# import requests
# from datetime import datetime, timedelta
# from bs4 import BeautifulSoup
# import json

# class Colors:
#     HEADER = '\033[95m'  # Purple
#     OKBLUE = '\033[94m'  # Blue
#     OKCYAN = '\033[96m'  # Cyan
#     OKGREEN = '\033[92m'  # Green
#     WARNING = '\033[93m'  # Yellow
#     FAIL = '\033[91m'  # Red
#     ENDC = '\033[0m'    # Reset to default
#     BOLD = '\033[1m'    # Bold text
#     UNDERLINE = '\033[4m'  # Underline text

# def print_colored(message, color):
#     print(f"{color}{message}{Colors.ENDC}")

# def get_week_start_end(current_date):
#     start_of_week = current_date - timedelta(days=current_date.weekday())  # Monday
#     end_of_week = start_of_week + timedelta(days=6)  # Sunday
#     return start_of_week, end_of_week

# def extract_data_for_week(data, start_date, end_date):
#     week_data = []
#     for row in data:
#         log_date = datetime.strptime(row['Log Date'], '%d/%m/%Y %H:%M:%S').date()
#         if start_date.date() <= log_date <= end_date.date():
#             week_data.append(row)
    
#     week_data.sort(key=lambda x: datetime.strptime(x['Log Date'], '%d/%m/%Y %H:%M:%S'))

#     current_date = datetime.now().date()
#     last_date = (start_date + timedelta(days=4)).date()

#     existing_dates = {datetime.strptime(row['Log Date'], '%d/%m/%Y %H:%M:%S').date() for row in week_data}

#     current_day = start_date.date()
#     while current_day <= last_date:
#         if current_day not in existing_dates:
#             # if current_day < current_date:
#             #     print_colored(f"On {current_day.strftime('%d/%m/%Y')}, using default duration of 8:30 as you were absent.", Colors.WARNING)

#             if current_day > current_date:
#                 default_in_time = datetime.combine(current_day, datetime.min.time()) + timedelta(hours=9)
#                 default_out_time = datetime.combine(current_day, datetime.min.time()) + timedelta(hours=17)
#                 # print_colored(f"Using 9:00 AM to 5:00 PM for {current_day.strftime('%d/%m/%Y')} as it is a future date.", Colors.OKCYAN)
#             else:
#                 default_in_time = datetime.combine(current_day, datetime.min.time()) + timedelta(hours=8, minutes=30)
#                 default_out_time = datetime.combine(current_day, datetime.min.time()) + timedelta(hours=17)

#             sample_row = data[0] if data else {'Emp_nmbr': 'Unknown', 'Device id': 'Unknown'}

#             week_data.append({
#                 'Emp_nmbr': sample_row['Emp_nmbr'],
#                 'Log Date': default_in_time.strftime('%d/%m/%Y %H:%M:%S'),
#                 'Device id': sample_row['Device id']
#             })
#             week_data.append({
#                 'Emp_nmbr': sample_row['Emp_nmbr'],
#                 'Log Date': default_out_time.strftime('%d/%m/%Y %H:%M:%S'),
#                 'Device id': sample_row['Device id']
#             })
#         current_day += timedelta(days=1)

#     week_data.sort(key=lambda x: datetime.strptime(x['Log Date'], '%d/%m/%Y %H:%M:%S'))

#     # with open('/home/harish_c/Desktop/TimeCalculator/duration.txt', 'w') as file:
#     #     for row in week_data:
#     #         log_date = datetime.strptime(row['Log Date'], '%d/%m/%Y %H:%M:%S')
#     #         formatted_data = f"{row['Emp_nmbr']}   {log_date.strftime('%d/%m/%Y')}   {log_date.strftime('%H:%M:%S')}   {row['Device id']}"
#     #         file.write(formatted_data + '\n')

#     print(json.dumps(week_data))

#     return week_data

# def login(session, login_url, payload):
#     response = session.post(login_url, data=payload)
#     if response.status_code == 200:
#         success = True
#         # print_colored("Login successful! Now you can view anyone's details", Colors.OKGREEN)
#     else:
#         # print_colored("Login failed.", Colors.FAIL)
#         return False
#     return True

# def fetch_data(session, data_url, payload):
#     response = session.get(data_url, data=payload)
#     if response.status_code == 200:
#         return response.text
#     else:
#         print_colored("Failed to fetch data.", Colors.FAIL)
#         return None

# def parse_data(raw_html):
#     soup = BeautifulSoup(raw_html, 'html.parser')

#     data = []
#     rows = soup.find_all('tr', class_=['tdodd', 'tdeven'])
#     for row in rows:
#         columns = row.find_all('td')
#         emp_no = columns[0].text.strip()
#         log_date = columns[1].text.strip()
#         device_id = columns[2].text.strip()
#         data.append({
#             'Emp_nmbr': emp_no,
#             'Log Date': log_date,
#             'Device id': device_id
#         })
#     return data

# def main():
#     login_url = "http://piano/blogin.asp"
#     data_url = "http://piano/punch.asp"

#     payload = {
#         "mempno": 6305,
#         "mpass": 2610,
#         "mlevel": 2,
#     }

#     session = requests.Session()

#     if not login(session, login_url, payload):
#         return

#     # print("\n**************************")
#     current_date = datetime.now()

#     # print("\n**************************")
#     username = 6305
    
#     start_of_week, end_of_week = get_week_start_end(current_date)

#     current_month = current_date.month
#     current_year = current_date.year
#     previous_month = current_month - 1 if current_month > 1 else 12
#     previous_year = current_year if current_month > 1 else current_year - 1

#     data_payload_current_month = {
#         "month": current_month,
#         "year": current_year,
#         "empno": username,
#         "etop": "HARISH CHOUDHARY( 6330 )"
#     }

#     data_payload_previous_month = {
#         "month": previous_month,
#         "year": previous_year,
#         "empno": username,
#         "etop": "HARISH CHOUDHARY( 6330 )"
#     }

#     raw_html_current_month = fetch_data(session, data_url, data_payload_current_month)
#     raw_html_previous_month = fetch_data(session, data_url, data_payload_previous_month)

#     if raw_html_current_month and raw_html_previous_month:
#         data_current_month = parse_data(raw_html_current_month)
#         data_previous_month = parse_data(raw_html_previous_month)

#         data_combined = data_previous_month + data_current_month

#         week_data = extract_data_for_week(data_combined, start_of_week, end_of_week)
#     else:
#         print_colored("Failed to fetch data for one or both months.", Colors.FAIL)

# if __name__ == "__main__":
#     main()

























import requests
from datetime import datetime, timedelta
from bs4 import BeautifulSoup
import json

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

def get_week_start_end(current_date):
    start_of_week = current_date - timedelta(days=current_date.weekday())  # Monday
    end_of_week = start_of_week + timedelta(days=6)  # Sunday
    return start_of_week, end_of_week

def extract_data_for_week(data, start_date, end_date):
    week_data = []
    for row in data:
        log_date = datetime.strptime(row['Log Date'], '%d/%m/%Y %H:%M:%S').date()
        if start_date.date() <= log_date <= end_date.date():
            week_data.append(row)
    
    week_data.sort(key=lambda x: datetime.strptime(x['Log Date'], '%d/%m/%Y %H:%M:%S'))

    current_date = datetime.now().date()
    last_date = (start_date + timedelta(days=4)).date()

    existing_dates = {datetime.strptime(row['Log Date'], '%d/%m/%Y %H:%M:%S').date() for row in week_data}

    current_day = start_date.date()
    while current_day <= last_date:
        if current_day not in existing_dates:
            if current_day > current_date:
                default_in_time = datetime.combine(current_day, datetime.min.time()) + timedelta(hours=9)
                default_out_time = datetime.combine(current_day, datetime.min.time()) + timedelta(hours=17)

                sample_row = data[0] if data else {'Emp_nmbr': 'Unknown', 'Device id': 'Unknown'}
                
                week_data.append({
                    'Emp_nmbr': sample_row['Emp_nmbr'],  # You can adjust this based on your sample data
                    'Log Date': default_in_time.strftime('%d/%m/%Y %H:%M:%S'),
                    'Device id': sample_row['Device id'],
                    'MetaData': 'Future date - Default in and out times used'
                })
                week_data.append({
                    'Emp_nmbr': sample_row['Emp_nmbr'],  # You can adjust this based on your sample data
                    'Log Date': default_out_time.strftime('%d/%m/%Y %H:%M:%S'),
                    'Device id': sample_row['Device id'],
                    'MetaData': 'Future date - Default in and out times used'
                })
            else:
                default_in_time = datetime.combine(current_day, datetime.min.time()) + timedelta(hours=8, minutes=30)
                default_out_time = datetime.combine(current_day, datetime.min.time()) + timedelta(hours=17)

                week_data.append({
                    'Emp_nmbr': 'Unknown',  # You can adjust this based on your sample data
                    'Log Date': default_in_time.strftime('%d/%m/%Y %H:%M:%S'),
                    'Device id': 'Unknown'
                })
                week_data.append({
                    'Emp_nmbr': 'Unknown',  # You can adjust this based on your sample data
                    'Log Date': default_out_time.strftime('%d/%m/%Y %H:%M:%S'),
                    'Device id': 'Unknown'
                })
        current_day += timedelta(days=1)

    week_data.sort(key=lambda x: datetime.strptime(x['Log Date'], '%d/%m/%Y %H:%M:%S'))

    # Output the final JSON data
    return week_data

def login(session, login_url, payload):
    response = session.post(login_url, data=payload)
    if response.status_code == 200:
        success = True
    else:
        return False
    return True

def fetch_data(session, data_url, payload):
    response = session.get(data_url, data=payload)
    if response.status_code == 200:
        return response.text
    else:
        print_colored("Failed to fetch data.", Colors.FAIL)
        return None

def parse_data(raw_html):
    soup = BeautifulSoup(raw_html, 'html.parser')

    data = []
    rows = soup.find_all('tr', class_=['tdodd', 'tdeven'])
    for row in rows:
        columns = row.find_all('td')
        emp_no = columns[0].text.strip()
        log_date = columns[1].text.strip()
        device_id = columns[2].text.strip()
        data.append({
            'Emp_nmbr': emp_no,
            'Log Date': log_date,
            'Device id': device_id
        })
    return data

def main():
    login_url = "http://piano/blogin.asp"
    data_url = "http://piano/punch.asp"

    payload = {
        "mempno": 6305,
        "mpass": 2610,
        "mlevel": 2,
    }

    session = requests.Session()

    if not login(session, login_url, payload):
        return

    current_date = datetime.now()

    username = 6305
    
    start_of_week, end_of_week = get_week_start_end(current_date)

    current_month = current_date.month
    current_year = current_date.year
    previous_month = current_month - 1 if current_month > 1 else 12
    previous_year = current_year if current_month > 1 else current_year - 1

    data_payload_current_month = {
        "month": current_month,
        "year": current_year,
        "empno": username,
        "etop": "HARISH CHOUDHARY( 6330 )"
    }

    data_payload_previous_month = {
        "month": previous_month,
        "year": previous_year,
        "empno": username,
        "etop": "HARISH CHOUDHARY( 6330 )"
    }

    raw_html_current_month = fetch_data(session, data_url, data_payload_current_month)
    raw_html_previous_month = fetch_data(session, data_url, data_payload_previous_month)

    if raw_html_current_month and raw_html_previous_month:
        data_current_month = parse_data(raw_html_current_month)
        data_previous_month = parse_data(raw_html_previous_month)

        data_combined = data_previous_month + data_current_month

        week_data = extract_data_for_week(data_combined, start_of_week, end_of_week)
        # Output the JSON data
        print(json.dumps({"weekData": week_data}, indent=4))
    else:
        print_colored("Failed to fetch data for one or both months.", Colors.FAIL)

if __name__ == "__main__":
    main()
