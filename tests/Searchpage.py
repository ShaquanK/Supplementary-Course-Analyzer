import allure
from playwright.sync_api import sync_playwright, expect

# List of devices to test on (common mobile types, tablets, desktops)
device_list = [
    "iPhone 12",
    "iPad Pro 11",
    "Galaxy S5",
    "Desktop 1280x800",  # A custom desktop resolution
    "Desktop 1920x1080",  # Another custom desktop resolution
]

@allure.step("Login to the application")
def login(page, email, password):
    page.goto("http://localhost:3000/Login")
    page.fill('xpath=//*[@id=":r1:"]', email)
    page.fill('xpath=//*[@id=":r3:"]', password)
    page.click('xpath=//*[@id="root"]/div/div/div[2]/div[2]/button[1]')
    page.wait_for_url('http://localhost:3000/')  # Wait until redirected to the home page
    allure.attach(page.screenshot(full_page=True), name="Login Page Screenshot", attachment_type=allure.attachment_type.PNG)

@allure.step("Test CourseTimeAnalyzer page with pagination check")
def test_course_time_analyzer():
    with sync_playwright() as p:
        # List of available browsers with their names
        browsers = [
            {"browser": p.chromium, "name": "chromium"},
            {"browser": p.firefox, "name": "firefox"},
            {"browser": p.webkit, "name": "webkit"}
        ]
        
        # Iterate through browsers
        for browser_info in browsers:
            browser_type = browser_info["browser"]
            browser_name = browser_info["name"]
            
            with allure.step(f"Testing with {browser_name.capitalize()}"):
                browser = browser_type.launch(headless=False)  # Launch browser
                context = browser.new_context()

                # Capture console messages and print them
                def on_console_message(msg):
                    print(f"Console log: {msg.text}")
                    # Optionally, you can attach this to Allure for reporting
                    allure.attach(msg.text, name="Console Log", attachment_type=allure.attachment_type.TEXT)

                # Listen to console messages
                page = context.new_page()
                page.on("console", on_console_message)

                try:
                    # Iterate through device list
                    for device_name in device_list:
                        with allure.step(f"Testing on {device_name}"):

                            if device_name == "Desktop 1280x800":
                                context.set_viewport_size({"width": 1280, "height": 800})
                            elif device_name == "Desktop 1920x1080":
                                context.set_viewport_size({"width": 1920, "height": 1080})
                            else:
                                device = p.devices.get(device_name)
                                # Create context with device emulation
                                context = browser.new_context(**device)

                            # Create a new page after setting the context for device emulation
                            page = context.new_page()

                            # Perform login
                            login(page, "Davidchatla@yahoo.com", "test123")
                            
                            # Navigate to CourseTimeAnalyzer page
                            page.goto("http://localhost:3000/CourseTimeAnalyzer")
                            page.wait_for_selector('//input[@aria-label="Search Time Slots"]')
                            allure.attach(page.screenshot(full_page=True), name=f"CourseTimeAnalyzer_Page_{device_name}_{browser_name.capitalize()}", attachment_type=allure.attachment_type.PNG)
                            

                finally:
                    browser.close()
