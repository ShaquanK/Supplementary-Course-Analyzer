
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
    time.sleep(1)
    #Tests link to sac State through logo link
    sac_link = sac_link = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, '.css-0 > a:nth-child(1)'))
    )
    driver.execute_script("arguments[0].scrollIntoView(true);", sac_link)
    sac_link.click()
    driver.back()
    time.sleep(3)
    #Tests link to sac state to apply
    apply_link = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.ID, 'apply_button'))
    )
    apply_link.click()

    time.sleep(3)
    driver.back()
    time.sleep(3)
    #Tests link to sac state experience page
    WebDriverWait(driver, 10).until(EC.invisibility_of_element((By.CLASS_NAME, 'MuiAlert-message')))
    experience_link = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.ID, 'experience_button'))
    )
    experience_link.click()
    time.sleep(3)
    driver.back()
    time.sleep(3)
    #Tests link to sac state give page
    WebDriverWait(driver, 10).until(EC.invisibility_of_element((By.CLASS_NAME, 'MuiAlert-message')))
    give_link = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.ID, 'give_button'))
    )
    give_link.click()
    time.sleep(3)
    driver.back()
    time.sleep(3)

except Exception as e:
    print("Script failed")
    print(f"Error: {e}")
finally:
    driver.quit()

