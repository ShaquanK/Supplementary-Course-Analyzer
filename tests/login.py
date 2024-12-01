# pip install selenium

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
        WebDriverWait(driver, 5).until(EC.url_to_be('http://localhost:3000/')) 
        print("Login successful")
        time.sleep(3)
    #if login fails, return error from div
    except:
        error_div = driver.find_element(By.ID, 'error_message')
        print(f"Login failed: {error_div.text}")
    
    #Fail login case
    try:
        driver.delete_all_cookies
        driver.get('http://localhost:3000/Login')
        email_box = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.ID, 'email_field'))
        )
        email_box.send_keys("csuscatest@gmail.com")
        password_box = driver.find_element(By.ID, 'password_field')
        password_box.send_keys("test")
        login_button = driver.find_element(By.ID, 'login_button')
        login_button.click()
        WebDriverWait(driver, 3).until(EC.url_to_be('http://localhost:3000/')) 
    except:
        error_div = driver.find_element(By.ID, 'error_message')
        print(f"Login failed: {error_div.text}")
        
except Exception as e:
    print("Script failed")
    print(f"Error: {e}")
    
finally:
    driver.quit()
