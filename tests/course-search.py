import allure
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# List of devices to emulate (for mobile/tablet testing)
device_list = [
    {"name": "iPhone 12", "width": 390, "height": 844},
    {"name": "iPad Pro 11", "width": 834, "height": 1194},
    {"name": "Galaxy S5", "width": 360, "height": 640},
    {"name": "Desktop 1280x800", "width": 1280, "height": 800},
    {"name": "Desktop 1920x1080", "width": 1920, "height": 1080},
]

@allure.step("Login to the application")
def login(driver, email, password):
    driver.get("http://localhost:3000/Login")
    email_field = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.ID, "email_field"))
    )
    email_field.send_keys(email)
    driver.find_element(By.ID, "password_field").send_keys(password)

    login_button = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.ID, "login_button"))
    )
    login_button.click() 

    driver.implicitly_wait(5) 
    allure.attach(driver.get_screenshot_as_png(), name="Login Page Screenshot", attachment_type=allure.attachment_type.PNG)

@allure.step("Test Course Search Functionality")
def test_course_search():
    options = Options()
    options.add_argument("--start-maximized") 


    with allure.step(f"Testing with Chrome"):
        driver = webdriver.Firefox()
        wait = WebDriverWait(driver, 10)

        # Iterate through device list for emulation
        for device in device_list:
            with allure.step(f"Testing on {device['name']}"):

                # Emulate device
                driver.set_window_size(device['width'], device['height'])

                # Perform login
                login(driver, "test@csus.edu", "Test1234%")

                driver.implicitly_wait(5) 
                search_courses_link = driver.find_element(By.ID, "search-courses-link").click()

                driver.implicitly_wait(5)
                search_input = driver.find_element(By.ID, "course-search-input")
                assert search_input.is_displayed(), "Search input is not visible"

                search_input.clear()
                search_input.send_keys("bio 1")
                search_input.send_keys(Keys.RETURN)  

                driver.implicitly_wait(5)

                # Check if results are displayed
                results = driver.find_elements(By.CLASS_NAME, "course-result")
                assert len(results) > 0, "No results found for the search query"

                allure.attach(driver.get_screenshot_as_png(), name=f"CourseSearch_Page_{device['name']}_Chrome", attachment_type=allure.attachment_type.PNG)

                # Clear search field for the next iteration
                search_input.clear()

        driver.quit()
