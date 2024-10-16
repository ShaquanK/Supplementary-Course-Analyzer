
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

driver = webdriver.Firefox()
wait = WebDriverWait(driver, 10)

driver.get("http://localhost:3000/")

username = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.XPATH, '//*[@id=":r1:"]'))
    )

username.send_keys("csuscatest@gmail.com")

password = driver.find_element(By.XPATH, '//*[@id=":r3:"]')
password.send_keys("test1234!") 

login_button = driver.find_element(By.XPATH, '//*[@id="root"]/div/div/div[2]/div[2]/button[1]')
login_button.click()

time.sleep(3)
#Clicks course time analyzer button
cta_button = wait.until(EC.element_to_be_clickable((By.LINK_TEXT, "Course Time Analyzer")))
cta_button.click()
#clicks into search bar and searches classes for 10:30
search_bar = wait.until(EC.element_to_be_clickable((By.XPATH,' //*[@id=":r7:"]')))
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

driver.quit()