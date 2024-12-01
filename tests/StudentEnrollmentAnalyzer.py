from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains
import time

# Initialize the driver
driver = webdriver.Chrome()

try:
    # Open the StudentEnrollmentAnalyzerMainPage
    driver.get("http://localhost:3000/StudentEnrollmentAnalyzerMainPage")

    # Wait for the table to load
    wait = WebDriverWait(driver, 10)
    table = wait.until(EC.presence_of_element_located((By.XPATH, '//table')))

    # Test: Verify the table headers
    headers = table.find_elements(By.XPATH, './/th')
    assert headers[0].text == "Course Name", "Header 'Course Name' not found!"
    assert headers[1].text == "Course Section", "Header 'Course Section' not found!"
    assert headers[2].text == "Open Availability", "Header 'Open Availability' not found!"

    # Test: Verify pagination works
    next_page_button = wait.until(EC.element_to_be_clickable((By.XPATH, '//button[@aria-label="Next page"]')))
    next_page_button.click()
    time.sleep(2)  # Allow time for the page to update
    assert "aria-disabled" not in next_page_button.get_attribute("class"), "Pagination failed!"

    # Test: Search for a specific course availability
    course_name = "BIO 22" 
    rows = table.find_elements(By.XPATH, './/tbody/tr')
    for row in rows:
        course_cell = row.find_element(By.XPATH, './/td[1]')
        if course_cell.text == course_name:
            availability_cell = row.find_element(By.XPATH, './/td[3]')
            assert "No available time slots" not in availability_cell.text, f"No availability found for {course_name}!"
            print(f"Availability for {course_name}: {availability_cell.text}")

    # Test: Verify time slot formatting
    open_availability_cells = table.find_elements(By.XPATH, './/td[3]/ul/li')
    for cell in open_availability_cells:
        time_text = cell.text.split(": ")[1]
        assert "AM" in time_text or "PM" in time_text, f"Invalid time format: {time_text}"

    print("All tests passed successfully.")

finally:
    # Close the driver after test
    driver.quit()
