import requests
from datetime import datetime, timedelta
from bs4 import BeautifulSoup
import json
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
                    'MetaData': 'Future'
                })
                week_data.append({
                    'Emp_nmbr': sample_row['Emp_nmbr'],  # You can adjust this based on your sample data
                    'Log Date': default_out_time.strftime('%d/%m/%Y %H:%M:%S'),
                    'Device id': sample_row['Device id'],
                    'MetaData': 'Future'
                })
            else:
                default_in_time = datetime.combine(current_day, datetime.min.time()) + timedelta(hours=8, minutes=30)
                default_out_time = datetime.combine(current_day, datetime.min.time()) + timedelta(hours=17)

                sample_row = data[0] if data else {'Emp_nmbr': 'Unknown', 'Device id': 'Unknown'}

                week_data.append({
                    'Emp_nmbr': sample_row['Emp_nmbr'],  # You can adjust this based on your sample data
                    'Log Date': default_in_time.strftime('%d/%m/%Y %H:%M:%S'),
                    'Device id': sample_row['Device id'],
                    'MetaData': 'Absent'
                })
                week_data.append({
                    'Emp_nmbr': sample_row['Emp_nmbr'],  # You can adjust this based on your sample data
                    'Log Date': default_out_time.strftime('%d/%m/%Y %H:%M:%S'),
                    'Device id': sample_row['Device id'],
                    'MetaData': 'Absent'
                })
        current_day += timedelta(days=1)

    week_data.sort(key=lambda x: datetime.strptime(x['Log Date'], '%d/%m/%Y %H:%M:%S'))

    # Get today's date
    today_date = datetime.now().date()

    # Filter today's entries
    today_entries = [
        entry for entry in week_data
        if datetime.strptime(entry['Log Date'], '%d/%m/%Y %H:%M:%S').date() == today_date
    ]

    # Check the number of entries for today
    if len(today_entries) < 2:
        if today_entries:  # If there is at least one entry for today
            # Use the first entry's Log Date
            first_entry_time = datetime.strptime(today_entries[0]['Log Date'], '%d/%m/%Y %H:%M:%S')
            # Calculate the default "OUT" time as 8 hours from the first entry
            default_out_time = first_entry_time + timedelta(hours=8)
            # Add the default entry to week_data
            week_data.append({
                'Emp_nmbr': today_entries[0]['Emp_nmbr'],  # Placeholder
                'Log Date': default_out_time.strftime('%d/%m/%Y %H:%M:%S'),
                'Device id': today_entries[0]['Device id']  # Placeholder
            })
            # print(f"Added default OUT entry for today: {default_out_time.strftime('%d/%m/%Y %H:%M:%S')}")
        # else:
        #     print("No entries found for today. No default entry added.")

    # Sort again to include the new entry
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

    # Set up command-line arguments
    parser = argparse.ArgumentParser(description="Fetch weekly data for a given staff number and date.")
    parser.add_argument("staffNo", type=str, help="The staff number (e.g., memno)")
    parser.add_argument("date", type=str, help="The date in yyyy-mm-dd format")

    args = parser.parse_args()

    # Use the staffNo and date arguments
    staffNo = args.staffNo
    date = args.date

    # Print the received arguments (or handle them as needed)
    # print_colored(f"Fetching data for staff number: {staffNo} on date: {date}", Colors.OKGREEN)

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

    current_date = datetime.strptime(date, '%Y-%m-%d') if date else datetime.now()

    username = staffNo
    
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
