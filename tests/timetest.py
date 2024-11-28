
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
            EC.presence_of_element_located((By.ID, "email_field"))
        )

    username.send_keys("csuscatest@gmail.com")

    password = driver.find_element(By.ID, "password_field")
    password.send_keys("test1234!") 

    login_button = driver.find_element(By.ID, "login_button")
    login_button.click()

    time.sleep(3)
    #Clicks course time analyzer button
    cta_button = wait.until(EC.element_to_be_clickable((By.ID, "course_analyzer")))
    cta_button.click()
    #clicks into search bar and searches classes for 10:30
    search_bar = wait.until(EC.element_to_be_clickable((By.ID,"time_search")))
    search_bar.send_keys("10:30" + Keys.ENTER)
    time.sleep(5)
    #Clears search bar and types into search bar 12:00
    search_bar.clear()
    search_bar.send_keys("12:00" + Keys.ENTER)
    time.sleep(5)
    #Clears Search bar and types into search bar 13:00, should result in nothing
    search_bar.clear()
    search_bar.send_keys("13:00" + Keys.ENTER)
    time.sleep(5)

except Exception as e:
    print("Script failed")
    print(f"Error: {e}")
finally:
    driver.quit()
