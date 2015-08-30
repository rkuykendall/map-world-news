import sys

import unittest
from selenium import webdriver
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


class TestBrowser(unittest.TestCase):
    """
    Use selenium to execute functions on the app and test them.
    At the moment, a server must be running using `foreman start`
    """

    def setUp(self):
        self.driver = webdriver.Firefox()
        self.driver.get("http://0.0.0.0:5000")

    def tearDown(self):
        self.driver.quit()

    def page_load_test(self):
        assert "World News" in self.driver.title

    def stories_load_test(self):
        try:
            WebDriverWait(self.driver, 15).until(
                EC.presence_of_element_located((By.CLASS_NAME, "story"))
            )
        except TimeoutException:
            assert False
        except:
            print "Unexpected error:", sys.exc_info()[0]
            assert False

        assert True
