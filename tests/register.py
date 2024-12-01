# pip install selenium

import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException

#Setup chrome driver
driver = webdriver.Chrome()

try:
    #Navigate to login page
    driver.get('http://localhost:3000/Login')
    time.sleep(2)
    
    #wait until the create account button is loaded
    create_button = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.ID, 'register_button'))
    )
    create_button.click()
    
    displayname = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.ID, 'display_name'))
    )
    displayname.send_keys("test123456@email.com")
    
    email_box = driver.find_element(By.ID, 'email_field')
    email_box.send_keys("test123456@email.com")
    
    password_box = driver.find_element(By.ID, 'password_field')
    password_box.send_keys("Test1234!")
    confirm_box = driver.find_element(By.ID, 'password_confirm')
    confirm_box.send_keys("Test1234!")
    
    signup_button = driver.find_element(By.ID, 'signup_button').click()
    
    try: 
        WebDriverWait(driver, 5).until(EC.url_contains('ogin'))
        print("Sign Up Successful")
        time.sleep(4)
    except:
        error_msg = WebDriverWait(driver, 5).until(
        EC.visibility_of_element_located((By.ID, 'error_message'))
        )
        print(f"Error: {error_msg.text}")
        time.sleep(3)
    
except TimeoutException:
    print("Page took too long to load")    
except Exception as e:
    print("Script failed")
    print(f"Error: {e}")   
finally:
    driver.quit()