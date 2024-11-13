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

time.sleep(11)

menu_button = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.XPATH, '//*[@id="root"]/div/div/div[1]/div[1]/nav/li[4]/button'))
    )
menu_button.click()

manage_user_button = driver.find_element(By.XPATH, '/html/body/div[2]/div[3]/div/ul/a[9]/div/div/span')
manage_user_button.click()

time.sleep(3)

manage_email_button = driver.find_element(By.XPATH, '/html/body/div/div/div/div[2]/div/div/div/div/div/p[2]')
manage_email_button.click()

current_user_field = wait.until(EC.element_to_be_clickable((By.XPATH,'//*[@id=":rb:"]')))
current_user_field.send_keys('csuscatest@gmail.com')

old_password_field = wait.until(EC.element_to_be_clickable((By.XPATH,'//*[@id=":rd:"]')))
old_password_field.send_keys('test1234!')

new_email_field = driver.find_element(By.XPATH, '//*[@id=":rf:"]')
new_email_field.send_keys('csustestca2@gmail.com')

update_email_button = driver.find_element(By.XPATH, '/html/body/div[2]/div[3]/div/div[2]/button[2]')
update_email_button.click()

time.sleep(3)
driver.close()

