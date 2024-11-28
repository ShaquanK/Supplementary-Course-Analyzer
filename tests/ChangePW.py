import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

driver = webdriver.Firefox()
wait = WebDriverWait(driver, 10)

try:
    driver.get("http://localhost:3000/")

    username = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, 'email_field'))
        )

    username.send_keys("csuscatest@gmail.com")

    password = driver.find_element(By.ID, 'password_field')
    password.send_keys("test1234!") 

    login_button = driver.find_element(By.ID, 'login_button')
    login_button.click()

    time.sleep(2)

    menu_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.ID, 'menu_button'))
        )
    menu_button.click()

    manage_user_button = driver.find_element(By.ID, 'manage_user')
    time.sleep(2)
    manage_user_button.click()
    time.sleep(2)

    password_button = driver.find_element(By.ID, 'manage_password')
    password_button.click()

    time.sleep(2)
    #input into password fields
    current_user = wait.until(EC.element_to_be_clickable((By.ID,'current_email')))
    current_user.send_keys('csuscatest@gmail.com')

    old_password_field = wait.until(EC.element_to_be_clickable((By.ID,'old_password')))
    old_password_field.send_keys('test1234!')

    new_password_field = driver.find_element(By.ID, 'new_password')
    new_password_field.send_keys('test1234')

    time.sleep(1)

    update_password_button = driver.find_element(By.ID, 'update_password')
    update_password_button.click()

    time.sleep(2)
    print("Manually change the password back to test1234! to run the test again!")
    
except Exception as e:
    print("Script failed")
    print(f"Error: {e}")
finally:
    driver.quit()
