@allure.step("Login to the application")
def login(page, email, password):
    print("Navigating to login page...")
    page.goto("http://localhost:3000/Login")
    page.wait_for_load_state("networkidle")  # Wait until the page has fully loaded

    try:
        page.wait_for_selector('xpath=//*[@id=":r1:"]', timeout=10000)  # Wait for the email input field to appear
        page.fill('xpath=//*[@id=":r1:"]', email)
        page.fill('xpath=//*[@id=":r3:"]', password)
        page.click('xpath=//*[@id="root"]/div/div/div[2]/div[2]/button[1]')
        page.wait_for_url('http://localhost:3000/')  # Wait until redirected to the home page
        print("Login successful")
    except Exception as e:
        page.screenshot(path="login_error.png")  # Take a screenshot for debugging
        print(f"An error occurred during login: {e}")
        raise e

    allure.attach(page.screenshot(full_page=True), name="Login Page Screenshot", attachment_type=allure.attachment_type.PNG)
