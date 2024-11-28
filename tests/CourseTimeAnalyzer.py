from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains
import time

# Initialize the driver
driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))

try:
    # Open the CourseTimeAnalyzer page
    driver.get("http://localhost:3000/CourseTimeAnalyzer") 

    # Wait until the search bar is present
    wait = WebDriverWait(driver, 10)
    search_box = wait.until(EC.presence_of_element_located((By.XPATH, '//input[@aria-label="Search Time Slots"]')))

    # Enter search query and hit Enter
    search_box.send_keys("Monday")
    search_box.send_keys(Keys.RETURN)

    # Toggle to Calendar View
    calendar_switch = wait.until(EC.presence_of_element_located((By.XPATH, '//input[@type="checkbox"]')))
    calendar_switch.click()
    time.sleep(2)  # Wait for view to switch

    # Toggle back to List View
    calendar_switch.click()
    time.sleep(2)

    # Edit the first row's time slot
    edit_button = wait.until(EC.element_to_be_clickable((By.XPATH, '(//button[@aria-label="edit"])[1]')))
    edit_button.click()

    # Wait for time slot input to be editable
    time_slot_input = wait.until(EC.element_to_be_clickable((By.XPATH, '(//input[@value])[2]')))
    time_slot_input.clear()
    time_slot_input.send_keys("10:00 AM - 12:00 PM")

    # Save the edited row
    save_button = wait.until(EC.element_to_be_clickable((By.XPATH, '(//button[@aria-label="save"])[1]')))
    save_button.click()

    # Verify the change
    updated_time = wait.until(EC.presence_of_element_located((By.XPATH, '//table//td[text()="10:00 AM - 12:00 PM"]')))
    assert updated_time.text == "10:00 AM - 12:00 PM", "Time slot was not updated correctly!"

    print("Test completed successfully.")

finally:
    # Close the driver after test
    driver.quit()
