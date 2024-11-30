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
    manage_user_button.click()

    time.sleep(3)

    manage_email_button = driver.find_element(By.ID, 'manage_email')
    manage_email_button.click()

    current_user_field = wait.until(EC.element_to_be_clickable((By.ID,'current_email')))
    current_user_field.send_keys('csuscatest@gmail.com')

    old_password_field = wait.until(EC.element_to_be_clickable((By.ID,'old_password')))
    old_password_field.send_keys('test1234!')

    new_email_field = driver.find_element(By.ID, 'new_email')
    new_email_field.send_keys('csustestca2@gmail.com')

    update_email_button = driver.find_element(By.ID, 'update_email')
    update_email_button.click()

    time.sleep(3)

    manage_email_button = driver.find_element(By.ID, 'manage_email')
    manage_email_button.click()

    current_user_field = wait.until(EC.element_to_be_clickable((By.ID,'current_email')))
    current_user_field.clear()
    current_user_field.send_keys('csustestca2@gmail.com')

    old_password_field = wait.until(EC.element_to_be_clickable((By.ID,'old_password')))
    old_password_field.clear()
    old_password_field.send_keys('test1234!')

    new_email_field = driver.find_element(By.ID, 'new_email')
    new_email_field.clear()
    new_email_field.send_keys('csuscatest@gmail.com')

    update_email_button = driver.find_element(By.ID, 'update_email')
    update_email_button.click()
    time.sleep(3)

except Exception as e:
    print("Script failed")
    print(f"Error: {e}")
finally:
    driver.quit()

