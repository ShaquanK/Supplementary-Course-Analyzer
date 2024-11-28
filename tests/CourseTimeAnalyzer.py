import allure
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys

@allure.step("Login to the application")
def login(driver, wait, email, password):
    driver.get("http://localhost:3000/Login")
    email_box = wait.until(EC.element_to_be_clickable((By.XPATH, '//*[@id=":r1:"]')))
    email_box.send_keys(email)
    pass_box = driver.find_element(By.XPATH, '//*[@id=":r3:"]')
    pass_box.send_keys(password)
    login_button = driver.find_element(By.XPATH, '//*[@id="root"]/div/div/div[2]/div[2]/button[1]')
    login_button.click()
    wait.until(EC.url_to_be('http://localhost:3000/'))

@allure.step("Test CourseTimeAnalyzer page")
def test_course_time_analyzer():
    options = webdriver.ChromeOptions()
    driver = webdriver.Chrome(options=options)  # Ensure ChromeDriver is in PATH
    wait = WebDriverWait(driver, 15)  # Reduced timeout
    try:
        with allure.step("Perform login"):
            login(driver, wait, "Davidchatla@yahoo.com", "test123")
            allure.attach(driver.get_screenshot_as_png(), name="Login Page Screenshot", attachment_type=allure.attachment_type.PNG)

        with allure.step("Open the CourseTimeAnalyzer page"):
            driver.get("http://localhost:3000/CourseTimeAnalyzer")
            wait.until(EC.presence_of_element_located((By.XPATH, '//input[@aria-label="Search Time Slots"]')))
            allure.attach(driver.get_screenshot_as_png(), name="CourseTimeAnalyzer Page Screenshot", attachment_type=allure.attachment_type.PNG)
        
        with allure.step("Check if page loaded"):
            assert "Supplementary Course Analyzer" in driver.title, "Page did not load or has no title"

        with allure.step("Capture console logs"):
            for entry in driver.get_log('browser'):
                print(entry)

    finally:
        driver.quit()