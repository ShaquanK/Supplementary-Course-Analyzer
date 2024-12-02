# pip install selenium

import sys
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
    
#Setup chrome driver
driver = webdriver.Chrome()

#Login
try:
    #Navigate to webpage
    driver.get('http://localhost:3000/Login')
    
    #wait until the email field is loaded or quit after 10 secs
    email_box = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.ID, 'email_field'))
    )

    #input string into email field
    email_box.send_keys("csuscatest@gmail.com")
    #locate password field
    password_box = driver.find_element(By.ID, 'password_field')
    #input password into field
    password_box.send_keys("test1234!")

    login_button = driver.find_element(By.ID, 'login_button')
    login_button.click()
    
    try: 
        WebDriverWait(driver, 3).until(EC.url_to_be('http://localhost:3000/')) 
        print("Login successful")
    #if login fails, return error from div
    except:
        error_div = driver.find_element(By.ID, 'error_message')
        print(f"Login failed: {error_div.text}")
        driver.quit()
        sys.exit(1)

except TimeoutException:
    print("Could not find email field in time") 
    driver.quit()
    sys.exit(1)
except Exception as e:
    print("Script failed")
    print(f"Error: {e}")
    driver.quit()
    sys.exit(1)
    
#Go to student availability page
try:
    availability_page = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.ID, 'student_availability'))
    )
    time.sleep(1)
    availability_page.click()
    new_course = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.ID, 'new_course'))
    )
    new_course.click()
    new_course.send_keys("TEST123")
    add_course = driver.find_element(By.ID, 'add_course')
    add_course.click()
    
    student_name = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.ID, 'student_name'))
    )
    student_name.send_keys("Test Tester")
    
    # Select days
    days = ["Monday", "Wednesday", "Friday"]
    for day in days:
        day_checkbox = driver.find_element(By.NAME, day)
        day_checkbox.click()
        
    # Add time slots
    start_time_input = driver.find_element(By.ID, 'start_time')
    start_time_input.click()
    start_time_input.send_keys("09:00AM")
    end_time_input = driver.find_element(By.ID, 'end_time')
    end_time_input.click()
    end_time_input.send_keys("11:00AM")

    # Submit the form
    submit_button = driver.find_element(By.ID, 'submit_button')
    submit_button.click()
 
    time.sleep(4)
    
except TimeoutException:
    print("Could not find menu button in time") 
except Exception as e:
    print("Script failed")
    print(f"Error: {e}")
finally:
    driver.quit()